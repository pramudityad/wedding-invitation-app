package ratelimit

import (
	"sync"
	"time"
)

// SlidingWindowLimiter implements a sliding window rate limiter
type SlidingWindowLimiter struct {
	maxRequests int
	window      time.Duration
	requests    map[string][]time.Time
	mu          sync.RWMutex
}

// NewSlidingWindowLimiter creates a new sliding window rate limiter
func NewSlidingWindowLimiter(maxRequests int, window time.Duration) *SlidingWindowLimiter {
	return &SlidingWindowLimiter{
		maxRequests: maxRequests,
		window:      window,
		requests:    make(map[string][]time.Time),
	}
}

// Allow checks if a request is allowed for the given key
func (l *SlidingWindowLimiter) Allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	windowStart := now.Add(-l.window)

	// Get existing requests for this key
	requests, exists := l.requests[key]
	if !exists {
		l.requests[key] = []time.Time{now}
		return true
	}

	// Filter out requests outside the window
	validRequests := make([]time.Time, 0, len(requests))
	for _, t := range requests {
		if t.After(windowStart) {
			validRequests = append(validRequests, t)
		}
	}

	// Check if under limit
	if len(validRequests) >= l.maxRequests {
		l.requests[key] = validRequests
		return false
	}

	// Add current request
	validRequests = append(validRequests, now)
	l.requests[key] = validRequests
	return true
}

// Remaining returns the number of remaining requests for a key
func (l *SlidingWindowLimiter) Remaining(key string) int {
	l.mu.RLock()
	defer l.mu.RUnlock()

	requests, exists := l.requests[key]
	if !exists {
		return l.maxRequests
	}

	now := time.Now()
	windowStart := now.Add(-l.window)

	count := 0
	for _, t := range requests {
		if t.After(windowStart) {
			count++
		}
	}

	remaining := l.maxRequests - count
	if remaining < 0 {
		return 0
	}
	return remaining
}

// MaxRequests returns the maximum requests per window
func (l *SlidingWindowLimiter) MaxRequests() int {
	return l.maxRequests
}

// Cleanup removes old entries (call periodically)
func (l *SlidingWindowLimiter) Cleanup() {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	windowStart := now.Add(-l.window)

	for key, requests := range l.requests {
		validRequests := make([]time.Time, 0)
		for _, t := range requests {
			if t.After(windowStart) {
				validRequests = append(validRequests, t)
			}
		}

		if len(validRequests) == 0 {
			delete(l.requests, key)
		} else {
			l.requests[key] = validRequests
		}
	}
}
