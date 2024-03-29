package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
)

var postgres *sql.DB

func connectToPostgres() {
	// create postgres uri
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable", os.Getenv("PGHOST"), os.Getenv("PGPORT"), os.Getenv("PGUSER"), os.Getenv("PGPASSWORD"), os.Getenv("PGDATABASE"))

	var err error

	// connect to Postgres database
	postgres, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Printf("Error connecting to Postgres database: %v", err)
	}
	return
}

func coffeeInitDB() {
	// create tables on initial setup
	
	_, err := postgres.Exec("CREATE TABLE IF NOT EXISTS coffeeSessions(sessionname TEXT PRIMARY KEY, username VARCHAR(40), expiration TIMESTAMP WITH TIME ZONE);")
	if err != nil {
		log.Printf("Error creating sessions table in Postgres: %v", err)
		return
	}

	_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS coffeeAdmins(adminname VARCHAR(40) PRIMARY KEY, password TEXT);")
	if err != nil {
		log.Printf("Error creating admins table in Postgres: %v", err)
		return
	}

	_, err = postgres.Exec("CREATE TABLE IF NOT EXISTS coffeeStatus(status VARCHAR(40), substatus TEXT);")
	if err != nil {
		log.Printf("Error creating status table in Postgres: %v", err)
		return
	}

	// add admin account on initial setup
	var count int
	row := postgres.QueryRow("SELECT COUNT(*) FROM coffeeAdmins;")
	err = row.Scan(&count)
	if err != nil {
		log.Printf("Error counting rows in admins: %v", err)
		return
	}
	if count == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(os.Getenv("COFFEEADMINPASSWORD")), 8)
		_, err = postgres.Exec("INSERT INTO coffeeAdmins(adminname, password) VALUES ($1, $2);", os.Getenv("COFFEEADMINNAME"), hashedPassword)
		if err != nil {
			log.Printf("Error inserting admin credentials into database: %v", err)
			return
		}
	}

	// add initial status
	row = postgres.QueryRow("SELECT COUNT(*) FROM coffeeStatus;")
	err = row.Scan(&count)
	if err != nil {
		log.Printf("Error counting rows in status: %v", err)
		return
	}
	if count == 0 {
		_, err = postgres.Exec("INSERT INTO coffeeStatus(status, substatus) VALUES ($1, $2);", "Yes", "*Temp*")
		if err != nil {
			log.Printf("Error inserting status into database: %v", err)
			return
		}
	}

	return
}
