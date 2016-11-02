;(function(){
	var compo = ['ComponentBase', 'Histogram', 'HistogramV', 'LineChart', 'PieChart', 'Radar', 'Ring', 'Scatter'];
	var composStr = compo.reduce(function(rs, item){
		return rs += '<script src="./js/'+item+'.js"></script>';
	},'')
	document.write(composStr) ;
})()
