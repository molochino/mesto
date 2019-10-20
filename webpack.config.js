const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // добавили плагин
const webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const ghpages = require('gh-pages');
module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
	  {
		test: /\.css$/i,
		use: [
			(isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
			'css-loader', 
			'postcss-loader'
			]
		},      
	  {
		test: /\.(eot|ttf|woff|woff2)$/,
		loader: 'file-loader?name=./vendor/[name].[ext]'
		},
	  {
		  test: /\.(png|jpg|gif|ico|svg)$/,
		  use: [
			'file-loader?name=./images/[name].[ext]', // указали папку, куда складывать изображения
		{
         loader: 'image-webpack-loader'
         
		}
		]
	   }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // 
      filename: 'index.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      filename: 'index.html'
    }),
	new webpack.DefinePlugin({
		'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}),
	new OptimizeCssAssetsPlugin({
     assetNameRegExp: /\.css$/g,
     cssProcessor: require('cssnano'),
     cssProcessorPluginOptions: {
             preset: ['default'],
     },
     canPrint: true
	}),
    new WebpackMd5Hash()	
  ]
};