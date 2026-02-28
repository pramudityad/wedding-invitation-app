# FRONTEND API LAYER

**Generated:** 2026-02-28

Axios-based API clients with automatic JWT injection and 401 handling.

## STRUCTURE
```
api/
├── axiosConfig.js    # Base instance + interceptors
├── auth.js           # Login, validateToken
├── guest.js          # getGuestByName, submitRSVP, markOpened
└── comments.js       # getAllComments, submitComment (paginated)
```

## CONVENTIONS

### Axios Instance (axiosConfig.js)
```jsx
const api = axios.create({ baseURL: '/api' });

// Auto-inject JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('weddingToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('weddingToken');
      window.location.href = '/invite';
    }
    return Promise.reject(error);
  }
);
```

### API Function Pattern
```jsx
// Simple GET
export const getGuestByName = async (name, options = {}) => {
  const response = await api.get(`/guests/${name}`, options);
  return response.data;
};

// POST with body
export const submitRSVP = async (data) => {
  const response = await api.post('/rsvp', data);
  return response.data;
};
```

### Component Usage
```jsx
import { getAllComments, submitComment } from '../api/comments';

const handleSubmit = async (content) => {
  setIsLoading(true);
  try {
    await submitComment({ name: username, content });
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## ENDPOINTS
| File | Endpoints |
|------|-----------|
| auth.js | `POST /login/:name`, `GET /protected/validate` |
| guest.js | `GET /guests/:name`, `POST /rsvp`, `POST /mark-opened` |
| comments.js | `GET /comments`, `POST /comments` |

## WHERE TO LOOK
| Task | File |
|------|------|
| Add new endpoint | Create function in appropriate file |
| Change base URL | `axiosConfig.js` baseURL |
| Modify JWT handling | `axiosConfig.js` interceptors |
| Add request options | Pass `{ signal, timeout }` as second arg |

## NOTES
- Token stored as `weddingToken` in localStorage
- 401 triggers automatic redirect to `/invite`
- Supports AbortController signal for cancellation
- Dev proxy configured in `vite.config.js`
- Production proxy in `frontend/nginx.conf`
