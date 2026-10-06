# Bug Reports

Only bugs actually observed during test runs are listed.

| ID | Title | Severity | Priority | Layer | Status |
|----|-------|----------|----------|-------|--------|
| [BUG-001](BUG-001.md) | problem_user sees the same image for every product | Medium | Low | UI | Open |
| [BUG-002](BUG-002.md) | problem_user cannot type in the Last Name field at checkout | High | High | UI | Open |
| [BUG-003](BUG-003.md) | Blank page, no error message, when the app fails to load (HTTP 500) | Medium | Medium | UI | Open |
| [BUG-004](BUG-004.md) | Checkout allowed with an empty cart | Medium | Medium | UI | Open |
| [BUG-API-001](BUG-API-001.md) | Cart API accepts negative quantity (-5) | High | High | API | Open |
| [BUG-API-002](BUG-API-002.md) | Cart API accepts zero and non-numeric quantity | Medium | Medium | API | Open |
| [BUG-API-003](BUG-API-003.md) | Invalid token returns 500 instead of 401 | Medium | Medium | API | Open |
| [BUG-API-004](BUG-API-004.md) | Cart accepts a non-existent product ID | Medium | Medium | API | Open |

> BUG-001 to BUG-003 are covered by tests marked `test.fail()` and were observed as failing assertions in a local run
> (reported as expected failures). Severity/priority are the tester's assessment. Demo apps are public and can change, so re-verify.
