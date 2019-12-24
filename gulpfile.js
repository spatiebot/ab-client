var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var tsProject = ts.createProject('tsconfig.json');
// var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');

gulp.task('compile', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
    return tsProject.src()
        .pipe(tslint())
        .pipe(tslint.report())
});

gulp.task('webpack', function() {
    return gulp.src('dist/browser-app.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'browser-pack.js'
            },
            mode: 'development'
        }))
        .pipe(gulp.dest('dist/'));
});


gulp.task('webpack-prod', function() {
    return gulp.src('dist/browser-app.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'browser-pack.js'
            },
            mode: 'production'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-data', function () {
    return gulp.src('./static/**')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', gulp.parallel('copy-data', gulp.series('compile', 'lint')));
gulp.task('browser', gulp.series('default', 'webpack'));
gulp.task('browser-prod', gulp.series('default', 'webpack-prod'));
gulp.task('node', gulp.series('default'));