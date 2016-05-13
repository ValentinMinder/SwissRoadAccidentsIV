var gulp = require("gulp");
var less = require("gulp-less");
var path = require("path");
var cleanCSS = require("gulp-clean-css");

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
