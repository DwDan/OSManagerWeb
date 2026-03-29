---
name: service-angular
description: Generate an Angular service and service spec following project standards
invokable: true
---

Use the open files strictly as reference. Do not modify any existing file.

Create the service layer for an entity.

## Input

The user will provide:

- entity name
- fields
- related DTO files if needed

## Required files

Generate exactly these files:

- src/app/services/{{entity}}/{{entity}}.service.ts
- src/app/services/{{entity}}/{{entity}}.service.spec.ts

## Rules

- Follow exactly the same pattern as the open users service files
- Do not create files outside the paths above
- Do not omit the spec file
- Do not modify existing files
- Keep code identifiers in English
- Use the existing HttpClient / RxJS pattern from the project
- Reuse existing request/response DTOs from src/app/models/{{entity}} when appropriate

## Output format

Return the result separated by file path:

[FILE] path/to/file
...code...

Do not explain anything.
