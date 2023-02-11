package main

import (
	"net/http"
)

func main() {
	connectToPostgres()
	coffeeInitDB()

	http.HandleFunc("/ping", ping)
	http.HandleFunc("/coffeeCheckSession", coffeeCheckSession)
	http.HandleFunc("/coffeeLogin", coffeeLogin)
	http.HandleFunc("/coffeeLogout", coffeeLogout)
	http.HandleFunc("/coffeeStatusUpdate", coffeeStatusUpdate)
	http.HandleFunc("/coffeeRetrieveStatus", coffeeRetrieveStatus)

	http.ListenAndServe(":8080", nil)
}

func ping(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	return
}
