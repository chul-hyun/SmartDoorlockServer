const gulp = require('gulp');
const exec = require('child_process').exec;

gulp.task('serverRestart', function(cb){
    exec('pm2 restart all', function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('watch', ['serverRestart'], function(){
    gulp.watch('./**/*.js', ['serverRestart']);
});
