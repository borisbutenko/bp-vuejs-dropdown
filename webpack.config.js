'use strict';

// --- dependencies
const webpack = require('webpack');
const path = require('path');
const StatsPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const HappyPack = require('happypack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// --- Environment
const NODE_ENV = process.env.NODE_ENV;
const isProduction = (NODE_ENV === 'production');

// --- Filename
const filename = process.env.npm_config_filename || 'main';
const entry = path.resolve(__dirname, `demo/${filename}.js`);

// --- Paths
const devPath = path.resolve(__dirname, './demo');
const buildPath = devPath;

// --- Postcss config
const postcssConfig = {
    plugins: [
        require('precss')(),
        require('postcss-cssnext')(),
        // require('postcss-autoreset')(),
        // require('postcss-initial')(),
        require('postcss-flexbugs-fixes')()
    ]
};

// --- Base Webpack configuration
const webpackConfig = {
    entry: entry,

    output: {
        path: (isProduction) ? buildPath : devPath,
        filename: `dropdown${(isProduction) ? '.min' : ''}.js`
    },

    devtool: (isProduction) ? false : 'cheap-module-inline-source-map',

    performance: { hints: false },

    stats: { children: false },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        autoprefixer: false,
                        postcss: postcssConfig
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'happypack/loader'
                }
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) }
        }),
        new HappyPack({
            loaders: ['babel-loader?presets[]=latest']
        }),
        new StatsPlugin({
            filename: 'manifest.json',
        })
    ],

    resolve: {
        extensions: ['.js', '.vue'],
        modules: ['node_modules'],
        alias: {
            vue: 'vue\\dist\\vue.js'
        }
    }
};

// --- Production plugins
if (isProduction) {
    webpackConfig.plugins.push(
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJSPlugin({ parallel: true }),
        new OptimizeCSSPlugin({ cssProcessorOptions: { safe: true } }),
        new webpack.LoaderOptionsPlugin({
            debug: false,
            options: {

            }
        }),
        new CompressionPlugin()
    )
}

module.exports = webpackConfig;