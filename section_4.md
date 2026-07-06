# Section 4 – WebSockets & Async Fundamentals

## Task 1 – Difference Between HTTP and WebSocket

HTTP follows a request-response model. The client sends a request, the server responds, and the connection closes. A WebSocket creates a persistent connection that stays open, allowing both the client and the server to send messages to each other at any time.

### Task 3 – Features That Need WebSockets vs Those That Don't
Need WebSockets:
1. Real-time Chat
2. Live Notifications
3. Online/Offline User Presence

Do Not Need WebSockets:
1. User Login
2. User Registration
3. Fetching Project List


### Task 4 – WebSocket Connection Lifecycle

```
Client Opens App
        │
        ▼
WebSocket Connect
        │
        ▼
Server Accepts Connection
        │
        ▼
Client Sends Message
        │
        ▼
Server Receives Message
        │
        ▼
Server Sends Response
        │
        ▼
Client Receives Response
        │
        ▼
Client Disconnects
        │
        ▼
Connection Closed
```

**Explanation:**
1. The client opens a WebSocket connection.
2. The server accepts the connection.
3. The client sends a message.
4. The server processes the message.
5. The server sends a response back.
6. The client receives the response.
7. The client disconnects, and the connection is closed.