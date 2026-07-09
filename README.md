# Real-Time Collaboration Platform

A full-stack real-time collaboration platform built with **Django**, **Django REST Framework**, **Django Channels**, **Next.js**, and **WebSockets**.

This project demonstrates authentication, project management, task management, collaborative workspaces, real-time chat, shared notes, online presence, notifications, and secure file sharing.

# Features

## Authentication

- JWT Authentication
- User Registration
- Login
- Protected API Endpoints
- User Profile

## Project Management

- Create Projects
- Update Projects
- Delete Projects
- List Projects

## Task Management

- Create Tasks
- Assign Tasks to Projects
- Update Status
- Delete Tasks
- Search
- Filter
- Ordering
- Pagination

## Workspaces

- Create Workspaces
- Workspace Members
- Owner Management
- Role-based Membership

## Real-Time Chat

- Multiple Chat Rooms
- Instant Messaging
- Message History
- Room Switching
- WebSocket Communication

## Shared Notes

- Collaborative Editing
- Auto Save
- Real-Time Updates
- Workspace Notes

## Presence

- Live Online Status
- Online/Offline Indicator
- Workspace Presence

## Notifications

- Real-Time Notifications
- Notifications for Other Users
- Sender Excluded

## File Sharing

- Upload Files
- Workspace Attachments
- Member-only Access
- Secure File Permissions


# Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- Django Channels
- Daphne
- SQLite
- Simple JWT

## Frontend

- Next.js
- React
- TypeScript
- WebSocket API

## Other

- REST API
- JWT Authentication
- WebSockets
- ASGI

# Project Structure

```
Real-Time-Collaboration/
│
├── backend/
│   ├── accounts/
│   ├── chat/
│   ├── files/
│   ├── notes/
│   ├── notifications/
│   ├── projects/
│   ├── tasks/
│   ├── workspaces/
│   ├── config/
│   └── manage.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
├── README.md
└── requirements.txt
```

# Installation

## Clone Repository

```bash
git clone https://github.com/Ecxlipze/Python-Tasks-3.git

```
## Backend Setup

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Apply migrations

```bash
python manage.py migrate
```

Run backend

```bash
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

# Environment Variables

Backend

```
SECRET_KEY=your_secret_key

DEBUG=True
```

Frontend

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register/ |
| POST | /api/token/ |
| POST | /api/token/refresh/ |
| GET | /api/profile/ |


## Projects

| Method | Endpoint |
|---------|----------|
| GET | /api/projects/ |
| POST | /api/projects/ |
| PATCH | /api/projects/{id}/ |
| DELETE | /api/projects/{id}/ |


## Tasks

| Method | Endpoint |
|---------|----------|
| GET | /api/tasks/ |
| POST | /api/tasks/ |
| PATCH | /api/tasks/{id}/ |
| DELETE | /api/tasks/{id}/ |


## Workspaces

| Method | Endpoint |
|---------|----------|
| GET | /api/workspaces/ |
| POST | /api/workspaces/ |


## Notes

| Method | Endpoint |
|---------|----------|
| GET | /api/notes/ |
| POST | /api/notes/ |


## Files

| Method | Endpoint |
|---------|----------|
| GET | /api/files/ |
| POST | /api/files/ |

# WebSocket Endpoints

| Feature | Endpoint |
|----------|----------|
| Chat | ws://localhost:8000/ws/chat/{room}/ |
| Notes | ws://localhost:8000/ws/notes/{workspace}/ |
| Presence | ws://localhost:8000/ws/workspaces/{workspace}/ |
| Notifications | ws://localhost:8000/ws/notifications/ |

# Architecture

```
Next.js Frontend
        │
 REST API / WebSocket
        │
Django REST Framework
        │
 Django Channels
        │
SQLite Database
```

# Real-Time Flow

```
User Sends Message

        │

WebSocket Consumer

        │

Save Message

        │

Broadcast to Room

        │

Connected Users Receive Instantly
```

# Testing

The application has been tested for:

- JWT Authentication
- CRUD Operations
- WebSocket Connections
- Multi-user Chat
- Shared Notes
- Presence Tracking
- Notifications
- File Upload
- Workspace Permissions

# License
This project is for learning and portfolio purposes.