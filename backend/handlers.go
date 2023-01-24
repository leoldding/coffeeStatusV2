package main

import (
	"database/sql"
	"encoding/json"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Status struct {
	Status    string `json:"status"`
	Substatus string `json:"substatus"`
}

func isCookieExpired(c *http.Cookie) bool {
	return time.Now().Before(c.Expires)
}

func createNewSession(w http.ResponseWriter, username string) {
	sessionToken := uuid.New().String()
	expiresAt := time.Now().Add(10 * time.Minute)

	_, err := postgres.Exec("INSERT INTO coffeeSessions(sessionname, username, expiration) VALUES ($1, $2, $3);", sessionToken, username, expiresAt)
	if err != nil {
		log.Printf("Error inserting session into database: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "sessionToken",
		Value:    sessionToken,
		Expires:  expiresAt,
		HttpOnly: true,
		Path:     "/",
	})
}

func checkSession(w http.ResponseWriter, r *http.Request) {
	sessionToken, err := r.Cookie("sessionToken")
	if err != nil {
		log.Printf("Cookie does not exist: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if isCookieExpired(sessionToken) {
		_, err = postgres.Exec("DELETE FROM coffeeSessions WHERE sessionname = $1", sessionToken.Value)
		if err != nil {
			log.Printf("Error deleting session from database: %v", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
	}

	var username string
	row := postgres.QueryRow("SELECT username FROM coffeeSessions WHERE sessionname = $1", sessionToken.Value)
	err = row.Scan(&username)
	if err != nil {
		log.Printf("Error retrieving username from previous session; %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	createNewSession(w, username)

	w.WriteHeader(http.StatusOK)
	return
}

func login(w http.ResponseWriter, r *http.Request) {
	var user User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Printf("JSON decoding error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	var password []byte

	row := postgres.QueryRow("SELECT password FROM coffeeAdmins WHERE adminname = $1", user.Username)
	err = row.Scan(&password)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("User is not in database. %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		} else {
			log.Printf("Database error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	err = bcrypt.CompareHashAndPassword(password, []byte(user.Password))
	if err != nil {
		log.Printf("Incorrect password: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	_, err = postgres.Exec("DELETE FROM coffeeSessions WHERE username = $1", user.Username)
	if err != nil {
		log.Printf("Error deleting previous user sessions: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	createNewSession(w, user.Username)

	w.WriteHeader(http.StatusOK)
	return
}

func logout(w http.ResponseWriter, r *http.Request) {
	sessionToken, err := r.Cookie("sessionToken")
	if err != nil {
		log.Printf("Session does not exist: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "sessionToken",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Path:     "/",
	})

	_, err = postgres.Exec("DELETE FROM coffeeSessions WHERE sessionname = $1", sessionToken.Value)
	if err != nil {
		log.Printf("Error deleting session from database: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
	return
}

func statusUpdate(w http.ResponseWriter, r *http.Request) {
	sessionToken, err := r.Cookie("sessionToken")
	if err != nil {
		log.Printf("Session does not exist: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if isCookieExpired(sessionToken) {
		log.Printf("Session has expired: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	var username string
	row := postgres.QueryRow("SELECT username FROM coffeeSessions WHERE sessionname = $1", sessionToken.Value)
	err = row.Scan(&username)
	if err != nil {
		log.Printf("Error retrieving username from session: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	createNewSession(w, username)

	var status Status
	err = json.NewDecoder(r.Body).Decode(&status)
	if err != nil {
		log.Printf("Error decoding status JSON: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = postgres.Exec("UPDATE coffeeStatus SET status = $1, substatus = $2", status.Status, status.Substatus)
	if err != nil {
		log.Printf("Error updating status in database: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	return
}

func retrieveStatus(w http.ResponseWriter, r *http.Request) {
	var fullStatus Status
	var status string
	var substatus string

	row := postgres.QueryRow("SELECT * FROM coffeeStatus")
	err := row.Scan(&status, &substatus)
	if err != nil {
		log.Printf("Error retrieving status from database: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fullStatus.Status = status
	fullStatus.Substatus = substatus

	returnStatus, err := json.Marshal(&fullStatus)
	if err != nil {
		log.Printf("Error marshalling status to JSON: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(returnStatus)
	return
}
