let mix = require('laravel-mix');

mix.setPublicPath('dist')
    .js('resources/js/tool.js', 'js')
    .vue()
    .sass('resources/sass/tool.scss', 'css', {}, [
        require('autoprefixer'),
        require('postcss-logical'),
        require('postcss-dir-pseudo-class'),
    ]);
