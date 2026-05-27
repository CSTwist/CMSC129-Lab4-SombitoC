# CMSC 129 Laboratory Assignment 4: Contacts Manager

**Author:** Chak (Sombito, C.)  
**Live URL:** *(Pending Deployment)*  

---

## 📱 App Description
**Contacts Manager** is a single-resource web application built to serve as a fast, clean, and highly secure digital address book. The app allows users to manage their contacts list with full CRUD (Create, Read, Update, Delete) capability. Featuring a simple, clean, and responsive design, the application runs entirely in memory without complex database setups. This guarantees high-speed responses and a clean execution focus tailored for Test-Driven Development (TDD).

---

## 👤 User Stories

1. **User Story 1: Add a Contact**
   > *As a user, I want to add a contact by entering their name, email, and phone number, so that I can save their details for future reference.*
2. **User Story 2: View and Search Contacts**
   > *As a user, I want to view a list of all my contacts and search them by name or email, so that I can quickly find the person I am looking for.*
3. **User Story 3: Delete a Contact**
   > *As a user, I want to delete a contact from my list, so that I can keep my address book up-to-date and clean.*

---

## 🛠️ Tech Stack

- **Core Structure & UI:** Vanilla HTML5 (semantic layout), Vanilla CSS3 (Simple, clean, card-based layout), and Modern ES6 JavaScript.
- **Backend Server:** Node.js with Express.js (serving static files and REST API endpoints).
- **Data Storage:** In-memory collection managed via a JavaScript `ContactStore` model.
- **Unit Testing:** Jest (isolated assertion framework).
- **Integration Testing:** Jest + Supertest (verifying REST route handlers and HTTP request-response flow).
- **System Testing:** Playwright (orchestrating browser tests against live-running local environments).
- **CI/CD Pipeline:** GitHub Actions (automatically running the full test suite on push/pull requests).

---

## 🔬 Testing Strategy

Our testing strategy follows the rigorous **Red-Green-Refactor** process at three distinct isolation boundaries:

### 1. Unit Testing
- **Scope:** Pure functions and isolated business logic.
- **Target:** `src/utils/validator.js`
- **What is tested & why:** We verify that contact names, emails, and phone numbers are correctly validated before any processing. We ensure names are non-empty and fit standard lengths, emails are in valid formats, and phone numbers conform to general mobile requirements. By isolating validation, we guarantee that data entry integrity is strictly preserved without relying on servers or routers.

### 2. Integration Testing
- **Scope:** HTTP Request-Response lifecycle including routers, controllers, middleware, and models.
- **Target:** `src/routes/contacts.js` and `src/models/contactsStore.js`
- **What is tested & why:** We verify the REST API endpoints using `Supertest`. We ensure that a `POST` request with valid details returns a `201 Created` status with the new contact's payload, while invalid parameters correctly yield a `400 Bad Request` containing validation errors. We also check that `GET` successfully fetches all records and `DELETE` handles removal. This guarantees that our HTTP routing and data storage layer work seamlessly together.

### 3. System Testing (E2E)
- **Scope:** End-to-end user journeys simulated in a real headless browser.
- **Target:** `tests/system/contacts.spec.js` mapping to the 3 User Stories.
- **What is tested & why:** We simulate actions of a real user using `Playwright`:
  - Fills the contact form and clicks "Save Contact", then asserts the contact is rendered in the UI list.
  - Types search queries in the search box and checks if the contact list is dynamically filtered.
  - Clicks the "Delete" button and confirms the deletion, verifying the contact is completely removed from the screen.
  This validates the entire integrated stack (UI, client-side scripts, API endpoints, and in-memory store) under realistic conditions.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v22.x or later)
- npm (v10.x or later)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/CSTwist/CMSC129-Lab4-SombitoC.git
   cd CMSC129-Lab4-SombitoC
   ```
2. Install the application dependencies:
   ```bash
   npm install
   ```
3. Install Playwright testing browsers:
   ```bash
   npx playwright install chromium --with-deps
   ```

### Running the Application
To run the local server for development:
```bash
npm start
```
The server will start running at [http://localhost:3000](http://localhost:3000).

### Running Tests
- **Run all Jest tests (Unit + Integration):**
  ```bash
  npm test
  ```
- **Run all E2E system tests (Playwright):**
  ```bash
  npm run test:system
  ```

---

## 📊 Test Results

### 1. Unit Tests (Part 1)
All 4 unit tests are passing successfully:

```bash
> jest

PASS tests/unit/validator.test.js
  validateContact Unit Tests
    ✓ should validate a correct contact successfully (3 ms)
    ✓ should fail when name is empty, too short, too long, or has special characters (1 ms)
    ✓ should fail when email format is invalid (1 ms)
    ✓ should fail when phone format is invalid (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.267 s, estimated 1 s
Ran all test suites.
```

### 2. Integration Tests (Part 2)
All 3 API integration tests are passing successfully, validating our REST route endpoints and controllers:

```bash
PASS tests/integration/contacts.test.js
  Contacts API Integration Tests
    ✓ GET /api/contacts should return all contacts list (34 ms)
    ✓ POST /api/contacts should create a new contact and return 201 (15 ms)
    ✓ POST /api/contacts should return 400 Bad Request when validation fails (5 ms)

PASS tests/unit/validator.test.js
  validateContact Unit Tests
    ✓ should validate a correct contact successfully (2 ms)
    ✓ should fail when name is empty, too short, too long, or has special characters
    ✓ should fail when email format is invalid
    ✓ should fail when phone format is invalid

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        0.65 s, estimated 1 s
Ran all test suites.
```

### 3. System Tests (Part 3)
All 3 Playwright end-to-end browser system tests are passing successfully, mapping directly to our User Stories:

```bash
> playwright test

Running 3 tests using 1 worker

  ok 1 [chromium] › tests\system\contacts.spec.js:11:3 › Contacts Manager System Tests (E2E) › User Story 1: Should be able to add a new contact and view it in the list (2.0s)
  ok 2 [chromium] › tests\system\contacts.spec.js:30:3 › Contacts Manager System Tests (E2E) › User Story 2: Should be able to search and filter contacts dynamically (2.3s)
  ok 3 [chromium] › tests\system\contacts.spec.js:60:3 › Contacts Manager System Tests (E2E) › User Story 3: Should be able to delete a contact after confirming the action (2.7s)

  3 passed (9.2s)
```


---

## 🔁 CI/CD Setup

We utilize **GitHub Actions** as our automated test runner and verification witness. 

- **Trigger:** Every push or pull request to the `main` branch.
- **Workflow:**
  1. Checks out the repository code.
  2. Sets up Node.js environment.
  3. Restores cache and installs dependencies via `npm ci`.
  4. Downloads and configures local Playwright browser stubs.
  5. Executes Jest unit and integration tests (`npm test`).
  6. Launches Playwright system tests conditionally if test files are present.

*(Failing/Passing Pipeline Screenshots will be added as we progress)*

---

## 🧠 Reflection

Reimplementing this Contacts List application using a strict Test-Driven Development (TDD) approach was a highly educational and eye-opening experience. Writing test cases before writing any implementation code (following the **Red-Green-Refactor** pattern) completely flipped the traditional development model on its head. 

### Key Lessons from the TDD Workflow:
1. **Design and Scope Clarity:** Writing unit and integration tests first forced me to treat our API and utility functions as black boxes. I had to establish exactly what shape the incoming request and outgoing response payloads must take. This eliminated design ambiguity early on, leading to highly modular utilities (e.g., `validator.js` and `contactsController.js`) with single, clear responsibilities.
2. **Confidence in Refactoring:** The Refactor cycles in both the REST API phase and the UI phase were incredibly empowering. Because we had robust Jest and Playwright test suites watching our backs, I could confidently reorganize route handling into a clean MVC structure (`contactsController.js`) and extract DOM card rendering helpers (`createContactCardDOM`) without any fear of breaking existing functionality. The immediate test feedback loops acted as safety nets.
3. **Multi-Scope Testing Strategy:** Dividing the verification process into three isolation boundaries—Unit (isolated helper logic), Integration (REST endpoint routing and store integration), and System (full E2E user journeys)—proved indispensable. Unit tests catch granular formatting edge cases, integration tests secure critical HTTP status flows, and system tests guarantee the client-server interactions actually succeed under realistic browser conditions.
4. **Engineering for Robustness:** Incorporating direct API resets via the Playwright `request` fixture in `beforeEach` solved state contamination issues, while frontend element-disabling on submission eliminated race conditions. This lab proved that testing is not a chore to do *after* coding, but a fundamental driving methodology that results in bulletproof, self-documenting codebases.

