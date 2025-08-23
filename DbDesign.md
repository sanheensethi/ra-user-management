Ab hume har company (chahe top-level ho ya sub-company) ke andar **Admin/Manager type roles** bhi support karne honge.  
Matlab har `company` ke paas **multiple users** ho sakte hain aur unke **roles in that company** alag ho sakte hain.  

---

## 🔹 Updated Database Design

### 1. `users` (same as before)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    base_role VARCHAR(20) CHECK (base_role IN ('SUPER_ADMIN', 'COMPANY', 'WORKER', 'CONTRACTOR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
⚡ `base_role` = wo role jo system level pe hai (like company account, worker account, contractor account).

---

### 2. `companies` (same as before)
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    owner_id INT REFERENCES users(id),         -- owner (worker/contractor/company user)
    parent_company_id INT REFERENCES companies(id), -- hierarchy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. `company_members` (extended)
Ab yahan har member ke liye **company-specific role** add karenge.  

```sql
CREATE TABLE company_members (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    user_id INT REFERENCES users(id),
    role_in_company VARCHAR(20) CHECK (role_in_company IN ('ADMIN', 'MANAGER', 'WORKER', 'CONTRACTOR')),
    hired_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);
```

---

## 🔹 How It Works

1. **Super Admin** → create top-level company → assign **Admin**  
   ```
   company_members(company_id=1, user_id=U1, role_in_company='ADMIN')
   ```
   
2. **Company Admin** → can add Manager / Worker / Contractor  
   ```
   company_members(company_id=1, user_id=U2, role_in_company='MANAGER')
   company_members(company_id=1, user_id=U3, role_in_company='WORKER')
   ```

3. **Worker hires Contractor** → system auto-creates sub-company for Worker →  
   - Worker = `OWNER` of sub-company  
   - Worker can also act as `ADMIN` of sub-company  
   - Contractor = added under sub-company with role `CONTRACTOR`

---

## 🔹 Example Hierarchy with Admin/Manager

```
Company A (id=1)
 ├── Admin: Alice (role_in_company=ADMIN)
 ├── Manager: Bob (role_in_company=MANAGER)
 ├── Worker W1 (role_in_company=WORKER)
 │     ↓ W1 becomes sub-company (id=2, owner=W1, role_in_company=ADMIN in his sub-company)
 │     └── Contractor C1 (role_in_company=CONTRACTOR in sub-company 2)
 └── Worker W2 (role_in_company=WORKER)
```

---

## 🔹 Query Examples

👉 **Get all users of a company with roles**
```sql
SELECT u.id, u.name, cm.role_in_company
FROM company_members cm
JOIN users u ON u.id = cm.user_id
WHERE cm.company_id = 1;
```

👉 **Get full hierarchy (all sub-companies under a company)**
```sql
WITH RECURSIVE sub_companies AS (
  SELECT id, name, parent_company_id
  FROM companies
  WHERE id = 1
  UNION ALL
  SELECT c.id, c.name, c.parent_company_id
  FROM companies c
  INNER JOIN sub_companies sc ON sc.id = c.parent_company_id
)
SELECT * FROM sub_companies;
```

---

✅ Ab system me:  
- Har company ke multiple users ho sakte hain  
- Roles company ke context me define honge (`ADMIN`, `MANAGER`, `WORKER`, `CONTRACTOR`)  
- Worker/Contractor jab hire karega → apna **sub-company banega**, aur wo us sub-company ka `ADMIN` ban jaayega by default.  

---

Bata, kya tu chahta hai main ab iska **TypeScript + Express backend ke liye endpoints design** kar du (Super Admin create company, Add admin/manager/worker/contractor, Hire flow, Hierarchy fetch)?