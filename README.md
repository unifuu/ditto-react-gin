# Ditto-React-Gin

## Memo

``` cmd
docker exec -it 25b bash

db.game.updateMany({}, { $rename: { 'play_time': 'total_time' } })
db.act.deleteMany({})
db.word.drop( {} )
```

### [Go] Run

``` cmd
sudo nohup ./ditto &
```

### [Ubuntu] Kill process

``` cmd
sudo kill -9 `sudo lsof -t -i:80`
sudo kill -9 `sudo lsof -t -i:443`
```

### [Ubuntu] Install React

``` cmd
sudo apt install npm

npm --version
node --version
```

### [Ubuntu] Update Go version

``` cmd
sudo apt-get remove golang-go
sudo apt-get remove --auto-remove golang-go

sudo rm -rvf /usr/local/go

wget https://golang.org/dl/go1.19.2.linux-amd64.tar.gz
sudo tar -C /usr/local -xvf go1.19.2.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

### [Ubuntu] Deploy Locally

``` cmd
cd client
npm install
npm run build
<!-- mv build/ ../server/web -->


### [Docker] Deployment

``` cmd
sudo docker exec –it abc bash
docker build -t ditto-go-react .
docker run -p 80:8080 -d ditto-go-react

docker-compose up -d --build
```

### [Docker] Delete all images

``` cmd
docker image prune
```

### [Docker] Download assets from container

``` cmd
sudo docker cp ???:/assets/images/games ~/assets/2022????
```

### [MongoDB] Backup databse

``` cmd
# AWS EC2: Docker → Ubuntu
sudo docker exec 25b mongodump --db ditto --out /mongodump/20240204
sudo docker cp 25b:/mongodump/20240204 ~/mongodump/20240204
```

### [MongoDB] Restore database

``` cmd
# Windows
docker cp mongodump_20230806 8ed:/mongodump_20230806
docker exec -i 8ed /usr/bin/mongorestore --db ditto /mongodump_20230806/ditto

# Mac
sudo docker cp 20240204 d97:/mongodump_20240204
e
```

### [React] Run program

``` cmd
npm install
npm run start
```

### [Redis] Delete all data

``` redis-cli
# Get all keys
keys *

flushall
```

## References

- [Deploying Go + React to Heroku using Docker](https://levelup.gitconnected.com/deploying-go-react-to-heroku-using-docker-9844bf075228)
- [mgo - MongoDB driver for Go](https://github.com/go-mgo/mgo)
