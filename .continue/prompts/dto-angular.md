---
name: dto-angular
description: Generate all CRUD DTOs for an entity following project standards
invokable: true
---

Use the open files strictly as reference. Do not modify any existing file.

Create all CRUD DTO files for an entity.

## Input

The user will provide:

- entity name
- fields

## Required structure

You MUST generate exactly these files:

- src/app/models/{{entity}}/requests/create-{{entity}}.request.ts
- src/app/models/{{entity}}/requests/update-{{entity}}.request.ts
- src/app/models/{{entity}}/requests/delete-{{entity}}.request.ts
- src/app/models/{{entity}}/requests/get-{{entity}}-by-id.request.ts
- src/app/models/{{entity}}/requests/list-{{entity}}.request.ts
- src/app/models/{{entity}}/responses/{{entity}}.response.ts
- src/app/models/{{entity}}/responses/list-{{entity}}.response.ts

## Rules

- DO NOT create files outside these paths
- DO NOT omit any file
- DO NOT merge files
- DO NOT modify existing files
- Follow EXACTLY the same structure, naming and typing as the open users DTO files
- If users DTOs use pagination, filters or wrappers, replicate the same pattern
- If users DTOs use specific interfaces, base types or generics, reuse the same approach

## Naming

- Code identifiers must be in English
- File names must follow kebab-case
- Types and interfaces must follow PascalCase

## Output format

Return the result separated by file path:

[FILE] path/to/file
...code...

Do not explain anything.
