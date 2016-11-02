;(function(win){
	function HistogramV(opts){
		opts.content = genContent(opts) ;
		return $.CompoBase(opts) ;
	}

	function genContent(opts){// data:[{name:, per, bg}]
		if (!opts || !opts.data) {throw new Error('The field "data" is required!')}

		var data = opts.data ;
		var content = [] ;
		
		var width = 1 / data.length * 100 + '%' ; // 依据数据个数计算应该有的宽度
		var defaultBg = data[0].bg ;
		$.each(data, function(index, item){
			var percentage = item.per * 100 +'%' ;
			var dom = $('<div/>').addClass('histo_v-item').width(width)
					.append($('<div class="histo_v-item-per"/>').text(percentage).css('bottom',percentage))
					.append($('<div class="histo_v-item-progress"/>').height(percentage).css('color', item.bg || defaultBg))
					.append($('<div class="histo_v-item-name">').text(item.name))
			;

			content.push(dom)
		})

		return content ;
	}

	win.HistogramV = HistogramV ;

})(window)