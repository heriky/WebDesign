;(function(win){

	function LineChart(opts){ // data:[{name: , per:,color}] color是数字的颜色
		opts.content = genContent(opts) ;
		return $.CompoBase(opts) ;
	}

	function genContent(opts){
		if (!opts || !opts.data) {throw new Error('The field "data" is required!')}
		var data = opts.data ;
		var content = [] ;

		// 添加canvas
		var mCanvas = document.createElement('canvas') ;
		mCanvas.className = 'linechar-canvas';
		// canvas大小和绘图值接受具体数值，不接受百分比和字符串, 如果传入小数，则小数位直接去舍去。
		var width = mCanvas.width = opts.css.width ;
		var height = mCanvas.height = opts.css.height ;

		// 为了防止canvas边界上处的内容被裁掉， 让图标的起始点重新计算，向内部各缩减10px
		var w = width - 10 * 2,
				h = height - 10 * 2;
		var startX = 10 ,
				endX   = width - 10 ,
				startY = 10,
				endY   = height - 10 ;
		var count = opts.data.length;

		/* 1. 添加一个背景层的canvas，先绘制背景层，背景层不参与动画*/
		var bgCanvas = mCanvas.cloneNode(true) ;
		content.push(bgCanvas);
		var ctx = bgCanvas.getContext('2d') ;
		ctx.beginPath() ;
			ctx.strokeStyle = '#333' ;
			ctx.lineWidth = 1;

			// 画水平线。水平分为10份
			for(var i=0, step=h/10; i<11; i++){
				var y = step * i + 10;
				ctx.moveTo(startX, y) ;
				ctx.lineTo(endX, y) ;
			}

			// 画垂直线。垂直按项目条目数, 加入有3个项目，则需要画5条线
			for(var i=0, step=w/(count+1);i < count+2; i++){
				var x = step * i +10 ;
				ctx.moveTo(x, startY) ;
				ctx.lineTo(x, endY) ;
			}
			ctx.stroke() ;
			ctx.closePath() ;

		/*2.添加一个数据层的canvas， 数据层的canvas需要参与动画，不停的重绘*/
		ctx = mCanvas.getContext('2d');
		content.push(mCanvas);
		var draw =  function(scale){
			// 要做canvas动画，则必须每次都清空画布
			ctx.clearRect(0, 0, width, height) ;
			ctx.beginPath();
			// 数据点,画圆形。
			ctx.fillStyle = 'red' ;
			for(var i=1,step=w/(count+1); i<= count; i++){
				var x = step * i + 10;
				var y = h * (1- opts.data[i-1].per*scale) + 10;
				ctx.moveTo(x, y);
				ctx.arc(x, y, 5, 0, 2*Math.PI) ;
			}
			ctx.fill();
			ctx.closePath();

			// 用折线连接数据点
			ctx.beginPath();
			ctx.strokeStyle = 'blue' ;
			for(var i=1,step=w/(count+1); i<= count; i++){
				var x = step * i + 10;
				var y = h * (1-opts.data[i-1].per*scale) + 10;
				ctx.lineTo(x, y);
			}
			ctx.stroke() ;

			// 绘制折线下面的阴影
			ctx.lineTo(x, endY) ;
			ctx.lineTo(step + 10, endY) ;
			ctx.fillStyle = 'rgba(255,118,118, .5)'
			ctx.fill() ;
			ctx.closePath() ;

			// 写数据点的文字
			ctx.font = '1rem Georgia,Microsoft YaHei' ;
			for(var i=1,step=w/(count+1); i<= count; i++){
				var item = opts.data[i-1] ;
				var x = step * i + 10;
				var y = h * (1-item.per*scale) + 10;
				ctx.fillStyle = item.color || '#333' ;
				ctx.fillText((item.per * 100)+'%',x+10, y);

			}
		}

		/*3. 进行初始化状态设置， 开启动画监听*/
		draw(0);
		addAnimation(mCanvas, draw) ;

		/* 4. 为折线图添加项目文字，使用html实现*/
		for(var i=1,step=w/(count+1); i<= count; i++){
			var item = opts.data[i-1] ;
			var x = step * i + 10;
			var dom = $('<div class="linechart-name"/>').text(item.name).css({width: step, left: x-step/2});
			content.push(dom) ;
		}

		return  content;
	}

	/**
	 * 为绘制数据点添加动画效果
	 * @param {canvas} mCanvas 用于绘制的画布对象
	 * @param {function} draw    执行绘制的函数
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

	win.LineChart = LineChart ;

})(window)