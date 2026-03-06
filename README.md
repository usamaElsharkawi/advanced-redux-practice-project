# Advanced Redux & Product Engineering Concepts

This repository serves as a practice project and a personal knowledge base for learning **Advanced Redux** and modern **Senior Product Engineering** principles.

## 🧠 Core Engineering Mental Models

### 1. Domain-Driven Design (Folder Structure)

Instead of a single "God File" for our Redux store, we split the state into **Slices** (e.g., `cart-slice.js`, `ui-slice.js`).

- **Why?** Separation of Concerns. The UI domain (handling notifications and drawer toggles) should not be mixed with the Business domain (handling cart totals and item quantities).
- **The `index.js` Assember:** The main store file acts as the "CEO", delegating the work to the individual slice "Managers" and combining them into one root store.

### 2. The Logic Triangle

A Senior Engineer strictly separates code into three distinct buckets:

1. **Business Logic (The Rules):** The core mathematical and operational rules of the app (e.g., "A cart cannot have duplicate item rows, it must increase the quantity instead"). This lives in Redux Reducers or the Backend.
2. **UI Logic (The Presentation):** How things look and feel (e.g., "Open the cart drawer when this button is clicked"). This lives in React Components.
3. **Data Transformation Logic:** The code that takes raw input data and reshapes/calculates it into useful output data before the UI renders it. (e.g., taking an incoming product payload and calculating `totalPrice = price * quantity`).

---

## 🏗️ Advanced Redux Concepts

### 1. The Payload Contract

Reducers and dispatches must agree on the format of the data being passed.

- **The Bug:** Dispatching `removeItem("p1")` when the reducer expects `action.payload.id`.
- **The Fix:** Dispatching an object `{ id: "p1" }` to fulfill the contract.

### 2. The Redux Golden Rule

**Reducers must be pure, side-effect-free, synchronous functions.**

- **Synchronous:** No `async/await` or timers. They must execute instantly.
- **Side-Effect Free:** No talking to the outside world (no HTTP requests, no LocalStorage).
- **Pure:** Given the exact same input, they must always return the exact same output.

### 3. Asynchrony and The "Thunk"

Because Reducers must be pure, we cannot put API calls (like sending the cart to a database) inside them.

- **What is a Thunk?** A Thunk is a function that returns _another_ function to delay execution. It's like a "gift card." Instead of Redux immediately updating state, we give it a Thunk. The Thunk handles the asynchronous network request (talking to Firebase), and _only when it finishes_ does it dispatch the final synchronous action to the pure reducer.

---

## 🌐 The Backend Relationship

### Smart Backend vs. "Dumb" Backend

The amount of Business & Data Transformation logic you write on the Frontend (in Redux) depends entirely on your Backend.

- **Scenario A: "Smart Backend" (REST API/Node.js)**
  - The Backend knows how to calculate prices and totals.
  - **Frontend Job:** Send a tiny "Command" or "Payload" (e.g., _"+1 Burger"_). Wait for the Backend to do the math and return the new cart.
  - **Result:** Very little math/logic written in Redux.

- **Scenario B: "Dumb Backend" (Firebase)**
  - The Backend is just an empty storage container. It does no math.
  - **Frontend Job:** Redux must contain all the complex logic to check arrays, update quantities, and calculate grand totals locally. Then, you send a full "Snapshot" of the finished Redux state to Firebase to simply be saved.
  - **Result:** Heavy lifting and data transformation happen purely on the Frontend inside the Redux Reducers.
