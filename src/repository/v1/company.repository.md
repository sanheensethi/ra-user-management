const repo = new CompanyRepository();

// 1. Fetch with filters + selected columns
await repo.findAll(0, 10, { status: "eq.active" }, ["id", "name", "email"]);

// 2. Fetch by ID but only some columns
await repo.findById("123", ["id", "name"]);

// 3. Insert new company
await repo.create({ name: "Acme Inc", status: "active" });

// 4. Update
await repo.update("123", { status: "inactive" });

// 5. Delete
await repo.delete("123");
