"use strict";


const gulp = require('gulp');
const uglify = require('gulp-uglify'); // 压缩工具
const rev = require('gulp-rev');       // 加md5后缀的工具(利用文件内容生成的hash)
const revCollector = require('gulp-rev-collector'); //与rev共同使用
const minifyCss = require('gulp-minify-css'); // 压缩css工具
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const gulpSequence = require('gulp-sequence');


/* 每次构建之前先删除之前的进行清理 */
gulp.task('clean', function () {
    return del([
        //'dist/**/*',
        'rev*',
        'compress',
        '*.html',
        '*-*.js',
    ], function () {
    });
});


// compress 任务
gulp.task('compress', function () {
    // 压缩HTML
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };


    // 压缩html(xtpl文件夹下面都是么有压缩的，全部拷贝)
    gulp.src('xtpl/*.xtpl')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/xtpl'));


    // 压缩css
    gulp.src('./www/css/*.css', {base: './'})
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist'));


    // 拷贝视图文件(angular.js)
    gulp.src([
        './www/html/*.html',
        './controllers/*',
        './data/*',
        './models/*',
        './utils/*',
        './app.js',
        './config.js',
        './router.js',
        './www/images/userlogo.gif',
        './www/images/movie.svg'
    ], {base: './'})
        .pipe(gulp.dest('./dist'));


    // 压缩js
    return gulp.src(['./www/js/*.js', './www/js/**/*.js'], {base: './'})
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});


gulp.task('concat', function () {
// 压缩文件之后，生成hash文件名
    gulp.src(['./www/css/*.css', './www/js/*.js', './www/images/*'], {base: './'})
        .pipe(rev())  // 生成hash文件
        .pipe(gulp.dest('./dist'))
        .pipe(rev.manifest())  // 生成json映射文件
        .pipe(gulp.dest('./dist/rev'));
})


// modifyRef 任务
gulp.task('modifyRef', function () {
    // 根据生成的json文件去替换xtpl中的路径
    return gulp.src(['./dist/rev/*.json', './dist/xtpl/*.xtpl'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dist/views'));
});


// 制定一个总任务:
//      实现css文件的压缩（不合并）
//      实现js文件的压缩（不合并）
// 1. 先进行所有文件的压缩
// 2. 建立映射文件并执行
gulp.task('build', gulpSequence('clean', 'compress', 'concat'));
gulp.task('release', gulpSequence('modifyRef'));
gulp.task('default', gulpSequence('build', 'release'));





