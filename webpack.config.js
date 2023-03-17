const path = require('path');

module.exports = {
  entry: {
    content: './content.js',
    IntermediateAudioProcessor: './modules/IntermediateAudioProcessor.js'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js',
  },

  resolve: {
      alias: {
          'socket.io-client': path.join( __dirname, 'node_modules', 'socket.io-client', 'dist', 'socket.io.js' )
      }
  },
  target: "web",
  module: {
    rules: [
      {
        test: require.resolve('socket.io-client'),
        use: 'script-loader',
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // ensure compatibility with older browsers
            plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
          },
        },
      },
      {
        test: /\.js$/,
        loader: "webpack-remove-debug", // remove "debug" package
      },
    ],
  },
};