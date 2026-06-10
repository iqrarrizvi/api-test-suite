# api-test-suite

![CI](https://github.com/iqrarrizvi/api-test-suite/actions/workflows/playwright.yml/badge.svg)

Playwright API test suite targeting the public [Reqres](https://reqres.in) REST API. Covers CRUD operations, authentication flows, schema validation, and error handling — no browser required.

---

## What It Tests

| File | Tag | Coverage |
|---|---|---|
| `users.spec.js` | `@smoke` + `@regression` | List/paginate users, get single user, 404 handling, create, PUT, PATCH, DELETE |
| `auth.spec.js` | `@smoke` + `@regression` | Login (valid/invalid/missing fields), register (valid/missing password) |

**12 tests across 2 files.**

---

## Project Structure

```
├── tests/
│   ├── users.spec.js       # CRUD tests for /api/users
│   └── auth.spec.js        # Login and register tests
├── utils/
│   └── apiClient.js        # ApiClient wrapper + assertSchema helper
├── fixtures/
│   └── testData.js         # Shared test credentials and payloads
├── playwright.config.js    # Playwright config (API project, no browser)
└── .github/workflows/      # GitHub Actions CI
```

---

## Quick Start

```bash
git clone https://github.com/iqrarrizvi/api-test-suite.git
cd api-test-suite
npm install

# Run all tests
npm test

# Smoke tests only
npm run smoke

# Full regression
npm run regression
```

No `.env` file required — defaults to `https://reqres.in`.

---

## Key Patterns

**`ApiClient`** wraps Playwright's `request` context to keep test code clean:
```js
const client = new ApiClient(request);
const res = await client.post('/api/login', { email, password });
expect(res.status()).toBe(200);
```

**`assertSchema`** validates response shape without a third-party library:
```js
assertSchema(body.data, { id: 'number', email: 'string', first_name: 'string' });
```

---

## CI/CD

GitHub Actions runs all 12 tests on every push — no browser install needed, so the job completes in under a minute. Badge above reflects the latest run.

---

## Tech Stack

- **Playwright** — API testing via built-in `request` fixture
- **Node.js** — test runner
- **GitHub Actions** — CI/CD
