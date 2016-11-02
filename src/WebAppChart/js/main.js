$(function(){
	// opts中可以添加resources选项, 加入预加载资源的路径
	var app = $.AppView({
		resources:[
		'http://dl.bizhi.sogou.com/images/2012/03/06/110699.jpg',
		'http://photo.enterdesk.com/2011-10-9/enterdesk.com-C6428011227B5F1B607BCC755959C041.jpg',
		'http://photo.enterdesk.com/2007-8-23/200708231630016301.jpg',
		'http://dl.bizhi.sogou.com/images/2012/03/31/167942.jpg']
	}) ;
	app
		.addPage('face', '首页')
			.addComponent({
				css:{
					position: 'absolute',
					bottom:0,
					width: 300,
					opacity: 0,
				}, // 基础样式
				anim:{in:{bottom:78, opacity: 1}, out:{bottom: 0, opacity: 0}}, // 定义元素的出入动画
				onLoad: function(){
					console.log(this, 'onLoad事件触发了');
				},
				content: $('<img/>',{src:'./imgs/p2-people.png'}).css({display:'block', margin: 'auto', height: '100%',width:'100%'})
			})
		.addPage('second', '第二页')
			.addComponent(Scatter({
				type: 'scatter',
				name: '散点图',
				css:{width: 200, height: 200},
				data:[
					{name: 'A类型', per: .4, bg: 'red'},
					{name: 'B类型', per: .2, bg: 'green',pos:{top: '100%', left: '50%'}},
					{name: 'C类型', per: .2, bg: 'blue', pos:{top:'160%'}}]
			}))
		.addPage('third', '第三页')
			.addComponent(Histogram({
				type: 'histo',
				name: '柱形图（水平）',
				css:{width: '50%', top: '3rem', opacity: 0},
				anim:{in:{top: '3rem',opacity:1}, out:{top: '10rem', opacity: 0}},
				data: [
					{name:'JavaScript', per: 1,   bg: '#ff7676'},
					{name:'HTML/CSS',   per: .2,  bg: '#ff7676'},
					{name:'CSS3',       per: .1,  bg: '#ff7676'},
					{name:'HTML5',      per: .2,  bg: '#ff7676'},
					{name:'jQuery',     per: .35, bg: '#ff7676'},
					{name:'BootStrap',  per: .05, bg: '#ff7676'},
					{name:'AngularJs',  per: .09, bg: '#ff7676'},
				]
			}))
		.addPage('fourth', '第四页')
			.addComponent(HistogramV({
				type:'histo_v',
				name: '柱形图(垂直)',
				css:{width: '80%',height: '80%', bottom: '0', opacity: 0},
				anim:{in: {bottom: '5rem', opacity: 1}, out: {bottom: 0, opacity: 0}},
				data:[
					{name: 'JS',     per: 1, bg: '#ff7676'},
					{name: 'CSS3',   per: .2, bg: '#ff7676'},
					{name: 'HTML5',  per: .4, bg: '#ff7676'},
					{name: 'PHP',    per: .05, bg: '#ff7676'},
					{name: 'jQuery', per: .6, bg: '#ff7676'},
				]
			}))
		.addPage('fifth', '第五页')
			.addComponent(LineChart({
				type: 'line-chart',
				name: '折线图',
				css: {width: 400, height: 300, bottom: 0, opacity: 0},
				data: [
					{name: 'JS',     per: 1, color: '#ff7676'},
					{name: 'CSS3',   per: .2, color: '#ff7676'},
					{name: 'HTML5',  per: .4, color: '#ff7676'},
					{name: 'PHP',    per: .05, color: '#ff7676'},
					{name: 'jQuery', per: .6, color: '#ff7676'},
				],
				anim: {in:{opacity: 1, bottom: '30%'}, out:{opacity: 0, bottom: 0}}
				,
				onLoad: function(){
					$('canvas', this).trigger('canvasAnimStart') ; // 通知canvas做动画
				},
				onLeave: function(){
					$('canvas', this).trigger('canvasAnimEnd') ; // 通知canvas做动画
				}
			}))
		.addPage('radar','雷达图')
			.addComponent(Radar({
				typ: 'radar',
				name: '雷达',
				css:{ width: 400, height: 400, opacity: 0, bottom: 0},
				data: [
					{name: 'JS',     per: 1, color: '#ff7676'},
					{name: 'CSS3',   per: .2, color: '#ff7676'},
					{name: 'HTML5',  per: .4, color: '#ff7676'},
					{name: 'PHP',    per: .05, color: '#ff7676'},
					{name: 'jQuery', per: .6, color: '#ff7676'},
				],
				anim: {in:{opacity: 1, bottom: '10%'}, out:{opacity: 0, bottom: 0}}
				,
				onLoad: function(){
					$('canvas', this).trigger('canvasAnimStart') ; // 通知canvas做动画
				},
				onLeave: function(){
					$('canvas', this).trigger('canvasAnimEnd') ; // 通知canvas做动画
				}
			}))
		.addPage('piechart', '饼图')
			.addComponent(PieChart({
				typ: 'radar',
				name: '雷达',
				css:{ width: 400, height: 400, opacity: 0, bottom: 0},
				data: [
					{name: 'JS',     per: .2, color: '#ff7676'},
					{name: 'CSS3',   per: .4, color: '#ff7676'},
					{name: 'HTML5',  per: .2, color: '#ff7676'},
					{name: 'PHP',    per: .15, color: '#ff7676'},
					{name: 'jQuery', per: .05, color: '#ff7676'},
				],
				anim: {in:{opacity: 1, bottom: '10%'}, out:{opacity: 0, bottom: 0}}
				,
				onLoad: function(){
					$('canvas', this).trigger('canvasAnimStart') ; // 通知canvas做动画
				},
				onLeave: function(){
					$('canvas', this).trigger('canvasAnimEnd') ; // 通知canvas做动画
				}
			}))
		.addPage('Ring', '环形图')
			.addComponent(Ring({
				typ: 'ring',
				name: '环形',
				css:{ width: 400, height: 400, opacity: 0, bottom: 0},
				data: {name: 'JS', per: .65, color: '#ff7676'},
				anim: {in:{opacity: 1, bottom: '10%'}, out:{opacity: 0, bottom: 0}},
				onLoad: function(){
					$('canvas', this).trigger('canvasAnimStart') ; // 通知canvas做动画
				},
				onLeave: function(){
					$('canvas', this).trigger('canvasAnimEnd') ; // 通知canvas做动画
				}
			}))
		.loader() ;
})