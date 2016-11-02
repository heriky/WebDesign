;(function(win){

	function PieChart(opts){ // data:[{name: , per:,color}] color是数字的颜色
		opts.content = genContent(opts) ;
		return $.CompoBase(opts) ;
	}

	function genContent(opts){
		if (!opts || !opts.data) {throw new Error('The field "data" is required!')}
		var data = opts.data ;
		var content = [] ;

		var canvas = document.createElement('canvas') ;
		canvas.className = 'piechart-canvas' ;
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
		ctx.arc(r, r, r, 0, 2 * Math.PI);
		ctx.fillStyle = '#eee';
		ctx.fill();

		/* 2绘制数据层*/
		var colors = ['cyan', 'red', 'blue', 'rgb(0,255,0)', '#f60']
		var startAngle = 0 ,
				endAngle = 2 * Math.PI;
		for(var i=0; i< count; i++){
			var item = data[i];
			var deltaAngle = 2*Math.PI * item.per ; // 统计当前项目所占用的角度
			endAngle = startAngle + deltaAngle ;
			// 添加饼图分割
			ctx.beginPath() ;
			ctx.moveTo(r,r) ;
			ctx.arc(r, r, r, startAngle, endAngle) ;
			ctx.fillStyle = colors.pop();
			ctx.closePath();
			ctx.fill() ;
			// 添加分割百分比
			var x = r * (1 + Math.cos((startAngle + endAngle)/2)*.5);
			var y = r * (1 + Math.sin((startAngle + endAngle)/2)*.5) ;
			ctx.font = '16px Georgia' ;
			ctx.fillStyle = 'white' ;
			ctx.fillText(item.per * 100 +'%', x, y);

			startAngle = endAngle ;
		}

		/*3. 添加项目名称，使用html绝对定位*/
		startAngle = 0 ;  //  这里要注意，必须重置！！
		endAngle = 2 * Math.PI ;
		for(var i=0; i< count; i++){
			var item = data[i];
			var deltaAngle = 2*Math.PI * item.per ; // 统计当前项目所占用的角度
			endAngle = startAngle + deltaAngle ;
			var x = r * (1 + Math.cos((startAngle + endAngle)/2));
			var y = r * (1 + Math.sin((startAngle + endAngle)/2)) ;
			startAngle = endAngle ;

			var dom =$('<div class="piechart-name"/>').text(item.name) ;
			x > r ? dom.css('left', x) : dom.css('right', w - x);
			y > r ? dom.css('top', y) : dom.css('bottom', h-y) ;
			content.push(dom)
		}

		/* 4 添加遮罩层，以伪造饼图生长动画 . 因为对原图不好做动画*/
		var shadeCanvas = canvas.cloneNode(true) ;
		content.push(shadeCanvas)
		ctx = shadeCanvas.getContext('2d') ;

		var draw = function(scale,notClock){
			ctx.clearRect(0, 0, w, h)
			ctx.beginPath()
			ctx.moveTo(r, r)
			ctx.arc(r, r, r+1, 2 * Math.PI, 2* Math.PI* scale, true); // +1px是因为边界有的部分没有覆盖住。
			ctx.fillStyle = '#eee';
			ctx.closePath()
			ctx.fill();
		}
		draw(0) ;
		// /* 5 添加动画监听, 饼图生长动画*/
		addAnimation(shadeCanvas, draw) ;

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

	win.PieChart = PieChart ;
})(window) ;