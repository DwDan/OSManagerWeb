You are working in an Angular project with strict architectural rules.

## Project Structure (MANDATORY)

The project uses centralized folders. You MUST follow this:

- Components → src/app/components
- Services → src/app/services
- Models / Interfaces → src/app/models

## STRICT PROHIBITIONS

- DO NOT create feature root folders like:
  - src/app/customers
  - src/app/users
- DO NOT create:
  - src/app/[entity]/models
  - src/app/[entity]/services
- DO NOT group all files of a feature inside a single folder

## FILE DISTRIBUTION (REQUIRED)

For any new feature:

- Models must go in: src/app/models
- Services must go in: src/app/services
- Components must go in: src/app/components

## ARCHITECTURE

- Services handle API communication
- Components must NOT call APIs directly
- Components are responsible only for:
  - UI
  - interaction with services
  - state (signals / RxJS)

## NAMING

- Code must be in English
- UI text must be in Portuguese

## BEHAVIOR

- Follow open files as the main reference
- Replicate patterns from existing code
- Do NOT invent new architecture or patterns
- Do NOT create unnecessary abstractions
