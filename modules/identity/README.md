# Identity Module

## Purpose

Provides authentication, authorization, user management, and role-based access control for the tProkash ecosystem. Manages who can access the system and what they are allowed to do.

## Responsibilities

- User registration, authentication, and session management
- Role and permission management
- API client authentication and token management
- User profile management
- Audit logging of authentication events

## Owned Data

- `user` — System users
- `role` — Named roles (admin, editor, viewer, etc.)
- `permission` — Granular permissions
- `role_permission` — Role-to-permission assignments
- `api_client` — API client credentials and tokens
- `audit_log` — Authentication and authorization audit events

## Dependencies

- `core` — Base types, ID generation, shared validators

## Public Interfaces

- Authentication: `authenticate(credentials)` / `validateToken(token)`
- Authorization: `hasPermission(userId, permission)` / `hasRole(userId, role)`
- User management: `createUser` / `updateUser` / `getUser` / `deactivateUser`
- API key management: `issueKey` / `revokeKey` / `validateKey`

## Future Features

- OAuth 2.0 / OpenID Connect provider support
- Two-factor authentication
- Social login integration
- Session revocation and forced logout
- Rate limiting per API client

## Out of Scope

- Publisher, author, or book entity management
- Content moderation (see `community` module)
- Data import/export workflows
- Publishing workflow permissions (see `publishing` module)
