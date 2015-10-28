var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('css', function() {
    gulp.src('src/iphoto.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss({
            compatibility: 'ie8',
            advanced: false,
            keepSpecialComments: '1'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('js', function() {
  return gulp.src('src/iphoto-plugin.js')
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['js', 'css']);