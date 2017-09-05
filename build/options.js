'use strict';


const path = require('path');

const packageCfg = require('../package.json');

const appName = packageCfg.name;
const appVersion = packageCfg.version;
const repository = packageCfg.repository.url;
const autor = packageCfg.author.name;
const autorEmail = packageCfg.author.email;


const banner =
    '/*!\n' +
    ' * ' + appName + ' v' + appVersion + ' (' + repository + ')\n' +
    ' * (c) ' + new Date().getFullYear() + ' ' + autor +'  ('  + autorEmail  + ')\n' +
    ' * Released under the MIT License.\n' +
    ' */';

console.log("banner:");
console.log(banner);

module.exports = {
    banner,

    isProduction: process.env.NODE_ENV === 'production',

    paths: {
        root: path.join(__dirname, '..'),

        src: {
            main: path.join(__dirname, '..', 'src'),
            docs: path.join(__dirname, '..', 'docs-src')
        },

        output: {
            main: path.join(__dirname, '..', 'dist'),
            lib: path.join(__dirname, '..', 'lib'),
            publish: path.join(__dirname, '..', 'dist_public'),
            docs: path.join(__dirname, '..', 'docs')
        },

        resolve(location) {
            return path.join(__dirname, '..', location);
        },

        resolveEx(baseDir, location) {
            return path.join(baseDir, location);
        }
    }
}
