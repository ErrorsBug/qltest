/**
 *
 * @author Dylan
 * @date 2018/11/16
 */
module.exports = {
	plugins: [
		require("autoprefixer")({
			browsers: ['> 1%', 'Android >= 2.1', 'ios 7', 'firefox >= 15'],
		})
	]
};
