---
title: "Common Database Design Mistakes to Avoid"
date: 2025-04-09
description: "Learn about critical database design antipatterns and best practices to ensure data integrity and maintainability in your projects."
categories: [Database, SQL]
tags: [Database Design, SQL, Best Practices, Data Integrity]
meta:
  - name: "keywords"
    content: "Database design, SQL antipatterns, data integrity, foreign keys, primary keys, database normalization"
  - name: "author"
    content: "Mohamed Thabet"
---

# Common Database Design Mistakes to Avoid

When designing databases, certain practices can lead to long-term maintenance issues, performance problems, and data integrity concerns. This guide outlines some of the most common database design mistakes and provides better alternatives to implement in your projects.

## 1. Using Business Fields as Primary Keys

Using business fields (such as tax IDs or social security numbers) as primary keys might seem logical but can harm data integrity and maintainability.

### Example: SSN as a Primary Key

```sql
CREATE TABLE Employee (
    ssn CHAR(11) PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(50),
    department VARCHAR(50)
);
```

**Issues:**
- **Changeability:** SSNs can change (e.g., due to identity theft), causing complicated cascading updates.
- **External Dependency:** Format or policy changes are beyond your control.
- **Security:** Using sensitive data as a key raises privacy risks.

### Recommended Approach: Surrogate Keys

Introduce a system-generated surrogate key to avoid these issues.

```sql
CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    ssn CHAR(11) UNIQUE,
    name VARCHAR(100),
    position VARCHAR(50),
    department VARCHAR(50)
);
```

**Benefits:**
- **Stability:** Internal keys remain constant.
- **Control:** Key generation is managed exclusively by your system.
- **Security:** Reduces exposure of sensitive data.
- **Flexibility:** Adapts easily to evolving business needs.

## 2. Storing Redundant Data

### Example

Storing both a person's **birthdate** and **age** in the same database record:

```sql
-- Bad practice
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    birth_date DATE,
    age INT  -- ❌ Redundant and error-prone
);
```

### Why This Is a Problem

- **Data Inconsistency**: Age becomes incorrect over time unless constantly updated.
- **Unnecessary Load**: Storing redundant fields increases storage and maintenance overhead.
- **Violation of Database Normalization**: Storing calculated values breaks the principle of keeping atomic and minimal data.

> **Rule:** Never store calculated values in the database!

### Recommended Solution

Only store the **birthdate**, and calculate the **age** dynamically when needed—either via:

```sql 
SELECT name, 
       birth_date,
       TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age 
FROM users;
```

or in Application Code (e.g., PHP, Python, etc.):

```php
$age = date('Y') - date('Y', strtotime($birth_date));
```

## 3. Avoiding Spaces and Quotes in Table Names

Using spaces or quotes in table names can lead to messy queries and errors. Below are examples comparing problematic and recommended naming conventions.

### Problematic Example: Table Name with Spaces
Using quotes or spaces forces you to remember to always wrap the table name in quotes:

```sql
CREATE TABLE "Customer Order" (
    id INT PRIMARY KEY,
    order_date DATE
);

-- Query that requires quotes
SELECT * FROM "Customer Order" WHERE order_date = '2025-04-09';
```

Missing or misplacing the quotes may cause syntax errors and make the query harder to read and maintain.

### Recommended Naming Conventions

#### Single Word
Use a single concatenated word to avoid spaces and quotes:
```sql
CREATE TABLE customerorder (
    id INT PRIMARY KEY,
    order_date DATE
);

-- Clean query without quotes
SELECT * FROM customerorder WHERE order_date = '2025-04-09';
```

#### Camel Case
Use CamelCase to improve readability while avoiding spaces:
```sql
CREATE TABLE CustomerOrder (
    id INT PRIMARY KEY,
    order_date DATE
);

-- Query remains simple and clean
SELECT * FROM CustomerOrder WHERE order_date = '2025-04-09';
```

#### Underscore Separation (snake_case)
Separate words with underscores for clarity:
```sql
CREATE TABLE customer_order (
    id INT PRIMARY KEY,
    order_date DATE
);

-- Clear query without extra punctuation
SELECT * FROM customer_order WHERE order_date = '2025-04-09';
```

> **Best Practice:** Using snake_case (underscores between words) is generally considered the most readable and compatible approach across different database systems.

## 4. Poor Referential Integrity

Without appropriate constraints such as primary keys, foreign keys, unique, not-null, and check constraints, your database can suffer from several issues:

- **Duplicate Values:** Fields intended to be unique might store duplicate values.
- **Orphaned References:** Foreign key columns may reference non-existent records.
- **Incomplete Data:** Missing not-null checks allow incomplete records to be inserted.
- **Data Inconsistencies:** Lack of check constraints can lead to invalid data values.

### Improved Example with Constraints

Below is an enhanced design that ensures referential integrity using surrogate keys and proper constraints. This example includes a new `Department` table and modifies the `Employee` table to use a foreign key:

```sql
-- Create Department table with primary key and unique department names
CREATE TABLE Department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Employee table with surrogate primary key and various constraints
CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    ssn CHAR(11) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id)
        REFERENCES Department(department_id)
        ON DELETE SET NULL,
    CONSTRAINT chk_ssn CHECK (LENGTH(ssn) = 11)
);
```

**Key Improvements:**

- **Primary Key Constraints:** Both tables have a surrogate key ensuring unique record identification.
- **Unique Constraints:** The `ssn` in `Employee` and `name` in `Department` are uniquely enforced.
- **Not Null Constraints:** Critical fields such as `ssn`, `name`, and `position` must have valid values.
- **Foreign Key Constraints:** The `department_id` in `Employee` must reference an existing department.
- **Check Constraints:** Enforces that the `ssn` has a valid length.

This approach minimizes data anomalies and improves overall database integrity.

## Conclusion

By avoiding these common database design mistakes, you can create more maintainable, secure, and efficient database systems. Remember that a solid database foundation is critical for the long-term health of your applications.

What database design challenges have you encountered in your projects? Share your experiences in the comments!