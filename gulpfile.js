const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const $ = gulpLoadPlugins();

gulp.task('concat', () => {
  return gulp.src('src/**/*.js')
    .pipe($.plumber())
    .pipe(concat('boids.js'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('ugly', () => {
  return gulp.src('.tmp/boids.js')
    .pipe($.plumber())
    .pipe(uglify('boids.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('example/app/scripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'build/*.js']));

gulp.task('serve', ['concat', 'ugly'], () => {
  gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('build', ['concat', 'ugly'], () => {
  return gulp.src('build/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
