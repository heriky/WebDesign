/*水平柱状头*/

;(function(win){
	function Histogram(opts){
		opts.content = genContent(opts) ;
		return $.CompoBase(opts) ;
	}
	
	function genContent(opts){ // data格式[{name,per, bg}]
		if (!opts || opts.data==null) { throw new Error('the field data is required!')}  
		var data = opts.data ;
		var content = [] ;
		var defaultBg = data[0].bg;
		$.each(data, function(index, item){
			var percentage = item.per * 100 +'%' ;
			var dom = $('<div/>').addClass('histo-item')
							.append($('<span class="histo-item-name">').text(item.name))
							.append($('<span class="histo-item-progress">').width(percentage).css('color', item.bg||defaultBg))
							.append($('<span class="histo-item-per">').text(percentage).css({'left': percentage, 'margin-left': '1rem'}));

			content.push(dom);
		});
		return content;
	}

	win.Histogram = Histogram ;
})(window)