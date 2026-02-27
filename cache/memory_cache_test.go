package cache

import (
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestMemoryCache_SetAndGet(t *testing.T) {
	cache := NewMemoryCache(5 * time.Minute)
	t.Cleanup(func() { cache.Stop() })

	cache.Set("key1", "value1")

	value, found := cache.Get("key1")
	assert.True(t, found)
	assert.Equal(t, "value1", value)
}

func TestMemoryCache_GetMissing(t *testing.T) {
	cache := NewMemoryCache(5 * time.Minute)
	t.Cleanup(func() { cache.Stop() })

	value, found := cache.Get("nonexistent")
	assert.False(t, found)
	assert.Nil(t, value)
}

func TestMemoryCache_GetExpired(t *testing.T) {
	// Create cache with very short TTL (10ms)
	cache := NewMemoryCache(10 * time.Millisecond)
	t.Cleanup(func() { cache.Stop() })

	cache.Set("expiring", "will_expire")

	// Verify it's there initially
	value, found := cache.Get("expiring")
	assert.True(t, found)
	assert.Equal(t, "will_expire", value)

	// Wait for expiration
	time.Sleep(20 * time.Millisecond)

	// Should return false after expiration
	value, found = cache.Get("expiring")
	assert.False(t, found)
	assert.Nil(t, value)
}

func TestMemoryCache_Delete(t *testing.T) {
	cache := NewMemoryCache(5 * time.Minute)
	t.Cleanup(func() { cache.Stop() })

	cache.Set("to_delete", "delete_me")

	// Verify it exists
	value, found := cache.Get("to_delete")
	assert.True(t, found)
	assert.Equal(t, "delete_me", value)

	// Delete it
	cache.Delete("to_delete")

	// Should no longer exist
	value, found = cache.Get("to_delete")
	assert.False(t, found)
	assert.Nil(t, value)
}

func TestMemoryCache_Clear(t *testing.T) {
	cache := NewMemoryCache(5 * time.Minute)
	t.Cleanup(func() { cache.Stop() })

	// Set multiple keys
	cache.Set("key1", "value1")
	cache.Set("key2", "value2")
	cache.Set("key3", "value3")

	// Verify size
	assert.Equal(t, 3, cache.Size())

	// Clear all
	cache.Clear()

	// Verify all are gone
	assert.Equal(t, 0, cache.Size())
	_, found := cache.Get("key1")
	assert.False(t, found)
	_, found = cache.Get("key2")
	assert.False(t, found)
	_, found = cache.Get("key3")
	assert.False(t, found)
}

func TestMemoryCache_Concurrent(t *testing.T) {
	t.Parallel()

	// Create cache with very short TTL to trigger expiration during test
	// The race occurs when Get() deletes an expired item under RLock
	// while another goroutine is doing Set/Delete with Lock
	cache := NewMemoryCache(1 * time.Millisecond)
	t.Cleanup(func() { cache.Stop() })

	var wg sync.WaitGroup
	numGoroutines := 100
	operationsPerGoroutine := 100

	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for j := 0; j < operationsPerGoroutine; j++ {
				key := "concurrent_key"

				// Set with new value (this uses Lock)
				cache.Set(key, id*operationsPerGoroutine+j)

				// Get - this uses RLock but may call delete() on expired items
				// which is a write operation under a read lock - DATA RACE
				cache.Get(key)

				// Also test with expiring keys to increase chance of expired items
				expiringKey := "expiring_" + string(rune('A'+id%26))
				cache.Set(expiringKey, j)
				time.Sleep(2 * time.Millisecond) // Let it expire
				cache.Get(expiringKey)           // This should trigger the race

				// Delete uses Lock
				if j%5 == 0 {
					cache.Delete(key)
				}
			}
		}(i)
	}

	wg.Wait()
}
