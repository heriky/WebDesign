;(function($){
	function ComponentBase(opts){
		this.opts = Object.assign({},ComponentBase.DEFAULT, opts) ;
		this.$dom = $('<div>').attr({type: this.opts.type, id: this.opts.id, name: this.opts.name});
		this.$dom.addClass('compo-base') ;

		ComponentBase.prototype._init.call(this, this.opts);
		
	}

	// 默认配置项
	ComponentBase.DEFAULT = {
		content: '',
		type: 'base',
		id: Math.random().toString(36).slice(2) ,
		name: 'default_name',
		css: {} ,
		hCenter: true,

		onLeave: function(){}, // 钩子
		onLoad: function(){} ,
		anim: {in:{}, out:{}} ,// 动画参数,使用in和out定义进入和离开的样式
	} ;

	// 原型函数
	ComponentBase.prototype = {
		_init: function(opts){
			// 设置样式
			this.$dom.css(this.opts.css);

			opts.hCenter && this.$dom.css({position:'absolute',left: '50%', transform: 'translate(-50%)'}) // 确定水平居中

			// 设置钩子 onLeave和onLoad
			this.$dom.on('pageLeave', function(data){
				$(this).animate(opts.anim.out) ; // 定义出场动画
				
				$(this).hasClass('compo-load') && $(this).removeClass('compo-load') ; // 定义内部动画
				$(this).addClass('compo-leave') ;

				opts.onLeave && opts.onLeave.call(this, data) ; // 这里的this指的是dom元素本身
			});

			this.$dom.on('pageLoad', function(data){
				$(this).animate(opts.anim.in) ; // 定义入场动画
				
				$(this).hasClass('compo-leave') && $(this).removeClass('compo-leave') ; // 定义内部动画
				$(this).addClass('compo-load') ;

				opts.onLoad && opts.onLoad.call(this, data) ;
			})
			
			opts.content && this.$dom.append(opts.content)

		},

		
	} ;

	// 扩展全局方法
	window.ComponentBase = ComponentBase;
	$.extend({
		CompoBase: function(opts){
			return new ComponentBase(opts).$dom;
		}
	})

})(jQuery)