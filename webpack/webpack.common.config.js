const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: `${paths.src}/index.tsx`,
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${paths.public}/index.html`,
      filename: 'index.html',
    }),
  ],
};
