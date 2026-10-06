# BUG-API-003: Invalid token returns HTTP 500 instead of 401

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-API-003 |
| **Title** | Invalid token returns HTTP 500 instead of 401 |
| **Severity** | Medium (tester's assessment) |
| **Priority** | Medium (tester's assessment) |
| **Environment** | https://dummyjson.com, REST Assured 5.5 + JUnit 5, run on 06-Oct-2026 |
| **Affected component** | GET /auth/me |
| **Status** | Open |

## Preconditions
None.

## Steps to reproduce
1. Send `GET /auth/me` with header `Authorization: Bearer this.is.not-a-valid-token`

## Expected result
HTTP 401 (or 403) with a clear message.

## Actual result
HTTP **500 Internal Server Error** with body `{ "message": "invalid token" }`.

## Evidence
Test `LoginApiTest#badToken` (tag `known-bug`).
