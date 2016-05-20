var gulp = require("gulp");
var less = require("gulp-less");
var path = require("path");
var cleanCSS = require("gulp-clean-css");
var exec = require('gulp-exec');

gulp.task("default", [
    "less",
]);

gulp.task("min", [
    "min/css",
]);

gulp.task("less", function () {
    return gulp.src("./css/style.less")
        .pipe(less())
        .pipe(gulp.dest("./css/"));
});
gulp.task("min/css", ["less"], function () {
    return gulp.src("./css/style.css")
        .pipe(cleanCSS())
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
