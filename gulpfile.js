var gulp = require('gulp'); //gulp自身  
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var paths = {
    scripts: [
        './kline/base.js',
        './kline/NamedObject.js',
        './kline/MEvent.js',
        './kline/CPoint.js',
        './kline/Expr.js',
        './kline/Range.js',
        './kline/Indicator.js',
        './kline/Plotter.js',
        './kline/CToolObject.js',
        './kline/CToolPlotter.js',
        './kline/DataSource.js',
        './kline/DataProvider.js',
        './kline/Theme.js',
        './kline/Timeline.js',
        './kline/Template.js',
        './kline/ChartSettings.js',
        './kline/ChartArea.js',
        './kline/Chart.js',
        './kline/ChartManager.js',
    ]
}

gulp.task('default', function() {
    return gulp.src(paths.scripts) //找到项目下paths变量所定义的script文件  
        // .pipe(uglify()) //压缩  
        .pipe(concat('kline.min.js')) //输入到all.min.js中  
        .pipe(gulp.dest('.'));
});