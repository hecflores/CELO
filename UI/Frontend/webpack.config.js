var WebpackStrip = require('strip-loader');
var path = require("path");
var config = {
    entry: './src/app.js',

    output: {
        path:path.resolve('../Backend/public/resources'),
        filename: 'index.js',
    },

    devServer: {
        inline: true,
        port: 8080
    },
    resolve: {
        root: [
            path.resolve('./src')
        ]
    },
    module: {
        preLoaders: [
            {
                test: /\.js|\.jsx?$/,
                loader: 'import-glob'
            }
        ],
        loaders: [

            {
                test: /\.js|\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2016', 'react']
                }
            },

            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=25000'
            }
        ]
    }
}

module.exports = config;