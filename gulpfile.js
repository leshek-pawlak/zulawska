// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var rename          = require('gulp-rename');
var minifyCSS       = require('gulp-minify-css');
var plumber         = require('gulp-plumber');
var notify          = require('gulp-notify');
var postcss         = require('gulp-postcss');
var cssnano         = require('cssnano');
var autoprefixer    = require('autoprefixer');
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ghostMode: false,
        port: 9001,
        ui: false,
        online: false,
        open: "local"
    });
});

// compile CSS
gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano(),
    ];
    return gulp.src([
        './src/css/app.css',
    ])
    .pipe(postcss(processors))
    .pipe(plumber({errorHandler: notify.onError("CSS error: <%= error.message %>")}))
    .pipe(minifyCSS())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(reload({stream: true}));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        './src/js/*.js',
    ])
    .pipe(plumber({errorHandler: notify.onError("Scripts error: <%= error.message %>")}))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(reload({stream: true}));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/css/**/*.css', ['css']);
});

// Default Task
gulp.task('default', ['css', 'scripts']);
gulp.task('run', ['css', 'scripts', 'watch', 'browser-sync']);
