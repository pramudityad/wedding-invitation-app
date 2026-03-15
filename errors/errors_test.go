package errors

import (
	"net/http"
	"testing"
)

func TestAppError_Error(t *testing.T) {
	err := &AppError{
		Code:    http.StatusNotFound,
		Message: "Guest not found",
	}
	if err.Error() != "Guest not found" {
		t.Errorf("expected 'Guest not found', got '%s'", err.Error())
	}
}

func TestAppError_Unwrap(t *testing.T) {
	inner := &AppError{Code: 400, Message: "inner"}
	err := &AppError{
		Code:    500,
		Message: "outer",
		Err:     inner,
	}
	if unwrapped := err.Unwrap(); unwrapped != inner {
		t.Error("expected inner error to be unwrapped")
	}
}

func TestPredefinedErrors(t *testing.T) {
	tests := []struct {
		name     string
		err      *AppError
		expected int
	}{
		{"Unauthorized", ErrUnauthorized, http.StatusUnauthorized},
		{"Forbidden", ErrForbidden, http.StatusForbidden},
		{"NotFound", ErrNotFound, http.StatusNotFound},
		{"BadRequest", ErrBadRequest, http.StatusBadRequest},
		{"Internal", ErrInternal, http.StatusInternalServerError},
		{"TooManyRequests", ErrTooManyRequests, http.StatusTooManyRequests},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.err.Code != tt.expected {
				t.Errorf("expected code %d, got %d", tt.expected, tt.err.Code)
			}
		})
	}
}

func TestNewValidationError(t *testing.T) {
	details := map[string]string{"name": "required"}
	err := NewValidationError("Validation failed", details)
	if err.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", err.Code)
	}
	if err.Details == nil {
		t.Error("expected details to be set")
	}
}

func TestWrapError(t *testing.T) {
	inner := &AppError{Code: 400, Message: "inner"}
	wrapped := WrapError(inner, "wrapped message")
	if wrapped.Message != "wrapped message" {
		t.Errorf("expected 'wrapped message', got '%s'", wrapped.Message)
	}
	if wrapped.Unwrap() != inner {
		t.Error("expected inner error to be preserved")
	}
}
