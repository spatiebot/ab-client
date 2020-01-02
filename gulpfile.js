var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var less = require('gulp-less');
var path = require('path');
var tsProject = ts.createProject('tsconfig.json');
var gulpWebpack = require('webpack-stream');

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
    return gulp.src('./less/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./dist'));
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

gulp.task('default', gulp.parallel('copy-data', gulp.series('compile', 'lint')));
gulp.task('browser-default', gulp.parallel('less', 'default'));
gulp.task('browser', gulp.series('browser-default', 'webpack'));
gulp.task('browser-prod', gulp.series('browser-default', 'webpack-prod'));
gulp.task('node', gulp.series('default'));