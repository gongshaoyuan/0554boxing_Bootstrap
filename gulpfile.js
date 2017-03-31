
// 这里的代码完全是node代码

var gulp = require('gulp');

// 自动加前缀的一个NODE包
var autoprefixer = require('gulp-autoprefixer');

// 合并JS用的
var concat = require('gulp-concat');

// 压缩图片
var imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		cache = require('gulp-cache');

// 压缩html
var htmlmin = require('gulp-htmlmin');

// 压缩css
var cssmin = require('gulp-clean-css');

// 改名字（利用文件内容生成的hash名）
var rev = require('gulp-rev');

// 替换引用路径
var revCollector = require('gulp-rev-collector');

// 压缩js代码
var uglify = require('gulp-uglify');


// 添加浏览器兼容前缀
gulp.task('testAutoFx', function () {
	gulp.src('./css/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'Android >= 4.0'],
			cascade: true, //是否美化属性值 默认：true 像这样：
			//-webkit-transform: rotate(45deg);
			//        transform: rotate(45deg);
			remove:true //是否去掉不必要的前缀 默认：true
		}))
		.pipe(gulp.dest('./dist'));
});



// 处理CSS
gulp.task('css', function () {
	// 获取需要构建的资源
	gulp.src('./css/*.css', {base: './'})
		// 通过管道的方式传递给了autoprefixer包
		.pipe(autoprefixer())
		// 把处理结果通过管道传递给了gulp.dest()
		.pipe(gulp.dest('./dist'));
});


// gulp.task()，配置我们的具体任务，需要的参数有任务名称，还需要一个回调方法
// gulp.src() 获取需要构建资源的路径，传递的参数必须得是一个路径
// gulp.dest() 放置我们构建好的资源的路径，传递的参数也是一个路径
// pipe 起到一个"承前启后"作用，上一次的处理结果，当做下一次参数传递



// 处理JS的任务
gulp.task('js', function() {
	return gulp.src('./js/*.js', {base: './'})
		.pipe(concat('./js/all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

// 压缩图片
//gulp.task('image', function () {
//	return gulp.src('./img/*', {base: './'})
//		.pipe(imagemin())
//		.pipe(gulp.dest('./dist'));
//});

// 压缩图片
gulp.task('testImagemin', function () {
	gulp.src('./img/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('./dist'));
});


// 压缩html
gulp.task('html', function () {
	return gulp.src('./*.html')
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('./dist'));
});

// 压缩css
gulp.task('testCssmin', function () {
	gulp.src('./css/*.css')
		.pipe(cssmin({
			advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepBreaks: true //类型：Boolean 默认：false [是否保留换行]
		}))
		.pipe(gulp.dest('./dist'));
});

// 生成hash文件名
gulp.task('rev',['css', 'js', 'image', 'html'], function () {
	// global语法
	return gulp.src(['./dist/**/*', '!**/*.html'], {base: './dist'})
		// 新的文件名
		.pipe(rev())
		// 存到dist
		.pipe(gulp.dest('./dist'))
		// 收集原文件名与新文件名的关系
		.pipe(rev.manifest())
		// 以json形式存入./rev目录下
		.pipe(gulp.dest('./rev'));
});

// 替换文件路径
gulp.task('revCollector',['rev'], function () {
	// 根据生成的json文件，去替换html里的路径
	return gulp.src(['./rev/*.json', './dist/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['revCollector']);
