# BUG-API-004: Cart accepts a non-existent product ID

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-API-004 |
| **Title** | Cart accepts a non-existent product ID |
| **Severity** | Medium (tester's assessment) |
| **Priority** | Medium (tester's assessment) |
| **Environment** | https://dummyjson.com, REST Assured 5.5 + JUnit 5, run on 06-Oct-2026 |
| **Affected component** | POST /carts/add |
| **Status** | Open |

## Preconditions
None. `GET /products/999999` returns 404, so the product does not exist.

## Steps to reproduce
1. Send `POST /carts/add` with `{ "userId": 1, "products": [ { "id": 999999, "quantity": 1 } ] }`

## Expected result
A 4xx status (404 or 400) stating that the product does not exist.

## Actual result
HTTP **201 Created** with an empty product list (`totalProducts: 0`, `total: 0`).

## Evidence
Test `CartApiTest#addUnknownProduct` (tag `known-bug`).
