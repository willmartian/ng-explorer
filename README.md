# ng-explorer

A CLI tool to efficiently search and explore Angular components, services, directives, and other constructs in Angular projects.

## Installation

```bash
npm install -g ng-explorer
```

## Prerequisites

`ng-explorer` uses Compodoc under the hood. You need to generate the documentation first:

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

# List all components
ng-explorer search --type component

# Search only components fuzzy-match "foo"
ng-explorer search foo --type component

# Search directives
ng-explorer search tooltip --type directive

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

## Troubleshooting

### Error: Failed to parse documentation.json

The documentation file may be corrupted. Try regenerating it:

```bash
rm documentation.json
npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected
```


## License

GPL-3.0
