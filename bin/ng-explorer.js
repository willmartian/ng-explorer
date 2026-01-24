#!/usr/bin/env node

import('../dist/index.js').catch((err) => {
  console.error('Failed to load ng-explorer:', err.message);
  process.exit(1);
});
