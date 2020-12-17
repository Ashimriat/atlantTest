const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, args) => {
	const IS_DEV = args.mode === 'development';
	const envCssLoader = IS_DEV ?
		'style-loader' :
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				esModule: false,
				modules: {
					namedExport: false,
				}
			}
		};
	
	const config = {
		mode: args.mode,
		entry: {
			main: path.resolve(__dirname, 'src/bootstrap')
		},
		resolve: {
			alias: {
				elements: path.resolve(__dirname, 'src/components/elements'),
				components: path.resolve(__dirname, 'src/components'),
			},
			extensions: ['.vue', '.ts', '.js']
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					exclude: /node_modules/,
					loader: 'vue-loader',
					options: {
						loaders: {
							ts: 'babel-loader'
						}
					}
				},
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.pug$/,
					exclude: /node_modules/,
					loader: 'pug-plain-loader'
				},
				{
					test: /\.s([ca])ss$/,
					use: [
						'vue-style-loader',
						envCssLoader,
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								implementation: require('dart-sass'),
								sourceMap: true,
								sassOptions: {
									indentedSyntax: true,
								}
							}
						}
					]
				}
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			// new HtmlWebpackPlugin(), TODO: вместо нижнего
			new CopyWebpackPlugin({
				patterns: [{
					from: 'src/index.html'
				}]
			})
		]
	};
	
	if (IS_DEV) {
		config.devtool = 'source-map';
		config.devServer =  {
			contentBase: path.resolve(__dirname, 'dist'),
			port: 8080,
			hot: true,
			index: 'index.html',
			open: 'Google Chrome'
		};
		config.plugins.push(new BundleStatsWebpackPlugin({
			// use local saved stats for comparison
			compare: true,
			// save current webpack stats as baseline
			baseline: false,
			// output html report
			html: true,
			// output json report
			json: false,
			// output directory relative to webpack output.path
			outDir: '',
			// Webpack stats options default
			stats: {
				// context: WEBPACK_CONTEXT,
				assets: true,
				entrypoints: true,
				chunks: true,
				modules: true,
				builtAt: true,
				// hash: true
			}
		}))
	}
	
	return config;
};