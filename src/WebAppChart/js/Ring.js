;(function(win){
	function Ring(opts){
		opts.content = genContent(opts);
		return $.CompoBase(opts)
	}

	function genContent(opts){ //data: {name:, per:, color}
		if (!opts || !opts.data) {throw new Error('The field "data" is required!')}
		var data    = opts.data ;
		var content = [] ;

		var canvas = document.createElement('canvas')
		canvas.className = 'ring-canvas';
		var w     = canvas.width = opts.css.width;
		var h     = canvas.height = opts.css.height;
		var r = w / 2,
				bgR = r - 50;

		/*1. 绘制背景层(中心圆)和文字*/
		var bgCanvas = canvas.cloneNode(true);
		content.push(bgCanvas);
		var ctx = bgCanvas.getContext('2d');
		ctx.arc(r, r, bgR, 0, 2*Math.PI)
		ctx.fillStyle = '#40ffff'
		ctx.fill()

		/*2 .绘制外部环形*/
		content.push(canvas) ;
		ctx = canvas.getContext('2d') ;
		var percentage = 2*Math.PI *data.per;
		var draw = function(scale){
			ctx.clearRect(0, 0, w, h) ;
			ctx.beginPath() ;
			ctx.moveTo(r, r) ;
			ctx.arc(r, r, bgR, 0, percentage* scale);
			ctx.arc(r, r, r,  percentage* scale, 0, true) ;
			ctx.closePath();
			ctx.fillStyle = 'red';
			ctx.fill();
		}
		draw(0) ;

		/*3.添加文字*/
		var dom1 = $('<div class="ring-name"/>').text(data.name) ;
		var dom2 = $('<div class="ring-per"/>').text(data.per * 100 +'%') ;
		content.push(dom1, dom2);

		/* 4. 添加动画监听*/
		addAnimation(canvas, draw) ;

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
			draw(0);
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
	win.Ring = Ring ;
}(window))