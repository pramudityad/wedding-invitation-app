package ratelimit

import (
	"testing"
	"time"
)

func TestRateLimiter_AllowsWithinLimit(t *testing.T) {
	limiter := NewSlidingWindowLimiter(5, time.Minute)

	for i := 0; i < 5; i++ {
		if !limiter.Allow("user1") {
			t.Errorf("request %d should be allowed", i+1)
		}
	}
}

func TestRateLimiter_BlocksOverLimit(t *testing.T) {
	limiter := NewSlidingWindowLimiter(3, time.Minute)

	// Use up the limit
	for i := 0; i < 3; i++ {
		limiter.Allow("user1")
	}

	// Next request should be blocked
	if limiter.Allow("user1") {
		t.Error("request over limit should be blocked")
	}
}

func TestRateLimiter_DifferentKeysIndependent(t *testing.T) {
	limiter := NewSlidingWindowLimiter(2, time.Minute)

	// User 1 uses their limit
	limiter.Allow("user1")
	limiter.Allow("user1")

	// User 2 should still have access
	if !limiter.Allow("user2") {
		t.Error("user2 should have independent limit")
	}
}

func TestRateLimiter_ResetsAfterWindow(t *testing.T) {
	limiter := NewSlidingWindowLimiter(2, 100*time.Millisecond)

	// Use up the limit
	limiter.Allow("user1")
	limiter.Allow("user1")

	// Wait for window to expire
	time.Sleep(150 * time.Millisecond)

	// Should be allowed again
	if !limiter.Allow("user1") {
		t.Error("request should be allowed after window expires")
	}
}

func TestRateLimiter_GetStats(t *testing.T) {
	limiter := NewSlidingWindowLimiter(5, time.Minute)

	limiter.Allow("user1")
	limiter.Allow("user1")
	limiter.Allow("user1")

	remaining := limiter.Remaining("user1")
	if remaining != 2 {
		t.Errorf("expected 2 remaining, got %d", remaining)
	}
}
