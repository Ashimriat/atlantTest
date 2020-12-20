const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, args) => {
	const IS_DEV = args.mode === 'development';
	
	const config = {
		mode: args.mode,
		entry: {
			main: {
				import: path.resolve(__dirname, 'src/bootstrap'),
				dependOn: 'common'
			},
			common: [
				path.resolve(__dirname, 'src/config'), path.resolve(__dirname, 'src/constants'),
				path.resolve(__dirname, 'src/utils'), path.resolve(__dirname, 'src/bootstrap/store/actionsMutations'),
			]
		},
		optimization: {
			minimize: !IS_DEV,
			runtimeChunk: 'single',
			splitChunks: {
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
					},
				}
			},
			removeEmptyChunks: true,
			mergeDuplicateChunks: true,
			flagIncludedChunks: !IS_DEV
		},
		resolve: {
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
					exclude: /node_modules/,
					use: [
						'vue-style-loader',
						'style-loader',
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
			new CopyWebpackPlugin({
				patterns: [{
					from: 'src/index.html'
				}]
			})
		],
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
