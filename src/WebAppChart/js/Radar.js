;(function(win){
	function Radar(opts){  // data: [{name:, per:, color:}]
		opts.content = genContent(opts) ;
		return $.CompoBase(opts) ;
	}


	function genContent(opts){
		if (!opts || !opts.data) {throw new Error('The field "data" is required!')}
		var data = opts.data ;
		var content = [] ;

		var canvas = document.createElement('canvas') ;
		canvas.className = 'radar-canvas' ;
		var w = canvas.width = opts.css.width ;
		var h = canvas.height = opts.css.height;
		var count = opts.data.length ;
		var r = Math.floor(w / 2) ;

		/*1 绘制背景*/
		// 背景
		var bgCanvas = canvas.cloneNode(true);
		content.push(bgCanvas) ;
		var ctx = bgCanvas.getContext('2d');
		var rad = 2 * Math.PI / count;

		for(var s=10; s>0; s--){
			var scale = s / 10 ;
			ctx.beginPath();
			for(var i=0; i< count; i++){
				var x = r * (1 + Math.sin(rad * i) * scale) ;
				var y = r * (1 + Math.cos(rad * i) * scale) ;
				ctx.lineTo(x, y)
			}
			ctx.closePath();
			ctx.fillStyle = s%2==0 ? '#b8ddfc' : 'rgba(255,118,118, .5)';
			ctx.fill()
		}
		// 鱼骨骨架
		ctx.beginPath();
		ctx.lineWidth = '.2'
		ctx.strokeStyle = '#666';
		for(var i=0; i< count; i++){
			var x = r * (1 + Math.sin(rad * i) ) ;
			var y = r * (1 + Math.cos(rad * i)) ;
			ctx.moveTo(r,r) ;
			ctx.lineTo(x, y)
			ctx.stroke() ;
		}
		// 绘制百分比
		ctx.font = '16px Georgia';
		ctx.fillStyle = 'red' ;
		for(var i=0; i< count; i++){
			var item = data[i] ;
			var x = r * (1 + Math.sin(rad * i) * item.per ) ;
			var y = r * (1 + Math.cos(rad * i) * item.per ) ;
			ctx.fillText(item.per*100+'%', x>r? x+5 : x-5,y>r? y+5: y-5) ;
		}

		/*2.绘制数据层*/
		content.push(canvas) ;
		ctx = canvas.getContext('2d');

		var drawLine = function(scale){
			ctx.clearRect(0, 0, w, h);
			ctx.beginPath();
			// // 数据点
			for(var i=0; i< count; i++){
				var item = data[i] ;
				var x = r * (1 + Math.sin(rad * i) * item.per* scale) ;
				var y = r * (1 + Math.cos(rad * i) * item.per* scale) ;
				ctx.moveTo(x, y);
				ctx.arc(x, y, 2, 0, 2* Math.PI);
			}
			ctx.fillStyle = 'red' ;
			ctx.fill();
			// 折线(需要展现动画)
			ctx.beginPath();
			for(var i=0; i< count; i++){
				var item = data[i] ;
				var x = r * (1 + Math.sin(rad * i) * item.per * scale) ;
				var y = r * (1 + Math.cos(rad * i) * item.per * scale) ;
				ctx.lineTo(x, y)
			}
			ctx.closePath();
			ctx.fillStyle = 'rgba(0,255,0,.5)';
			ctx.fill()
		}
		drawLine(0) ;

		/* 3 添加项目名称*/
		for(var i=0; i< count; i++){
			var item = data[i] ;
			var x = r * (1 + Math.sin(rad * i) ) ;
			var y = r * (1 + Math.cos(rad * i) ) ;
			var dom = $('<div class="radar-name"/>').text(item.name).css({position: 'absolute', color: item.color || '#333'}) ;
			x > r ? dom.css('left', x) : dom.css('right', w - x) ;
			y > r ? dom.css('top', y) : dom.css('bottom', h - y) ;
			content.push(dom) ;
		}

		/*4. 折线图生长，添加监听*/
		addAnimation(canvas, drawLine) ;

		return content;
	}
	/**
	 * 添加生长动画
	 * @param {[type]} mCanvas [description]
	 * @param {[type]} draw    [description]
	 */
	function addAnimation(mCanvas, draw){
		$(mCanvas).on('canvasAnimStart', function(){
			console.log('canvas伸展动画!');
			var scale = 0 ;
			for(var i=0;i <100 ;i++){
				setTimeout(function(){
					scale += 0.01;
					draw(scale) ;
				}, i*10+500) ; // 生成100个延时，变成类似setInterval的形式. +500是为了让网格先加载，再做动画
			}

			return false; // 防止页面冒泡，传播到父元素，父元素又向下发出事件，形成死循环。
		})

		$(mCanvas).on('canvasAnimEnd', function(){
			console.log('canvas收缩动画!');
			var scale = 1 ;
			for(var i=0;i <100 ;i++){
				setTimeout(function(){
					scale -= 0.01;
					draw(scale) ;
				}, i*10) ; // 生成100个延时，变成类似setInterval的形式. +500是为了让网格先加载，再做动画
			}
			return false; // 防止页面冒泡，传播到父元素，父元素又向下发出事件，形成死循环。
		})
	}

	win.Radar = Radar ;
})(window)