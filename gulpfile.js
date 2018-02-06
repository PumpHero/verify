var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var bro = require('gulp-bro');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');

// Compile SCSS
gulp.task('css:compile', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
    return gulp.src([
            './css/*.css',
            '!./css/*.min.css'
        ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
    return gulp.src([
            './js/*.js',
            '!./js/*.min.js'
        ])
        .pipe(bro())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['css', 'js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "verify.html"
        }
    });
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function() {
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch('./*.html', browserSync.reload);
});

gulp.task('clean', () => {
    return gulp.src('./dist', {
            read: false
        })
        .pipe(clean());
});

gulp.task('prod', ['build'], () => {
    browserSync.init({
        server: {
            'baseDir': './dist',
            index: "verify.html"
        }
    })
});

// Build production
gulp.task('build', ['clean', 'css', 'js'], () => {
    gulp.src([
            './css/ph.min.css'
        ])
        .pipe(gulp.dest('./dist/css'))

    gulp.src([
            './img/**/*'
        ])
        .pipe(gulp.dest('./dist/img'))

    gulp.src([
            './js/ph.min.js'
        ])
        .pipe(gulp.dest('./dist/js'))

    gulp.src([
            '*.html'
        ])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./dist'))

    gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/popper.js/dist/umd/popper.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            './node_modules/jquery.easing/jquery.easing.min.js'
        ])
        .pipe(concat('ph.vendors.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(gulp.dest('./js'))

    gulp.src([
            './node_modules/bootstrap/dist/css/bootstrap.min.css'
        ])
        .pipe(concat('ph.vendors.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./css'))
});
