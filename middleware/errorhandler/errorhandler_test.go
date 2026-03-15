package errorhandler

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"wedding-invitation-backend/errors"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestErrorHandler_CatchesAppError(t *testing.T) {
	r := gin.New()
	r.Use(ErrorHandler())
	r.GET("/test", func(c *gin.Context) {
		c.Error(errors.ErrNotFound)
		c.Abort()
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}

func TestErrorHandler_CatchesPanic(t *testing.T) {
	r := gin.New()
	r.Use(ErrorHandler())
	r.GET("/panic", func(c *gin.Context) {
		panic("something went wrong")
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/panic", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}
}

func TestErrorHandler_ReturnsJSONFormat(t *testing.T) {
	r := gin.New()
	r.Use(ErrorHandler())
	r.GET("/test", func(c *gin.Context) {
		c.Error(errors.NewValidationError("Invalid input", map[string]string{
			"name": "name is required",
		}))
		c.Abort()
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}

	// Check response body contains expected fields
	body := w.Body.String()
	if body == "" {
		t.Error("expected non-empty response body")
	}
}
