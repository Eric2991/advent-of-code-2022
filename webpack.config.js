import { dirname, resolve } from "path";

export default {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    clean: true,
    filename: "bundle.cjs",
    path: resolve(dirname("bundle.cjs"), "dist"),
  },
  target: 'node',
  experiments: {
    topLevelAwait: true
  }
};
