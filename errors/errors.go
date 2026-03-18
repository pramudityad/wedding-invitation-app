package errors

import (
	"fmt"
	"net/http"
)

// AppError represents a structured application error
type AppError struct {
	Code    int                    `json:"code"`
	Message string                 `json:"message"`
	Details map[string]string      `json:"details,omitempty"`
	Err     error                  `json:"-"`
}

func (e *AppError) Error() string {
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// Predefined errors for common cases
var (
	ErrUnauthorized     = &AppError{Code: http.StatusUnauthorized, Message: "Unauthorized"}
	ErrForbidden        = &AppError{Code: http.StatusForbidden, Message: "Forbidden"}
	ErrNotFound         = &AppError{Code: http.StatusNotFound, Message: "Resource not found"}
	ErrBadRequest       = &AppError{Code: http.StatusBadRequest, Message: "Bad request"}
	ErrInternal         = &AppError{Code: http.StatusInternalServerError, Message: "Internal server error"}
	ErrTooManyRequests  = &AppError{Code: http.StatusTooManyRequests, Message: "Too many requests"}
)

// NewValidationError creates a validation error with details
func NewValidationError(message string, details map[string]string) *AppError {
	return &AppError{
		Code:    http.StatusBadRequest,
		Message: message,
		Details: details,
	}
}

// WrapError wraps an existing error with additional context
func WrapError(err error, message string) *AppError {
	if appErr, ok := err.(*AppError); ok {
		return &AppError{
			Code:    appErr.Code,
			Message: message,
			Err:     appErr,
		}
	}
	return &AppError{
		Code:    http.StatusInternalServerError,
		Message: message,
		Err:     err,
	}
}

// IsAppError checks if an error is an AppError
func IsAppError(err error) (*AppError, bool) {
	if appErr, ok := err.(*AppError); ok {
		return appErr, true
	}
	return nil, false
}

// FormatError creates a formatted error message
func FormatError(format string, args ...interface{}) *AppError {
	return &AppError{
		Code:    http.StatusInternalServerError,
		Message: fmt.Sprintf(format, args...),
	}
}
