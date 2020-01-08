/**
 * Created by dylanssg on 2017/9/20.
 */
require('zepto');
var envi = require('envi');

return {
	init: function(){
		var $guideMask = $('.guide-mask');

		$('.bottom-panel').click(function(){
			var $this = $(this);
			if(envi.isWeixin()){
				setTimeout(function(){
					location.href = $this.data('url');
				},300);
			}else{
				$guideMask.show();
			}
		});

		$guideMask.click(function(){
			$guideMask.hide();
		});
	}
};