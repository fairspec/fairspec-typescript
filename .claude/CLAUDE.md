# Claude

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- Prioritize using LSP capabilities if possible
- Run `pnpm run lint` to lint the code using Biome
- Run `pnpm run format` to auto-fix formatting issues with Biome
- Run `pnpm run type` to check TypeScript types
- Run `pnpm -F <name> run type` to check types for a specific package
- Run `pnpm run test` to run the full test suite including linting, type checking, and tests
- Run `pnpm run spec` to run only the Vitest tests
- Run `pnpm exec vitest run -t "test name"` or `pnpm exec vitest run path/to/test.ts` to run a single test
- Use 2-space indentation, UTF-8 encoding, and LF line endings
- Use strict TypeScript with null checks but don't add explicit return types to functions
- Use PascalCase for classes and interfaces, and camelCase for methods and variables
- Place high-level public items first in a file and low-level private items last
- Use ES modules with full import paths including the ".ts(x)" file extension
- Place unit tests in `<module>.spec.ts` files and don't add useless comments like "Arrange", "Act", "Assert"
- Add Typedoc comments only for public APIs and don't add them for files or use @params directives
- Don't write `//` comments in the code
- When resolving a TODO, follow its instructions literally
- Run type checking as part of your tasks
- Run specs as part of your tasks
- Don't run linting as part of your tasks
- Never use TypeScript `any`, type casting `as`, or `!` without permission
