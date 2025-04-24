
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Path to node_modules/.bin/vite
const vitePath = path.resolve(__dirname, 'node_modules', '.bin', 'vite');

// Spawn vite process with all arguments passed to this script
const viteProcess = spawn(vitePath, process.argv.slice(2), { 
  stdio: 'inherit',
  shell: true
});

// Forward exit code
viteProcess.on('close', code => {
  process.exit(code);
});
