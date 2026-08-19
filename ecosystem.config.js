module.exports = {
  apps: [
    {
      name: "buxsoft-uz",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "/root/buxsoft-clean",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "/var/log/pm2/buxsoft-uz-err.log",
      out_file: "/var/log/pm2/buxsoft-uz-out.log",
      pid_file: "/var/log/pm2/buxsoft-uz.pid"
    }
  ]
};