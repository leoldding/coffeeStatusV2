package main

import (
	_ "github.com/lib/pq"
	"net/http"
)

func main() {
	connectToPostgres()
	//initDB()

	http.HandleFunc("/ping", ping)
	http.HandleFunc("/checkSession", checkSession)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	http.HandleFunc("/statusUpdate", statusUpdate)
	http.HandleFunc("/retrieveStatus", retrieveStatus)

	http.ListenAndServe(":8080", nil)
}

func ping(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	return
}
