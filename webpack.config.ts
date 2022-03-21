import * as path from "path";
// import * as webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import glob from "glob";
import HtmlWebpackPlugin = require("html-webpack-plugin");

let config: Configuration = {};

let generateHtmlPages = () => glob.sync("./src/**/*.html", { root: "./src/" }).map(
    dir => new HtmlWebpackPlugin({
        filename: dir.replace(/\.\/src\//, ""),
        template: dir,
        inject: false,
        minify: false,
    })
);

module.exports = (env: any, argv: any) => {
    const isProduction = argv.mode === "production";

    config = {
        devtool: "source-map",
        entry: {
            index: "./src/index.ts",
        },
        module: {
            rules: [
                {
                    test: /\.html$/i,
                    // type: "asset/resource",
                    use: [
                        "html-loader"
                    ],
                    // generator: {
                    //     filename: "[name][ext]"
                    // }
                },
                {
                    test: /\.(js|ts)$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-typescript"],
                        },
                    },
                },
                {
                    test: /\.(sa|sc|c)ss$/i,
                    type: "asset/resource",
                    use: [
                        // Creates minified css files from JS strings
                        MiniCssExtractPlugin.loader,
                        // isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    quietDeps: true, // fontawesome is bruh moment
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|webp|svg)$/i,
                    type: "asset/resource",
                    generator: {
                        "filename": "assets/img/[name][ext]",
                    },
                },
                { // for favicon.ico
                    test: /\.ico$/i,
                    type: "asset/resource",
                    generator: {
                        "filename": "assets/[name][ext]",
                    },
                },
            ],
        },
        output: {
            path: path.resolve(__dirname, "build", isProduction ? "prod" : "dev"),
        },
        plugins: [
            new MiniCssExtractPlugin(
                {
                    filename: "assets/css/[name].css",
                },
            ),
            ...generateHtmlPages(),
        ],
    };

    return config;
};
