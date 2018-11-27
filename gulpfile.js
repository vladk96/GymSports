var gulp = require ('gulp');
var cssClean = require ('gulp-clean-css');
var sass = require ('gulp-sass');
var sourcemaps = require ('gulp-sourcemaps');
var browserSync = require ('browser-sync').create();
var del = require ('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');


gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "src/"
    });

    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});


gulp.task('sass', function() {
    return gulp.src("src/scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        //.pipe(gcmq())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], { cascade: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task('sass-watch', function() {
  gulp.watch('src/scss/*.scss', ['sass']);
});


gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('img-min', function() {
  return gulp.src('src/images/**/*.*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/images/'));
});


gulp.task('css-min', function() {
  gulp.src('src/css/main.css')
  .pipe(cssClean({compatibility: 'ie9'}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist/css/'));
});


gulp.task('build', ['clean', 'img-min', 'sass', 'css-min'], function() {
  var buildCss = gulp.src('src/css/main.min.css')
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clear-gulp-cache', function () {
    return cache.clearAll();
});