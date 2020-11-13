module.exports = {
  apps : [{
    name: 'SERVER',
    script: './bin/www',
    instances: 4,
    watch: true,
    ignore_watch : ['node_modules','public'],
    exec_mode : 'cluster',
    wait_ready: true,
    max_restarts: 2,
    listen_timeout: 10000,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
  }]
};