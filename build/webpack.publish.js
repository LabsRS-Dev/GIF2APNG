var CopyWebpackPlugin = require('copy-webpack-plugin');
const options = require('./options')

module.exports = {
    context: options.paths.root,
    entry: [
        options.paths.resolve('dist/bundle.js')
    ],
    output: {
        filename: 'bundle.js',
        path: options.paths.output.publish
    },
        
    devServer: {
        // This is required for older versions of webpack-dev-server
        // if you use absolute 'to' paths. The path should be an
        // absolute path to your build destination.
        outputPath: options.paths.resolve('dist_public')
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: 'dist',
                from: '**/*',
                force: true
            },
            {
               context: 'build/data',
               from: '*.json',
               force: true
            }
        ], {
            ignore: [
                // Doesn't copy any files with a spec extension    
                '*.js.map',
                '*.css.map'
            ],

            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        })
    ]
};