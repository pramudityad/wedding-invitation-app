package ratelimit

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	"wedding-invitation-backend/ratelimit"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRateLimitMiddleware_BlocksOverLimit(t *testing.T) {
	limiter := ratelimit.NewSlidingWindowLimiter(2, time.Minute)
	r := gin.New()
	r.Use(Middleware(limiter))
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// First two should succeed
	for i := 0; i < 2; i++ {
		w := httptest.NewRecorder()
		req := httptest.NewRequest("GET", "/test", nil)
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("request %d should succeed, got %d", i+1, w.Code)
		}
	}

	// Third should be blocked
	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusTooManyRequests {
		t.Errorf("request 3 should be blocked, got %d", w.Code)
	}
}

func TestRateLimitMiddleware_IncludesHeaders(t *testing.T) {
	limiter := ratelimit.NewSlidingWindowLimiter(5, time.Minute)
	r := gin.New()
	r.Use(Middleware(limiter))
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-RateLimit-Limit") != "5" {
		t.Error("expected X-RateLimit-Limit header")
	}
	if w.Header().Get("X-RateLimit-Remaining") == "" {
		t.Error("expected X-RateLimit-Remaining header")
	}
}

func TestRateLimitMiddleware_CustomKeyFunc(t *testing.T) {
	limiter := ratelimit.NewSlidingWindowLimiter(1, time.Minute)
	r := gin.New()
	r.Use(MiddlewareWithKeyFunc(limiter, func(c *gin.Context) string {
		return "fixed-key"
	}))
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// First request succeeds
	w1 := httptest.NewRecorder()
	req1 := httptest.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w1, req1)
	if w1.Code != http.StatusOK {
		t.Errorf("first request should succeed, got %d", w1.Code)
	}

	// Second request blocked (same key)
	w2 := httptest.NewRecorder()
	req2 := httptest.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusTooManyRequests {
		t.Errorf("second request should be blocked, got %d", w2.Code)
	}
}
