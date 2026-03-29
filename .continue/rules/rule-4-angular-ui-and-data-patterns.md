You must follow the project's UI and data handling patterns.

## UI

- Use PO UI components whenever possible
- Prefer PO UI equivalents over plain HTML when appropriate
- Use PO Page components when applicable
- Prefer PO Table for list screens
- Keep labels in Portuguese
- Maintain visual consistency with existing components

## Data fetching

- API calls must be done only in services
- Components must call services, never APIs directly

## RxJS

- Use RxJS in the same style as existing services
- Do NOT introduce unnecessary operators or new patterns

## Signals

- Use signals for component state when appropriate
- Follow the same pattern used in existing components

## Simplicity

- Prefer simple flows over overengineered solutions
- Do NOT introduce store, facade or global state unless already used in the project
