You must follow the project's data handling and state management patterns.

## Data Fetching

- API calls must be done only in services
- Components must call services, never APIs directly

## RxJS

- Use RxJS in the same way as existing services
- Do NOT introduce new patterns or operators unless necessary
- Keep usage simple and readable

## Signals

- Use signals for component state when appropriate
- Follow the same pattern used in existing components

## State Responsibility

- Component is responsible for:
  - UI state
  - loading flags
  - interaction with services

- Service is responsible for:
  - API communication
  - returning observables

## Simplicity

- Prefer simple flows over complex reactive chains
- Do NOT introduce store, facade or global state unless already used

## Consistency

- Match the style of open files
- Do not mix multiple patterns
