var gulp = require("gulp");
var clean = require('gulp-clean');
var cleanCSS = require("gulp-clean-css");
var exec = require('gulp-exec');
var ghtmlSrc = require('gulp-html-src');
var htmlmin = require('gulp-htmlmin');
var jsonmin = require('gulp-jsonmin');
var less = require("gulp-less");
var runSequence = require('run-sequence');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify');

gulp.task("default", [
    "less",
]);

gulp.task("less", function () {
    return gulp.src("./css/style.less")
        .pipe(less())
        .pipe(gulp.dest("./css/"));
});


gulp.task('watch', function() {
    gulp.watch('./css/*.less', ['less']); 
});

gulp.task("data", function () {
    var options = {
        cwd: './data/scripts',
        continueOnError: false, // default = false, true means don't emit error event
        pipeStdout: false, // default = false, true means stdout is written to file.contents
        customTemplatingThing: "test" // content passed to gutil.template()
    };
    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    }
    gulp.src('./data/scripts/*.py')
        .pipe(exec('py -3 <%= file.path %>', options))
        .pipe(exec.reporter(reportOptions));
});

gulp.task("min/js", function() {
    return gulp.src('./js/*.js')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./min/js/'));
});

gulp.task('clean', function() {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

gulp.task("copy", [
    "copy/css",
    "copy/html",
    "copy/js",
    "copy/json",
    "copy/svg",
    "copy/templates",
]);

gulp.task('copy/css', ["less"], function() {
    gulp.src('./*.html')
        .pipe(ghtmlSrc({ presets: 'css'}))
        .pipe(gulp.dest('./build/copy'));
});
gulp.task('copy/html', function() {
    gulp.src('./*.html')
        .pipe(gulp.dest('./build/copy'));
});
gulp.task('copy/js', function() {
    gulp.src('./*.html')
        .pipe(ghtmlSrc())
        .pipe(gulp.dest('./build/copy'));
});
gulp.task("copy/json", function() {
    return gulp.src('./data/**/*.json')
        .pipe(gulp.dest('./build/copy/data'));
});
gulp.task("copy/svg", function() {
    return gulp.src('./img/**/*.svg')
        .pipe(gulp.dest('./build/copy/img'));
});
gulp.task('copy/templates', function() {
    return gulp.src('./templates/*.html')
        .pipe(gulp.dest('./build/copy/templates/'));
});

gulp.task("min", [
    "min/css",
    "min/html",
    "min/js",
    "min/json",
    "min/svg",
]);
gulp.task("min/css", function () {
    return gulp.src("./build/copy/**/*.css")
        .pipe(cleanCSS())
        .pipe(gulp.dest("./build/min"));
});
gulp.task("min/html", function() {
    return gulp.src("./build/copy/**/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("./build/min"));
});
gulp.task("min/js", [
    "min/js/bower",
    "min/js/app",
]);
gulp.task("min/js/bower", function() {
    return gulp.src("./build/copy/bower_components/**/*.js")
        .pipe(gulp.dest("./build/min/bower_components"));
});
gulp.task("min/js/app", function() {
    return gulp.src("./build/copy/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/min/js/"));
});
gulp.task("min/json", function() {
    return gulp.src("./build/copy/**/*.json")
        .pipe(jsonmin())
        .pipe(gulp.dest("./build/min"));
});
gulp.task("min/svg", function() {
    return gulp.src("./build/copy/**/*.svg")
        .pipe(svgmin())
        .pipe(gulp.dest("./build/min"));
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'copy',
        'min',
        callback);
});
