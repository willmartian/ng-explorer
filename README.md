# ng-explorer

A CLI tool to efficiently search and explore Angular components, services, directives, and other constructs in Angular projects using Compodoc documentation.

## Features

- **Fuzzy Search**: Search for components, services, directives, pipes, modules, and classes by name
- **Type Filtering**: Filter results by construct type
- **API Inspection**: View detailed API information including inputs, outputs, methods, properties, and constructor dependencies
- **Fast Performance**: Uses cached documentation.json for instant lookups
- **Beautiful Output**: Colored tables and formatted text for easy reading

## Installation

From the repository root:

```bash
cd tools/ng-explorer
npm install
npm run build
npm link  # Makes ng-explorer globally available
```

## Prerequisites

You need to generate the Compodoc documentation first:

```bash
# From repository root
npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected
```

This creates a `documentation.json` file in the repository root.

## Usage

### Search for Components/Services

Search for Angular constructs by name, or omit the query to list all:

```bash
# Search for anything matching "foo"
ng-explorer search foo

# Search only components
ng-explorer search foo --type component

# List all components (no search query)
ng-explorer search --type component --limit 10

# Search only services (injectables)
ng-explorer search bar --type injectable

# List all services
ng-explorer search --type injectable

# Search directives
ng-explorer search tooltip --type directive

# Search with path filter (only in web app)
ng-explorer search foo --path "apps/web/**"

# List all components in web app
ng-explorer search --type component --path "apps/web/**"

# Search in specific library
ng-explorer search bar --path "libs/common/**"

# Search in specific subdirectory
ng-explorer search form --path "libs/common/src/components/**"
```

### View API Details

Get comprehensive API information for a specific construct:

```bash
# View component API
ng-explorer api FooComponent

# View service API
ng-explorer api BarService

# Search for a specific type
ng-explorer api BarService --type injectable
```

The API command shows:
- **For Components**: selector, standalone status, inputs, outputs, properties, methods, constructor dependencies
- **For Services**: properties, methods, constructor dependencies
- **For Directives**: selector, inputs, outputs, methods
- **For Pipes**: pipe name, pure status

### View Statistics

Show statistics about the codebase:

```bash
ng-explorer stats
```

Output:
```
Angular Codebase Statistics
────────────────────────────────────────
Components:     245
Injectables:    187
Directives:     42
Pipes:          28
Modules:        53
Classes:        312
────────────────────────────────────────
Total:          867
```

### Custom Documentation Path

If your documentation.json is in a different location:

```bash
ng-explorer --doc-path /path/to/documentation.json search foo
ng-explorer -d ./docs/documentation.json api FooService
```

## Command Reference

### `search [query] [options]`

Search for Angular constructs by name or description. Omit the query to list all constructs.

**Arguments:**
- `[query]` - Search query string (optional - omit to list all)

**Options:**
- `-t, --type <type>` - Filter by type: `component`, `injectable`, `directive`, `pipe`, `module`, `class`, `all` (default: `all`)
- `-p, --path <pattern>` - Filter by file path pattern (supports wildcards like `apps/web/**` or `libs/vault/**`)
- `-l, --limit <number>` - Limit number of results (default: `50`)

**Examples:**
```bash
# Search for constructs
ng-explorer search "user"
ng-explorer search "foo" --type component
ng-explorer search "bar" -t injectable

# List all constructs (no query)
ng-explorer search --type component --limit 10
ng-explorer search --type injectable

# Combine filters
ng-explorer search "foo" --path "apps/web/**"
ng-explorer search --type component --path "libs/common/**" --limit 20
```

### `api <name> [options]`

Display detailed API information for a construct.

**Arguments:**
- `<name>` - Name of the construct (case-insensitive)

**Options:**
- `-t, --type <type>` - Filter by type: `component`, `injectable`, `directive`, `pipe`, `module`, `class`, `all` (default: `all`)

**Examples:**
```bash
ng-explorer api FooComponent
ng-explorer api BarService
ng-explorer api TooltipDirective --type directive
```

### `stats`

Show statistics about the Angular codebase.

**Examples:**
```bash
ng-explorer stats
```

## Output Format

### Search Results

Search results are displayed in a table format:

```
┌───────────┬─────────────────────────┬──────────────────────────────────┬───────────────────┐
│ Type      │ Name                    │ File                             │ Selector/Pipe     │
├───────────┼─────────────────────────┼──────────────────────────────────┼───────────────────┤
│ component │ FooComponent            │ apps/web/src/app/foo/...         │ app-foo           │
│ component │ BarComponent            │ apps/web/src/app/bar/...         │ app-bar           │
│ injectable│ BazService              │ libs/common/src/services/...     │ —                 │
└───────────┴─────────────────────────┴──────────────────────────────────┴───────────────────┘

Found 3 result(s)
```

### API Details

API details are formatted with sections:

```
FooComponent
File: apps/web/src/app/foo/foo.component.ts
Type: component
Standalone: Yes

Selector:
  app-foo

Inputs:
  • items: Item[]
    List of items to display
  • config: FooConfig
    Configuration options

Outputs:
  • itemSelected: EventEmitter<string>
    Emitted when an item is selected

Methods:
  • refresh(): Promise<void>
    Refreshes the items list
  • selectItem(id: string): void
    Selects an item by ID

Constructor Dependencies:
  • fooService: FooService
  • barService: BarService
```

## Troubleshooting

### Error: Documentation file not found

Make sure you've generated the documentation.json file:

```bash
npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected
```

### Error: Failed to parse documentation.json

The documentation file may be corrupted. Try regenerating it:

```bash
rm documentation.json
npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected
```

### No results found

Try:
- Using a broader search term
- Searching without a type filter (`--type all`)
- Checking if the construct exists in the codebase
- Regenerating the documentation.json file

## License

GPL-3.0
