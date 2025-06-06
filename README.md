# Playwright Automated Tests

This project contains automated tests for the LMS Login Module using [Playwright](https://playwright.dev/).

## 📁 Project Structure

- `tests/Login_Module.spec.ts` — Main test file for login scenarios (positive and negative).
- `tests/modules.js` — Contains arrays for modules, submodules, and other test data.
- `tests/credentials.json` — Stores test credentials and URLs.
- `.github/workflows/playwright.yml` — GitHub Actions workflow for CI test runs.
- `screenshots/` — Folder where screenshots from test runs are saved.

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run tests locally

```bash
npx playwright test
```

To run a specific test file:

```bash
npx playwright test tests/Login_Module.spec.ts
```

To see the browser UI during tests:

```bash
npx playwright test --headed
```

### 3. View HTML test report

After running tests:

```bash
npx playwright show-report
```

## 🧪 Test Scenarios

- **PT: Valid Login** — Tests successful login with valid credentials.
- **NT: Empty Login** — Tests login with empty fields.
- **NT: Empty Password** — Tests login with empty password.
- **NT: Empty Email** — Tests login with empty email.
- **NT: Invalid Credential** — Tests login with invalid email and password.
- **NT: Invalid Email** — Tests login with invalid email.
- **NT: Invalid Password** — Tests login with invalid password.
- **PT: Remember Me** — Tests the "Remember Me" functionality.

Each test takes screenshots for reporting and debugging.

## 🤖 Continuous Integration

This project uses GitHub Actions to run tests automatically on every push or pull request to `main` or `master`.  
Test results and HTML reports are uploaded as workflow artifacts.

## 📝 Customization

- Update `tests/credentials.json` with your own test accounts and URLs.
- Add or modify test data in `tests/modules.js` as needed.

## 📷 Screenshots

Screenshots are saved in the `screenshots/` directory for failed and important steps.

---
