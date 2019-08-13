const path = require('path'),
      babiliPlugin = require('babili-webpack-plugin'),
      extractTextPlugin = require('extract-text-webpack-plugin'),
      optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
      webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins = [];

plugins.push(new HtmlWebpackPlugin({
    hash: true,
    minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
    },    
    filename: 'index.html',
    template: __dirname + '/main.html'
}));

plugins.push(
    new extractTextPlugin("styles.css")
);

plugins.push(
    new webpack.ProvidePlugin({
           '$': 'jquery/dist/jquery.js',
           'jQuery': 'jquery/dist/jquery.js'
    })
);

let SERVICE_URL = JSON.stringify('http://localhost:3000'); //endereço de dev
if(process.env.NODE_ENV == 'production'){

    SERVICE_URL = JSON.stringify('http://endereco-da-api'); //endereço de produção

    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
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

plugins.push(new webpack.DefinePlugin({ SERVICE_URL })); 

module.exports = {
    entry: {
        app: './app-src/app.js',
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
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
    externals: {
        jquery: 'jQuery'
    },
    mode: 'development',
    optimization: {
          splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "all"
                }
            }
        }
    },
    plugins
}