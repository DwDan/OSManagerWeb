You must follow the component structure pattern of this Angular project.

## Components

- Components must be created under `src/app/components/[entity]/...`
- If a feature contains multiple components such as list and form, keep them in separate folders when requested

## Mandatory component file set

When requested, do not omit related component files:

- `.ts`
- `.html`
- `.scss`

## Rules

- Never create only the `.ts` file if `.html` and `.scss` were requested
- Keep component TypeScript, HTML and SCSS files together in the same component folder
- Preserve the exact folder structure requested by the user
