/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'MENU_ITEMS': JSON.stringify(require('./src/app/components/menu'))
      })
    );
    return config
  }
}

module.exports = nextConfig
