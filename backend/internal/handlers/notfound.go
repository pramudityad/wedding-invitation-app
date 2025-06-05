package handlers

import "net/http"

// NotFoundHandler is exported so main.go can reference it
func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("<h1>404 - Invitation Not Found</h1>"))
}
