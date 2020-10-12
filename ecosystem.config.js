module.exports = {
  apps : [{
    name: 'server',
    script: './bin/www',
    instances: 1,
    watch: true,
    time : true,
    ignore_watch : ['node_modules','public'],
    exec_mode : 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};