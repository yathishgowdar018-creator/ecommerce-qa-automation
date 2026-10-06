# Learning Guide (read in this order)

## Step 1: Why these demo apps?
| Layer | System under test | Why |
|-------|-------------------|-----|
| Web | https://www.saucedemo.com | Free, stable, built for practice. Has login, products, cart, checkout, logout and special users (locked_out_user, problem_user) with real bugs. Uses `data-test` attributes, so locators are reliable. |
| API | https://dummyjson.com | Free REST API with auth, products, carts, users. Needs no setup. Cart writes are simulated (not saved), so tests never break each other. |

Limits (be honest about them in interviews): SauceDemo has no registration, no search box and no quantity field. Registration is tested on the API (`/users/add`), search is a name filter, quantity update is on the API.

## Step 2: Structure
- `pages/` = Page Object Model: one class per page, holding locators and actions.
- `fixtures/` = Playwright fixtures: create page objects / log in for each test automatically.
- `test-data/` = JSON data so tests have no hard-coded values.
- `tests/` = only test logic and assertions.
- Java: `config/` settings and request specs, `models/` POJOs, `utils/` helpers, `tests/` test classes.

## Step 3: Install
1. Node.js 20+, Java 17+, Maven 3.9+, Git, VS Code (+ Playwright extension)
2. `cd web-automation && npm install && npx playwright install`
3. `cd api-automation && mvn -v` then `mvn test`

## Step 4: Read the first test
Open `web-automation/tests/login.spec.ts`:
1. `test.beforeEach` opens the login page (fixture `loginPage`).
2. `loginPage.login(...)` types and clicks (Page Object action).
3. `expect(...)` assertions retry automatically (Playwright auto-waiting).

## Step 5: Practice order
1. Run `npm run test:ui` and watch tests step by step.
2. Break a locator on purpose, read the failure and open the trace.
3. Write one new test per file yourself (e.g. sort A to Z).
4. In Java, run one class, then add a new `@Test` to `ProductApiTest`.
