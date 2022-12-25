import { dirname, resolve } from "path";

export default {
  entry: {
    generator: "./src/utils/generateDay.ts",
    main: "./src/index.ts",
  },
  mode: "development",
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
    filename: "[name].cjs",
    path: resolve(dirname("[name].cjs"), "dist"),
  },
  target: "node",
  experiments: {
    topLevelAwait: true,
  },
};
