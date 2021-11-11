const path = require("path");

// plugins
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

module.exports = {
  target: "node",
  mode: "production",
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        keepNames: true,
      }),
    ],
  },
  entry: "./src/Startup.ts",
  output: {
    filename: "prod.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js", ".tsx"],
  },
  plugins: [
    new Dotenv({ path: path.resolve(__dirname, ".env") }),
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
    new webpack.NormalModuleReplacementPlugin(
      /m[sy]sql2?|oracle(db)?|sqlite3|pg-(native|query)/
    ),
  ],

  externals: [
    {
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      knex: "commonjs knex",
    },
  ],
};
