# ng-explorer

A CLI tool to efficiently search and explore Angular components, services, directives, and other constructs in Angular projects.

## Installation

```bash
npm install -g ng-explorer
```

### Claude Code Integration

For Claude Code users, install the plugin to enable the `/ng-explorer` skill:

```bash
/plugin install https://github.com/willmartian/ng-explorer
```

Once installed, you can use `/ng-explorer` directly in your Claude Code sessions to search Angular constructs.

## Prerequisites

`ng-explorer` uses Compodoc under the hood. You need to generate the documentation first:

```bash
# From repository root
npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected
```

This creates a `documentation.json` file in the repository root.

## Usage

### Basic Search

Search for Angular constructs by name, or omit the query to list all:

```bash
# Fuzzy search for anything matching "foo"
ng-explorer foo

# List all components
ng-explorer --type component

# Search only components matching "foo"
ng-explorer foo --type component

# Search directives
ng-explorer tooltip --type directive

# Search in specific subdirectory
ng-explorer form --path "libs/common/src/components/**"

# Exact name match (no fuzzy search)
ng-explorer FooComponent --exact

# Exact match with type filter
ng-explorer BarService --exact --type injectable
```

### Verbose API Details

Show full API details using the `--verbose` flag:

```bash
# View component API (exact match + verbose)
ng-explorer FooComponent --exact --verbose
```

The verbose view shows:
- **For Components**: selector, standalone status, inputs, outputs, properties, methods, constructor dependencies
- **For Services**: properties, methods, constructor dependencies
- **For Directives**: selector, inputs, outputs, methods
- **For Pipes**: pipe name, pure status

### Custom Documentation Path

If your documentation.json is in a different location:

```bash
ng-explorer --doc-path /path/to/documentation.json foo
ng-explorer -d ./docs/documentation.json FooService --exact --verbose
```

## Command Reference

### `ng-explorer [query] [options]`

Search for Angular constructs by name or list all constructs.

**Arguments:**
- `[query]` - Search query string (optional - omit to list all)

**Options:**
- `-d, --doc-path <path>` - Path to documentation.json file (default: `./documentation.json`)
- `-t, --type <type>` - Filter by type: `component`, `injectable`, `directive`, `pipe`, `module`, `class`, `all` (default: `all`)
- `-p, --path <pattern>` - Filter by file path pattern (supports wildcards like `apps/web/**` or `libs/common/**`)
- `-l, --limit <number>` - Limit number of results (default: `50`)
- `-v, --verbose` - Show full API details for each result
- `-e, --exact` - Use exact name matching instead of fuzzy search

**Examples:**
```bash
# Fuzzy search
ng-explorer foo
ng-explorer bar --type injectable

# Exact match
ng-explorer FooComponent --exact

# Show verbose API details
ng-explorer FooComponent --exact --verbose
ng-explorer foo --verbose

# Combine filters
ng-explorer foo --path "apps/web/**" --type component

# Custom documentation path
ng-explorer -d ./docs/documentation.json foo
```

## Troubleshooting

### Error: Failed to parse documentation.json

The documentation file may be corrupted. Try regenerating it:

```bash
rm documentation.json
npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected
```


## License

GPL-3.0
