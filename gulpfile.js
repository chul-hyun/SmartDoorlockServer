const gulp    = require('gulp');
const exec    = require('child_process').exec;
const babel   = require('gulp-babel');
const clean   = require('gulp-clean');

const srcDir        = 'src';
const distDir       = 'dist';

const serverMainFile = `${distDir}/main.js`

gulp.task('server_start', ['build', 'server_stop'], function(cb){
    exec(`pm2 start ${serverMainFile}`, function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('server_stop', [], function(cb){
    exec('pm2 stop all', function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        cb();
    });
})

gulp.task('build_babel', ['clean'], function(){
    return gulp.src(`${srcDir}/**/*.js`)
		.pipe(babel({
			presets: ['es2015'],
            plugins: ["transform-async-to-generator", "transform-runtime"]
		}))
		.pipe(gulp.dest(distDir));
})

gulp.task('copy', ['clean'], function(){
    return gulp.src([`!./${srcDir}/**/*.js`, `./${srcDir}/**/*`], {base: `./${srcDir}`})
        .pipe(gulp.dest('./dist'));
})

gulp.task('clean', function () {
    return gulp.src(distDir, {read: false}).pipe(clean());
})

gulp.task('default', ['server_start']);

gulp.task('build', ['build_babel', 'copy'])

gulp.task('watch', ['default'], function(){
    gulp.watch(`${srcDir}/**/*`, ['default']);
})
