const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');

const babelConfig = {
	"presets": [
		["@babel/env", {"modules": "commonjs"}],
		"@babel/react"
	],
	"sourceType": "unambiguous",
	"plugins": [
		// Stage 0
		"@babel/plugin-proposal-function-bind",

		// Stage 1
		"@babel/plugin-proposal-export-default-from",
		//        "@babel/plugin-proposal-logical-assignment-operators",
		["@babel/plugin-proposal-optional-chaining", { "loose": false }],
		//        ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
		//        ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
		"@babel/plugin-proposal-do-expressions",

		// Stage 2
		["@babel/plugin-proposal-decorators", { "legacy": true }],
		//        "@babel/plugin-proposal-function-sent",
		// "@babel/plugin-proposal-export-namespace-from",
		"@babel/plugin-proposal-numeric-separator",
		//        "@babel/plugin-proposal-throw-expressions",

		// Stage 3
		// "@babel/plugin-syntax-dynamic-import",
		// "@babel/plugin-syntax-import-meta",
		["@babel/plugin-proposal-class-properties", { "loose": false }],
		//        "@babel/plugin-proposal-json-strings",

		["import", {
			"libraryName": "lodash",
			"libraryDirectory": "",
			"camel2DashComponentName": false  // default: true
		}]
	]
};

const tsProject = ts.createProject('tsconfig.json', {
	jsx: "react",
	sourceMap: false
});

function cpfile(){
	return gulp.src('./{site/**,server/**,./.babelrc,./.npmrc,./package.json}')
		.pipe(gulp.dest('./dest/'));
}

function js_client_build(){
	return gulp.src(['./dest/site/wechat-react/**/*.js', './dest/site/wechat-react/**/*.jsx'])
		.pipe(babel(babelConfig))
		.pipe(gulp.dest('./dest/site/wechat-react/'));
}

function js_client_ts_build(){
	return gulp.src(['./dest/site/wechat-react/**/*.ts', './dest/site/wechat-react/**/*.tsx'])
		.pipe(tsProject({
			transpileOnly: true
		}))
		.pipe(gulp.dest('./dest/site/wechat-react/'));
}

function js_server_build(){
	return gulp.src('./dest/server/**/*.js')
		.pipe(babel(Object.assign(babelConfig, {ignore: [".css", ".png"]})))
		.pipe(gulp.dest('./dest/server/'));
}

const build = gulp.series(cpfile, gulp.parallel(js_client_build, js_client_ts_build, js_server_build));

gulp.task('default', build);
