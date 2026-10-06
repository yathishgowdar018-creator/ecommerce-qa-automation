# Interview Guide

**1. What is Playwright?** A browser automation and testing tool by Microsoft. It drives Chromium, Firefox and WebKit, auto-waits for elements, and has built-in assertions, network mocking, screenshots, video and traces.

**2. Why TypeScript?** It adds types to JavaScript, so mistakes (wrong property, wrong argument) are caught while writing code, and editors give autocomplete. Playwright is written in TypeScript and supports it natively.

**3. What is Page Object Model?** A design pattern where each page has a class holding its locators and actions. Tests call `loginPage.login(...)` instead of repeating selectors, so when the UI changes you fix one place.

**4. What is REST Assured?** A Java library for testing REST APIs with readable `given / when / then` syntax: send a request, then assert status, headers, JSON body and response time.

**5. Why REST Assured instead of testing everything in the browser?** API tests are faster, more stable, and test business rules directly, including inputs the UI would never allow (quantity -5). They also find backend bugs the UI hides.

**6. UI vs API testing?** UI tests check what a user sees and does (slow, more fragile, wide coverage). API tests check the server's requests and responses (fast, precise, no browser).

**7. Positive testing?** Valid input, expected success. Example: login with correct credentials.

**8. Negative testing?** Invalid input or conditions, expecting a correct rejection. Example: login with a wrong password, quantity -5.

**9. Regression testing?** Re-running existing tests after a change to confirm nothing that worked has broken.

**10. Smoke testing?** A small, fast set of the most critical checks (login, add to cart, checkout) to confirm the build is basically working. Mine are tagged `@smoke`.

**11. HTTP status code?** A 3-digit result of a request: 2xx success (200, 201), 4xx client error (400, 401, 404), 5xx server error (500). Example found in this project: an invalid token returned 500 where 401 is correct.

**12. Response-time validation?** Asserting the API answers within a limit (`.time(lessThan(...))`). I made the limit configurable because it failed once at 3970 ms on a slow network, which shows thresholds depend on the environment.

**13. CI/CD?** Continuous Integration runs build and tests automatically on each change; Continuous Delivery/Deployment automates releasing. Here it means tests run on every push.

**14. How does GitHub Actions run the tests?** A workflow YAML in `.github/workflows` triggers on push. It starts a fresh Ubuntu machine, checks out the code, installs Node/Java, runs Playwright and Maven, then uploads reports as artifacts.

**15. How did you find and report bugs?** I wrote tests for the correct behaviour, ran them, and investigated failures. Real examples: the API returned 201 for quantity -5 with a negative total; checkout opened with an empty cart. I wrote each bug with ID, severity, steps, expected, actual and evidence, and kept an automated test for it.

**16. Why didn't you build the frontend/backend?** "This is a test automation project, not an application development project. The e-commerce application is the System Under Test, and I developed automation frameworks using Playwright with TypeScript for UI testing and REST Assured with Java for API testing."
