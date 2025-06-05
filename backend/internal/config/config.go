package config

import (
	"io/ioutil"
	"log"

	"gopkg.in/yaml.v3"
)

// Config represents global settings from config.yaml
type Config struct {
	Theme struct {
		PrimaryColor string `yaml:"primaryColor"`
		FontFamily   string `yaml:"fontFamily"`
	} `yaml:"theme"`
	HeaderImage     string `yaml:"headerImage"`
	FooterImage     string `yaml:"footerImage"`
	BackgroundImage string `yaml:"backgroundImage"`

	MusicURL string `yaml:"musicUrl"`

	BankInfo struct {
		BankName       string `yaml:"bankName"`
		AccountNumber  string `yaml:"accountNumber"`
		AccountHolder  string `yaml:"accountHolder"`
		MailingAddress string `yaml:"mailingAddress"`
	} `yaml:"bankInfo"`

	MapEmbed string `yaml:"mapEmbed"`

	Admin struct {
		Password string `yaml:"password"`
	} `yaml:"admin"`
}

// LoadConfig reads and parses config.yaml into Config struct
func LoadConfig(path string) (*Config, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func MustLoad(path string) *Config {
	cfg, err := LoadConfig(path)
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}
	return cfg
}
