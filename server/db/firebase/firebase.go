package firebase

import (
	"bytes"
	"context"
	"ditto/model/config"
	"ditto/model/todo"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"reflect"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

var (
	bkt *storage.BucketHandle
	cli *firestore.Client
	ctx context.Context
)

func All(col string, addr interface{}) error {
	iter := cli.Collection(col).Documents(ctx)
	resultv := reflect.ValueOf(addr)
	if resultv.Kind() != reflect.Ptr || resultv.Elem().Kind() != reflect.Slice {
		panic("Result argument must be a slice address")
	}
	slicev := resultv.Elem()
	slicev = slicev.Slice(0, slicev.Cap())
	elemt := slicev.Type().Elem()
	i := 0
	for {
		elemp := reflect.New(elemt)
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Println("Failed to iterate:", err)
			return err
		}
		if err := doc.DataTo(elemp.Interface()); err != nil {
			log.Println("Failed to convert:", err)
			return err
		}

		slicev = reflect.Append(slicev, elemp.Elem())
		slicev = slicev.Slice(0, slicev.Cap())
		i++
	}
	resultv.Elem().Set(slicev.Slice(0, i))
	return nil
}

func ByID(col string, id string, T interface{}) error {
	dsnap, err := cli.Collection(col).Doc(id).Get(ctx)
	if err != nil {
		log.Println(err)
		return err
	}
	return dsnap.DataTo(&T)
}

func Create(c string, m map[string]interface{}) error {
	_, _, err := cli.Collection(c).Add(ctx, m)
	return err
}

func DeleteByID(col string, id string) error {
	_, err := cli.Collection(col).Doc(id).Delete(ctx)
	return err
}

func Delete(col string, path string, op string, value interface{}) error {
	iter := cli.Collection(col).Where(path, op, value).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		var todo todo.Todo
		if err := doc.DataTo(&todo); err != nil {
			return err
		}

		err = DeleteByID(col, todo.ID)
		if err != nil {
			return err
		}
	}
	return nil
}

func Update(col string, id string, m map[string]interface{}) error {
	_, err := cli.Collection(col).Doc(id).Set(ctx, m, firestore.MergeAll)

	if err != nil {
		log.Println("An error has occurred:", err)
	}
	return err
}

func Init() {
	var err error
	var cfg *firebase.Config
	var opt option.ClientOption
	ctx = context.Background()

	cfg = &firebase.Config{
		StorageBucket: config.Config.FirebaseStorageBucket,
	}
	opt = option.WithCredentialsFile(config.Config.FirebaseCredentialsFile)

	app, err := firebase.NewApp(ctx, cfg, opt)
	if err != nil {
		log.Println(err)
	}

	// Storage client
	stoCli, err := app.Storage(context.Background())
	if err != nil {
		log.Println(err)
	}

	bkt, err = stoCli.DefaultBucket()
	if err != nil {
		log.Println(err)
	}

	// Firestore client
	cli, err = app.Firestore(ctx)
	if err != nil {
		log.Println(err)
	}
	// defer cli.Close()
}

// func Upload(fileInput []byte, fileName string) error
func Upload(header *multipart.FileHeader, rename string) error {
	if bkt == nil {
		return fmt.Errorf("bucket is not initialized")
	}

	file, err := header.Open()
	if err != nil {
		return err
	}

	data, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	object := bkt.Object(rename)
	writer := object.NewWriter(ctx)
	defer writer.Close()

	if _, err := io.Copy(writer, bytes.NewReader(data)); err != nil {
		return err
	}

	if err := object.ACL().Set(context.Background(), storage.AllUsers, storage.RoleReader); err != nil {
		return err
	}

	return nil
}
