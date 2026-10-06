# BUG-API-001: Cart API accepts negative quantity (-5)

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-API-001 |
| **Title** | Cart API accepts negative quantity (-5) |
| **Severity** | High (tester's assessment) |
| **Priority** | High (tester's assessment) |
| **Environment** | https://dummyjson.com, REST Assured 5.5 + JUnit 5, run on 06-Oct-2026 |
| **Affected component** | POST /carts/add |
| **Status** | Open |

## Preconditions
None (public endpoint).

## Steps to reproduce
1. Send `POST /carts/add` with body `{ "userId": 1, "products": [ { "id": 144, "quantity": -5 } ] }`

## Expected result
The request is rejected with a 4xx status and an error message.

## Actual result
HTTP **201 Created**. The response contains `quantity: -5`, `total: -224.95` and `totalQuantity: -5` (negative totals).

## Evidence
Test `ErrorHandlingApiTest#negativeQuantity` (tag `known-bug`), output captured during `mvn test "-DexcludedGroups=none"`.
