const concat = require('gulp-concat');
const connect = require('gulp-connect');
const cp = require('child_process');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifyCSS = require('gulp-minify-css');
const mmq = require('gulp-merge-media-queries');
const plumber = require('gulp-plumber');
const prefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const uncss = require('gulp-uncss');

// Set the path variables
const base_path = './';
const src = base_path + '_dev';
const dist = base_path + 'assets';
const paths = {
  js: src + '/js/*.js',
  scss: src + '/sass/*.scss',
  jekyll: [
    'index.html',
    '_posts/*',
    '_layouts/*',
    '_includes/*',
    'assets/*',
    'assets/**/*'
  ],
  uncss: base_path + '_site/**/*.html'
};

// Compile sass to css
gulp.task('compile-sass', () => {
  return gulp
    .src(paths.scss)
    .pipe(
      plumber(error => {
        gutil.log(gutil.colors.red(error.message));
        gulp.task('compile-sass').emit('end');
      })
    )
    .pipe(sass())
    .pipe(prefixer('last 3 versions', 'ie 9'))
    .pipe(mmq())
    .pipe(minifyCSS())
    .pipe(
      uncss({
        html: [paths.uncss],
        ignore: [
          /^headroom/,
          /headroom--not-top/,
          /nav-toggle--is-open/,
          /ml_box/
        ]
      })
    )
    .pipe(rename({ dirname: dist + '/css' }))
    .pipe(gulp.dest('./'));
});

// Bundle js
gulp.task('build-js', function() {
  return gulp
    .src(paths.js)
    .pipe(
      plumber(error => {
        gutil.log(gutil.colors.red(error.message));
        gulp.task('build-js').emit('end');
      })
    )
    .pipe(concat('bundle.js'))
    .pipe(rename({ dirname: dist + '/js' }))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

// Rebuild Jekyll
gulp.task('build-jekyll', code => {
  return cp
    .spawn('jekyll', ['build', '--config', '_config.yml,_config_dev.yml'], {
      stdio: 'inherit'
    })
    .on('error', error => gutil.log(gutil.colors.red(error.message)))
    .on('close', code);
});

// Setup Server
gulp.task('server', () => {
  connect.server({
    root: ['_site'],
    port: 4000
  });
});

// Watch files
gulp.task('watch', () => {
  gulp.watch(paths.scss, ['compile-sass']);
  gulp.watch(paths.jekyll, ['build-jekyll']);
});

// Start Everything with the default task
gulp.task('default', [
  'compile-sass',
  'build-js',
  'build-jekyll',
  'server',
  'watch'
]);
