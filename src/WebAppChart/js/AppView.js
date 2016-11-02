// 资源预加载和管理

;(function($){
	function AppView(opts){
		this.$container = $('<div/>',{id: 'fullpage'});
		this.pages = [] ; // 记录所有添加进来的页面
		this.resources = (opts&&opts.resources) || [];

		AppView.prototype._init.call(this) ;

	}
	AppView.prototype = {
		_init: function(){
			// 添加进度条
			var loading = $('<div class="loading" id="loading">')
			var outer = $('<div class="loading-outer">') ;
			var inner = $('<div class="loading-inner">') ;
			var per = $('<div id="loading-text" class="loading-text">') ;
			loading.append(outer).append(inner).append(per) ;
			$('body').append(loading) ;
		},

		addPage: function(name, text){
			var sec = $('<div/>') ;

			sec.addClass('section') ;
			sec.addClass('page-'+name) ; // 用于区分并自定义样式
			sec.text(text) ;  // 测试用
			this.$container.append(sec) ;

			this.pages.push(sec) ;

			return this; // 用于链式调用
		},

		addComponent: function(opts){ // 可以直接添加一个组件类型，也可以添加一个选项用于生成新的组件
			var sec = this.pages[this.pages.length-1]; // 取出当前最后一个页面, 联调addComponent

			// 正确的做法应该是利用switch来判断类型
			var compo = opts instanceof jQuery ? opts : $.CompoBase(opts) ; // 调用构造生成新的组件还是直接添加现有组件？
			sec.append(compo) ;

			return this;

		},

		// 资源记载完成后，进行页面初始化
		loaded: function(){
			// 隐藏进度条,将容器的根加入页面，并且设置页面全屏滚动
			$('#loading').hide();
			this.$container.appendTo($('body')) ; // 组件根
			this.$container.fullpage({
				onLeave: function(index, nextIndex, direction){
					var $sec = $(this) ;
					$('.compo-base', $sec).trigger('pageLeave') ;
				},
				afterLoad: function(anchorLink, index){
					var $sec = $(this) ;
					$('.compo-base', $sec).trigger('pageLoad') ;
				},
			})

			this.$container.show();
		},

		// 资源预加载,目前只是图片资源. 预加载完成之后进行页面初始化
		loader: function(){
			var self = this;
			var total = this.resources && this.resources.length ;
			if (!total || total == 0) { // 无资源时，直接返回加载完成
				this.loaded();
				return ;
			}
			var loadedCount = 0 ;
			var percentageDom = $('#loading-text');

			this.resources.forEach(function(item, index){
				var img = new Image() ;
				img.onload = function(){
					img.onload = null ;
					loadedCount += 1 ;
					var progress = ~~((loadedCount / total) * 100) + '%' ;
					console.log(progress)
					percentageDom.text(progress);
					if (loadedCount == total) {
						self.loaded() ;
					}
				}
				img.src = item;
			})

		}
	}

	// 加入jQuery全局
	$.extend({
		AppView: function(opts){
			return new AppView(opts) ;
		}
	})

})(jQuery)