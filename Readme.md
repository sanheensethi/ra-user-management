Example usage of pgrest:

// 1. SELECT all users where role = "admin"
const admins = await pgSelect("users", { role: "eq.admin" });

// 2. INSERT a new user
const newUser = await pgInsert("users", {
  name: "Sanheen",
  email: "sanheen@example.com",
  role: "user"
});

// 3. UPDATE user where id = 1
const updatedUser = await pgUpdate("users", { id: "eq.1" }, { role: "admin" });

// 4. DELETE user where id = 2
await pgDelete("users", { id: "eq.2" });

--------------------------------------------------------

Repository / Data Access Layer

Responsible for raw DB access.

Example: UserRepository → wraps pgSelect, pgInsert specifically for users.

No request/response objects, just returns raw DB rows.

Service Layer (Business Logic)

Calls repositories.

Applies rules (e.g. default role, check duplicates, password encryption).

Handles errors + logs.

Returns clean objects (or passes through to factories).


Controller Layer (API I/O)

Handles Express request/response.

Input validation.

Calls service.

Applies API factories to format outgoing response.