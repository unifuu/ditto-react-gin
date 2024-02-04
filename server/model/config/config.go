// app.json model

package config

import (
	"encoding/json"
	"io"
	"log"
	"os"
)

const (
	APP_JSON = "config/app.json"
)

var Config *config

// var cfgFile = "config/app.json"

type config struct {
	// Mode : "debug", "release", "test"
	GinMode string `json:"GinMode"`

	// Port
	HttpPort  int `json:"HttpPort"`
	HttpsPort int `json:"HttpsPort"`
	TcpPort   int `json:"TcpPort"`

	// GitHub
	GitHubPersonalAccessToken string `json:"GitHubPersonalAccessToken"`

	// OpenAI
	OpenAIToken string `json:"OpenAIToken"`

	// TLS file path
	// TlsCertFile : "/etc/letsencrypt/live/domain.dev/fullchain.pem"
	// TlsKeyFile : "/etc/letsencrypt/live/domain.dev/privkey.pem"
	TlsCertFile string `json:"TlsCertFile"`
	TlsKeyFile  string `json:"TlsKeyFile"`

	// Firebase
	FirebaseStorageBucket   string `json:"FirebaseStorageBucket"`
	FirebaseCredentialsFile string `json:"FirebaseCredentialsFile"`

	// LineBot
	LineChannelSecret string `json:"LineChannelSecret"`
	LineChannelToken  string `json:"LineChannelToken"`

	// Database
	MySQL   MySQLCfg `json:"MySQL"`
	MongoDB MongoCfg `json:"MongoDB"`
	Redis   RedisCfg `json:"Redis"`
}

func LoadAppConfig() {
	// Open app.json
	file, err := os.Open(APP_JSON)
	if err != nil {
		log.Panic("Unable to open", APP_JSON, err)
	}

	// Read app.json as a byte array
	cfgByte, _ := io.ReadAll(file)

	// Parse json to struct
	json.Unmarshal(cfgByte, &Config)
}

type MySQLCfg struct {
	Username string `json:"Username"`
	Password string `json:"Password"`
	Database string `json:"Database"`
}

type MongoCfg struct {
	URL      string `json:"URL"`
	Database string `json:"Database"`
	Username string `json:"Username"`
	Password string `json:"Password"`
}

type RedisCfg struct {
	Size     int    `json:"Size"`
	Network  string `json:"Network"`
	Address  string `json:"Address"`
	Password string `json:"Password"`
}
