var gulp = require('gulp'),
    gutil=require('gulp-util'),
    uglify=require('gulp-uglify'),
    concat=require('gulp-concat'),
    rjs = require('gulp-requirejs');

//const changed = require('gulp-changed');

var path = require('path'),
    pathmodify = require('pathmodify');

var amdOptimize = require("amd-optimize");
var through = require('through2');

//设置打包缓存
var cache = require('gulp-cache');
var runSequence = require('run-sequence');

var browserify = require('browserify');
var proxyMiddleware = require('http-proxy-middleware');
var source = require("vinyl-source-stream");
var htmlmin = require('gulp-htmlmin');

var imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');
var smushit = require('gulp-smushit');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var sass = require('gulp-sass'),	
	//压缩css
	cssmin = require('gulp-clean-css'),
	//修改css url
	modifyCssUrls = require('gulp-modify-css-urls'),
	autoprefixer = require('gulp-autoprefixer');

var html = require('html-browserify'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
	cachebust = require('gulp-cachebust');

var browcss = require('browserify-css');
///合并任务
var merge = require('merge-stream');
//获取命令参数
var argv = require('yargs').argv;
//清除
var clean = require('gulp-clean');


//可以多级目录
var version = '';
///在有版本号时，当前的目录嵌套层次
var versionc = "";
for(var i = 0;i<version.split('/').length-1;i++){
	versionc += "../";
};

///输出目录
//var outpath = 'dist_/';

//var outpath = '//192.168.12.132/w1/waibao_dev/pub_wb/home/';

//生产环境为true，开发环境为false，默认为true
var evr = argv.p || !argv.d;
var bv = argv.bv || 1;

var SRC = bv==1? 'src': ('src'+bv);
var port = bv==1? 5500: 6600;
var outpath = bv==1? 'E:/works/git/GOP-GMD/pub_wb/home/': 'dist_/';
//var outpath = 'E:/works/git/GOP-GMD/pub_wb/home/';

/*var proxyTarget = {
	local: 'http://localhost:4000/',
	product: 'http://common.dev.ztgame.com:9280/'
}

var target = evr? proxyTarget.product: proxyTarget.local;*/


var htmls = [SRC +'/*.html', SRC +'/controller/**/*.html'];
var htmlspath = [
	['./'+ SRC +'/', outpath],
	['./'+ SRC +'/controller/**/', outpath + "controller/"]
];
//var revhtmlspath = [outpath, outpath + 'm/'];

var csss = [
	SRC +'/style/*.scss'
];
var cssspath = [
	['./'+ SRC +'/style/', outpath + 'style/'+version]
];

var jss = [SRC +'/*.js', SRC +'/js/*.js', SRC +"/controller/**/*.js"];
var jsspaht = [
	['./'+ SRC +'/', outpath + '' +version],
	['./'+ SRC +'/js/', outpath + 'js/' +version],
	['./'+ SRC +'/controller/**/', outpath + 'controller/']
];
var images = [
		SRC +'/images/**'
	];
var imagespath = [ 
		['./'+ SRC +'/images/', outpath + 'images/'+version],
		['./'+ SRC +'/images/**/', outpath + 'images/'],
	];



//模块打包
/*gulp.task("modulepack", function(){
	var tasks = jsspaht.map(function(element){
		return browserify({
	        entries : [element[0]+version+'index.js'],
	        insertGlobals: true,
	        transform: [html]
	    })
	    .transform(require('browserify-css'), {global: true})
	    .transform(require('imgurify'))
	    .plugin(pathmodify, {mods: [
	        // pathmodify.mod.dir('gwfjs', path.resolve(__dirname, './'+ SRC +'/'))
	    ]})
	    .bundle()
	    .pipe(source("all.js"))
	    .pipe(gulp.dest(element[1]+version))
	    .pipe(reload({stream: true}));
	});
    return merge(tasks);
});*/
gulp.task("modulepack", function(){
	var filen = "";
	var tasks = jsspaht.map(function(element){
		return gulp.src(element[0] + '*.js')
				.pipe(through.obj(function(file,enc,cb){
					filen = "";
		            //判断是否带有路径\
		            var ns = (file.relative).split("\\");
		            if(ns.length >= 2){
		            	filen = ns[0]+ "/";
		            }
		            cb(null, file);
		        }))
        		//.pipe(concat('index.js'))
        		.pipe(uglify({
        			ie8: true
        		}))
        		.pipe(gulp.dest( element[1] + filen ))
        		.pipe(reload({stream: true}));
    });
    return merge(tasks);
});
// 静态服务器
gulp.task('server', function() {
	// 代理配置, 实现环境切换
	var middleware = proxyMiddleware(['/api', '/login' , '/user', '/project', '/order' , '/upload', '/bid', '/work', '/files'], {target:"http://gop.dev.ztgame.com/", changeOrigin: true});
    browserSync.init({
        server: {
            baseDir: outpath,
            index: "index.html",
            middleware: middleware
        },
        port: port
    });
});
// 代理
gulp.task('browser-sync', function() {
    browserSync.init({

    });
});
// html压缩
gulp.task('htmlmin', function () {
    var options = {
        removeComments: false,//清除HTML注释
        //collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    var tasks = htmlspath.map(function(element){
    	var filen = "";
		return gulp.src(element[0] + '*.html')
			.pipe(through.obj(function(file,enc,cb){
				filen = "";
	            //判断是否带有路径\
	            var ns = (file.relative).split("\\");
	            if(ns.length >= 2){
	            	filen = ns[0]+ "/";
	            }
	            cb(null, file);
	        }))
	        .pipe(htmlmin(options))
	        /*.pipe(revCollector({
		            replaceReved: true,
		            dirReplacements: {
		                'css/': versionc + 'css/' + version,
		                'js/':  versionc + 'js/' + version,
		                'images/':  versionc + 'images/' + version
		            }
		        })
			)*/
	        .pipe(gulp.dest( element[1] + filen ))
	        .pipe(reload({stream: true}));
	});
    return merge(tasks);
});

//Html更换css、js、img文件版本
gulp.task('revHtml', function () {
	//var tasks = revhtmlspath.map(function(element){
		return gulp.src(['rev/**/*.json', outpath+'*.html'])
        .pipe(revCollector({
        	replaceReved: true,
            dirReplacements: {
                'css/': 'css/' + version,
                'js/':  'js/' + version,
                'images/':  'images/' + version
            }
        }))        
        .pipe(gulp.dest(outpath));
	//})
	//return merge(tasks);
});


//图片压缩
gulp.task('imagemin', function () {
	var tasks = imagespath.map(function(element){
		var filen = "";
		//return gulp.src(element[0]+'*.{png,jpg,gif,ico}')
		return gulp.src( element[0] + '*.{png,jpg,gif}' )
			.pipe(through.obj(function(file,enc,cb){
				filen = "";
	            //判断是否带有路径\
	            var ns = (file.relative).split("\\");
	            if(ns.length >= 2){
	            	filen = ns[0]+ "/";
	            }
	            cb(null, file);
	        }))
	        .pipe(cache(imagemin({
	        	//类型：Number  默认：3  取值范围：0-7（优化等级）
	        	optimizationLevel: 3, 
	        	//类型：Boolean 默认：false 无损压缩jpg图片
	            progressive: true, 
	            //类型：Boolean 默认：false 隔行扫描gif进行渲染
	            interlaced: false, 
	            //类型：Boolean 默认：false 多次优化svg直到完全优化
	            multipass: false,
	            //深度压缩模式
            	use: [pngquant({quality: 70})]
	        })))
	        /*.pipe(cache(smushit({
	            verbose: true
	        })))*/
	        .pipe(gulp.dest(element[1] + filen))
	        .pipe(reload({stream: true}));
	        
	});
    return merge(tasks);
});
//sass编译
gulp.task('sass', function () {
	var tasks = cssspath.map(function(element){
		return gulp.src(element[0]+'*.scss')
		    .pipe(sass().on('error', sass.logError))
		    .pipe(autoprefixer({
	            browsers: ['last 2 versions', 'Android >= 4.0'],
	            cascade: true
	        }))
	        //给css文件里引用文件加版本号（文件MD5）
	        .pipe(modifyCssUrls({
	        	modify: function (url, filePath) {
	        		if((url.indexOf('//') != -1) || (url.indexOf('images/') == -1)) return url;
	        		let urls = url.split('images/');
	        		return (versionc + urls[0] + 'images/' + version + urls[1] + '?' + (new Date()).getTime());
	        	}
	        })) 
	        .pipe(cssmin({
	        	//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
	        	advanced: false,
	        	//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
	            compatibility: 'ie8',
	            //类型：Boolean 默认：false [是否保留换行]
	            keepBreaks: false,
	            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
	            keepSpecialComments: '*'
	            
	        }))
		    .pipe(gulp.dest(element[1]))
		    .pipe(reload({stream: true}));
	});
    return merge(tasks);
});

gulp.task('copy', function(){
	return gulp.src('./'+ SRC +'/assets/**')
		.pipe(gulp.dest(outpath + 'assets/'));
});

//清空输出目录
gulp.task('clean', function(){
	return gulp.src( outpath, {read: false})
		.pipe(clean());
});
//清理图片缓存
gulp.task('clear', function(done){
	return cache.clearAll(done);
});



gulp.watch(htmls, ['htmlmin']);
gulp.watch(csss, ['sass']);
gulp.watch(jss, ['modulepack']);
gulp.watch(images, ['imagemin']);



gulp.task('compile',['modulepack','sass']);
//开发构建
gulp.task('dev', function (done) {   
    condition = false;   
    runSequence(        
       //['clean'],        
       ['clear'],     
       ['copy'],     
       ['compile'],
       ['imagemin'],
       ['htmlmin'],
       //['revHtml'],        
       ['server'],
       
       done);
});
gulp.task('default',['dev']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
