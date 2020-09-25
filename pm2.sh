echo "Hello Fooding Server"
pm2 start ecosystem.config.js # --env production
echo "Server Log =========================================================="
pm2 logs