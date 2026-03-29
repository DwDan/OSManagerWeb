When generating code, you must follow a strict output contract.

## Output format

- Return the result separated by file path
- Each file must be clearly identified before its code

## Mandatory behavior

- Never omit requested files
- Never create extra files outside the requested paths
- Never merge multiple requested files into one
- Never edit open reference files unless the user explicitly asked for modifications
- Use open files only as reference when the user says they are references

## If exact file paths are provided

- Treat them as mandatory
- Do not improvise alternative locations
- Do not skip files such as `.html`, `.scss` or `.spec.ts` when requested
