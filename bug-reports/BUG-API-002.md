# BUG-API-002: Cart API accepts zero and non-numeric quantity

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-API-002 |
| **Title** | Cart API accepts zero and non-numeric quantity |
| **Severity** | Medium (tester's assessment) |
| **Priority** | Medium (tester's assessment) |
| **Environment** | https://dummyjson.com, REST Assured 5.5 + JUnit 5, run on 06-Oct-2026 |
| **Affected component** | POST /carts/add |
| **Status** | Open |

## Preconditions
None.

## Steps to reproduce
1. Send `POST /carts/add` with `"quantity": 0` for product 144
2. Send the same request with `"quantity": "abc"`

## Expected result
Both requests are rejected with a 4xx status and a descriptive message.

## Actual result
- quantity `0`: HTTP **201**; the response shows `quantity: 1` (value silently changed).
- quantity `"abc"`: HTTP **201**; the response shows `quantity: null`, `total: null`, `totalQuantity: null`.

## Evidence
Tests `zeroQuantity` and `stringQuantity` in `ErrorHandlingApiTest` (tag `known-bug`).
