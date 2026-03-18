package config

import (
	"testing"
	"time"
)

func TestCacheConfigDefaults(t *testing.T) {
	// Reset and reload
	CacheGuestTTL = 0
	CacheCommentTTL = 0
	loadCacheConfig()

	if CacheGuestTTL != 5*time.Minute {
		t.Errorf("expected default guest TTL 5m, got %v", CacheGuestTTL)
	}
	if CacheCommentTTL != 2*time.Minute {
		t.Errorf("expected default comment TTL 2m, got %v", CacheCommentTTL)
	}
}

func TestRateLimitConfigDefaults(t *testing.T) {
	RateLimitAuthMax = 0
	RateLimitAuthWindow = 0
	loadRateLimitConfig()

	if RateLimitAuthMax != 5 {
		t.Errorf("expected default auth max 5, got %d", RateLimitAuthMax)
	}
	if RateLimitAuthWindow != time.Minute {
		t.Errorf("expected default auth window 1m, got %v", RateLimitAuthWindow)
	}
}

func TestBusinessConfigDefaults(t *testing.T) {
	loadBusinessConfig()

	if MaxCommentsPerGuest != 2 {
		t.Errorf("expected max comments 2, got %d", MaxCommentsPerGuest)
	}
}
