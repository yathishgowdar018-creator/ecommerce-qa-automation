# E-Commerce Test Automation Framework
**Playwright · TypeScript · REST Assured · Java · Maven · GitHub Actions**

## Overview
A QA automation framework that tests an **existing** e-commerce application through two layers: the browser UI and the REST API. No application was built. The apps below are the *Systems Under Test (SUT)*; this repository is the automation that tests them.

| Layer | System under test | Tooling |
|-------|-------------------|---------|
| Web / UI | [SauceDemo](https://www.saucedemo.com) | TypeScript + Playwright |
| API | [DummyJSON](https://dummyjson.com) (products, auth, carts, users) | Java + REST Assured + JUnit 5 |

```
Existing app ── Web UI ── Playwright + TS ──┐
             └─ API ───── REST Assured + Java ┤
                                              ▼
                              GitHub Actions → Reports → Bug reports
```

## Why two different apps?
SauceDemo has a UI but no public API. DummyJSON has an API but no UI. Each is the best stable public target for its layer, and both are documented as such. Their data is not shared, so the UI suite and the API suite are independent.

## Test coverage
| Area | Web (Playwright) | API (REST Assured) |
|------|------------------|--------------------|
| Login: valid, invalid, locked, empty fields | yes | yes (+ JSON schema, token) |
| Registration | n/a (not in app) | `POST /users/add` |
| Browse / sort / name filter / details | yes | list, search, by ID, pagination, list-vs-detail consistency |
| Cart add / remove / empty | yes | add, update, delete, user carts |
| Quantity update | skipped (no such UI) | yes |
| Checkout, totals, field validation | yes | n/a |
| Logout / unauthorized access | yes | no token, bad token |
| Slow response / server 500 / failed images / bad input | `page.route()` mocking, injection-style strings | malformed JSON, bad limit, unknown endpoint |
| Boundary values | long strings | quantity 1 / 4 / 99, huge skip |
| Known defects | `test.fail()` tests | `@Tag("known-bug")` tests |

Honest limits: SauceDemo has no search box (a name filter is tested instead), no registration, no quantity field. Skipped tests (`test.fixme`) are listed on purpose as known coverage gaps.

## Verified results (my local run, 06-Oct-2026, Windows, Chromium)
- **Web:** 41 tests: 39 passed, 0 failed, 2 skipped (4 of the passes are expected-failure bug tests: BUG-001 to BUG-004). Screenshot: `docs/screenshots/playwright-report.png` (earlier run, 38 passed).
- **API:** 36 passed, 0 failed (`mvn test`).
- **API known-bug run** (`-DexcludedGroups=none`): 5 expected failures, each a real defect. Screenshot: `docs/screenshots/surefire-report-with-known-bugs.png`.
- **GitHub Actions:** workflow written but **not yet run** by me. Push the repo and check the Actions tab.

## Bugs found
See [`bug-reports/README.md`](bug-reports/README.md). Summary:
- UI: BUG-001 (same image for all products, `problem_user`), BUG-002 (Last Name field), BUG-003 (blank page on server 500), BUG-004 (checkout allowed with empty cart).
- API: negative quantity accepted (201, total -224.95), zero / non-numeric quantity accepted, invalid token returns 500 instead of 401, unknown product ID accepted.

BUG-001 to BUG-004 are covered by `test.fail()` tests (they pass while the bug exists and flag you when it is fixed). API bugs are `known-bug` tests, excluded from the default run so CI stays green.

## Folder structure
```
ecommerce-automation/
├── web-automation/   tests/ pages/ fixtures/ utils/ test-data/ playwright.config.ts package.json
├── api-automation/   src/test/java/{tests,config,models,utils}  src/test/resources/schemas  pom.xml
├── bug-reports/      BUG-*.md + evidence/
├── reports/          generated web reports
├── docs/             LEARNING-GUIDE.md, INTERVIEW-GUIDE.md, screenshots/
├── .github/workflows/automation.yml
└── README.md
```

## Setup
Requirements: Node.js 20+, Java 17+ (21 recommended), Maven 3.9+.
```bash
cd web-automation
npm install
npx playwright install chromium
```

## Run web tests
```bash
cd web-automation
npx playwright test --project=chromium     # full run
npm run test:smoke                          # @smoke tests (desktop + mobile)
npx playwright test login.spec.ts --headed  # watch one file
npm run report                              # open HTML report
```

## Run API tests
```bash
cd api-automation
mvn test                                # normal run
mvn test -DexcludedGroups=none          # also run known-bug tests (they FAIL on purpose)
mvn test -DmaxResponseMs=10000          # looser response-time limit for slow networks
mvn surefire-report:report-only         # HTML report: target/site/surefire-report.html
```

## Reports
- Web: `reports/web/html/index.html` plus `junit.xml`; screenshots, video and trace kept for failures.
- API: `api-automation/target/surefire-reports/` and `target/site/surefire-report.html`.
- Both show total, passed, failed, skipped, duration and failure details.

## CI/CD (`.github/workflows/automation.yml`)
On every push / pull request: checkout → install → run Playwright → run REST Assured → publish pass/fail summary → upload reports as artifacts. Two parallel jobs (web, API). The job fails if a normal test fails.

## Test design notes
- **Page Object Model** and **fixtures** keep tests short and locators in one place.
- **Test data** lives in JSON, not in test code.
- Response-time limit is configurable (`Config.java`, default 8000 ms) because public APIs vary with network speed.
- Known bugs are encoded as tests of the *correct* behaviour so they stay visible.

## Future improvements
Allure reporting, accessibility checks (`@axe-core/playwright`), visual regression, UI tests that create data through the API, a self-hosted store for empty-state mocking, Docker.
