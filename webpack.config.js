// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        libraryTarget: 'var',
        library: 'mylib',
    },
    target: "node",
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
              { from: "views", to: "views" },
              { from: "styles", to: "styles" },
              { from: "package.json", to: "" },
              { from: "webpack.config.js", to: "" }
            ],
          }),
      
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        new ZipPlugin({
            // OPTIONAL: defaults to the Webpack output path (above)
            // can be relative (to Webpack output path) or absolute
            path: "",
      
            // OPTIONAL: defaults to the Webpack output filename (above) or,
            // if not present, the basename of the path
            filename: "dist",
      
            // OPTIONAL: defaults to 'zip'
            // the file extension to use instead of 'zip'
            extension: "zip",
      
            // OPTIONAL: defaults to the empty string
            // the prefix for the files included in the zip file
            pathPrefix: "",
      
            // OPTIONAL: defaults to the identity function
            // a function mapping asset paths to new paths
            /*
            pathMapper: function (assetPath) {
              console.log(`assetPath=${assetPath}`);
              // put all pngs in an `images` subdir
              if (assetPath.match("main.js"))
                return path.join(
                  path.dirname(assetPath),
                  "dist",
                  path.basename(assetPath)
                );
              return assetPath;
            },
            */
      
            // OPTIONAL: defaults to including everything
            // can be a string, a RegExp, or an array of strings and RegExps
          include: [/\.html$/,/\.js$/,/\.ejs$/,/\.css$/,/\.json$/,"webpack.config.js"],
      
            // OPTIONAL: defaults to excluding nothing
            // can be a string, a RegExp, or an array of strings and RegExps
            // if a file matches both include and exclude, exclude takes precedence
            exclude: [/\.png$/],
      
            // yazl Options
      
            // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
            fileOptions: {
              mtime: new Date(),
              mode: 0o100664,
              compress: true,
              forceZip64Format: false,
            },
      
            // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
            zipOptions: {
              forceZip64Format: false,
            },
          }),
        ],
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                // type: 'asset',
                //exclude: 'node_modules/'
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
