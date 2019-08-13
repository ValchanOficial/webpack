const path = require('path'),
      babiliPlugin = require('babili-webpack-plugin'),
      extractTextPlugin = require('extract-text-webpack-plugin'),
      optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let plugins = [];

plugins.push(
    new extractTextPlugin("styles.css")
);

if(process.env.NODE_ENV == 'production'){
    
    plugins.push(new babiliPlugin());

    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            }
        },
        canPrint: true
     }));
}

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },{ 
                test: /\.css$/, 
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },{
                test: /\.(ttf|eot|svg|gif|jpg|png|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      limit: 10000,
                    },
                  },
                ],
              }
        ]
    },
    plugins
}