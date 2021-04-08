var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var less = require('gulp-less');
var template = require('gulp-template');
var tsProject = ts.createProject('tsconfig.json');
var gulpWebpack = require('webpack-stream');
var gutil = require('gulp-util');

gulp.task('compile', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('build'));
});

gulp.task('lint', function () {
    return tsProject.src()
        .pipe(tslint())
        .pipe(tslint.report())
});

gulp.task('less', function () {
    return gulp.src('./src/_less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('webpack', function () {
    return gulp.src('build/browser-app.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'browser-pack.js'
            },
            mode: 'development'
        }))
        .pipe(gulp.dest('dist/'));
});


gulp.task('webpack-prod', function () {
    return gulp.src('build/browser-app.js')
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

gulp.task('inject-timestamp', function () {
    return gulp.src('./dist/index.html')
        .pipe(template({
            timestamp: Date.now()
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('inject-local-url', function () {
    return gulp.src('./build/helpers/games-repository.js')
        .pipe(template({
            local_server_url: gutil.env.local_server_url
        }))
        .pipe(gulp.dest('./build/helpers/'));
});

gulp.task('default', gulp.parallel(gulp.series('copy-data', 'inject-timestamp'), gulp.series('compile', 'inject-local-url', 'lint')));
gulp.task('browser-default', gulp.parallel('less', 'default'));
gulp.task('browser', gulp.series('browser-default', 'webpack'));
gulp.task('browser-prod', gulp.series('browser-default', 'webpack-prod'));
gulp.task('node', gulp.series('default'));