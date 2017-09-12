var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var htmlmin = require('gulp-htmlmin');
var ftpdeploy = require('gulp-ftp');



//Handler gestor de errores
var onError= function(err){
    console.log("Se ha producido un error = " + err.message);
    this.emit("end");
}

//Compilado de Sass/css
gulp.task('sass', function(){
    return gulp.src('./src/scss/**/*.scss')
           .pipe(plumber({errorHandler:onError}))
           .pipe(sourcemaps.init())
           .pipe(sass())
           .pipe(autoprefixer("last 2 versions"))
           .pipe(gulp.dest('./app/css'))
           .pipe(cleanCss({keepSpecialComments:1}))
           .pipe(sourcemaps.write("."))
           .pipe(gulp.dest('./app/css'))
           .pipe(livereload())
           .pipe(notify({message: "Tarea Sass finalizada"}))
});

//JsHint
gulp.task('jshint', function(){
    return gulp.src('./src/js/**/*.js')
           .pipe(jshint())
          
});


//Trtamiento de imagenes
gulp.task('imagemin', function(){
    return gulp.src('./src/img/**/*.*')
           .pipe(plumber({errorHandler:onError}))
           .pipe(imagemin({
               progresive:true,
               interlaced:true

           }))
           .pipe(gulp.dest('./app/img'))
           .pipe(livereload())
           .pipe(notify({message: "Tarea Imagenes finalizada"}))
          
});

//Minificado y concatenacion de JS
gulp.task('javascript', ['jshint'],function(){
    return gulp.src('./src/js/**/*.js')
           .pipe(plumber({errorHandler:onError}))
           .pipe(concat('all.min.js'))
           .pipe(uglify())
           .pipe(gulp.dest('./app/js'))
           .pipe(livereload())
           .pipe(notify({message: "Tarea Javascript finalizada"}))
});

//Tareas para observar y realizar tareas
gulp.task('watch', function(){
     livereload.listen();
     gulp.watch('./src/scss/**/*.scss', ['sass']);
     gulp.watch('./src/js/**/*.js', ['javascript']);
     gulp.watch('./src/**/*.html', ['html']);

});

//Copia y minifica htmls
gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
     .pipe(plumber({errorHandler:onError}))
      //.pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./app'))
      .pipe(livereload())
      .pipe(notify({message: "Tarea Html finalizada"}))
  });


//subir a FTP - produccion
gulp.task('ftp', function() {
   return gulp.src('./app/**')
         .pipe(plumber({errorHandler:onError}))
         .pipe(ftpdeploy({
               remotePath: '/public_html/proyectos/jacob/test',
               host: 'server133.web-hosting.com',
               port: 21,
               user: 'capcrqbw',
               pass: 'TRe5kFRwb8d!E'
               }))
         .pipe(gulp.dest('.'))
         .pipe(notify({message: "Subido ficheroFTP"}))
  });

//Tarea principal
gulp.task('default', ['watch','sass','javascript','html'],function(){
    
});