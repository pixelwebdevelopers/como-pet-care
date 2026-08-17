module.exports = {
  apps: [
    {
      name: 'como-pet-care',
      // Next.js standalone output compiles a single self-contained server.js file
      script: './.next/standalone/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
