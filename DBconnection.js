#!/usr/bin/env node
let options = {
    login: process.argv[2] || process.env.npm_package_config_login,
    password: process.argv[3] || process.env.npm_package_config_password,
    host: process.argv[4] || process.env.npm_package_config_host,
    port: process.argv[5] || process.env.npm_package_config_port,
    db: process.argv[6] || process.env.npm_package_config_db
};
const connection = `mongodb://${options.login}:${options.password}@${options.host}:${options.port}/${options.db}`;
console.log(connection)
module.exports = connection;