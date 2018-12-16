const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const rename = require('gulp-rename');
const ejs = require("gulp-ejs");


gulp.task('ejs', () => {
  return gulp.src('example/*.ejs')
    .pipe($.plumber())
    .pipe(ejs({}))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest('.tmp/'))
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', () => {
  return gulp.src('example/styles/*.css')
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('example/scripts/**/*.js')
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('example/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('example/scripts'));
});

gulp.task('images', () => {
  return gulp.src('example/images/**/*')
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('example/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', gulp.series('ejs', 'styles', 'scripts', 'images', 'fonts', function(done) {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'example']
    }
  });

  gulp.watch([
    'example/*.html',
    'example/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('example/**/*.ejs', gulp.series('ejs'));
  gulp.watch('example/styles/**/*.css', gulp.series('styles'));
  gulp.watch('example/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('example/fonts/**/*', gulp.series('fonts'));

  done();
}));

gulp.task('extras', () => {
  return gulp.src([
    'example/styles/ie/*.*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/styles/ie/'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.*']));

gulp.task('build', gulp.series('lint', 'ejs', 'images', 'fonts', 'styles', 'scripts', 'extras', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
}));

gulp.task('default', gulp.series('clean', 'build', (done) => {
  done();
}));
