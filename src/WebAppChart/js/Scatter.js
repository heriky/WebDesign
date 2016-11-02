/**
 *  散点图组件
 */

;(function(win){
	function Scatter(opts){ // opts除了CompoBase带的参数，还应该有散点的数据[{name:, per:,bg:,pos:{left, top}}]
		
		opts.content =  genContent(opts);
		return $.CompoBase(opts) ;
	}
	
	// 基于ComponentBase，设置content值
	function genContent(opts){
		var data = opts.data ; 
		if (!data) {throw new Error('The field "data" is required!')} ;

		var content = []; // 需要加入的散点的dom内容
		var base = data[0].per ; 
		$.each(data, function(index, item){
			var percentage = item.per / base*100 + '%'; // 以第一个元素大小为1， 其他跟随第一元素缩放
			var dom = $('<div/>')
				.width(percentage)
				.height(percentage)
				.addClass('scatter-point') // 添加基本样式
				.css({
					 left: item.pos&&item.pos.left, 
					 top: item.pos&&item.pos.top,
					'background-color': item.bg
				})
				.append(
					$('<div/>').append(item.name).append('<br>').append(percentage)
						.css({'text-align':'center', color: 'white', 'line-height': opts.css.height * parseInt(percentage)/100/2+'px' })
					)
			
			content.push(dom);
		})

		return content;
	}


	win.Scatter = Scatter ;
})(window) ;