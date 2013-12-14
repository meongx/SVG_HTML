(function() {
	var margin = { top: 5, right: 10, bottom: 30, left: 20 },
	    widthWin = window.innerWidth - 20 - margin.left - margin.right,
	    heightWin = window.innerHeight - 160 - margin.top - margin.bottom,
	    
		cellSize = 30,
		width = widthWin - (widthWin % cellSize),
		height = heightWin - (heightWin % cellSize),

		domainWidth = width / cellSize,
		minDomainX = (domainWidth - (domainWidth % 2)) / -2,
		maxDomainX = (domainWidth + (domainWidth % 2)) /  2,

		domainHeight = height / cellSize,
		minDomainY = (domainHeight - (domainHeight % 2)) / -2,
		maxDomainY = (domainHeight + (domainHeight % 2)) /  2;

	window.scaleX = d3.scale.linear()
		.domain([minDomainX, maxDomainX])
		.range([0, width]);

	window.scaleY = d3.scale.linear()
		.domain([minDomainY, maxDomainY])
		.range([height, 0]);

	window.scaleLength = function(input) { return input * cellSize }

	var axisX = d3.svg.axis()
		.scale(scaleX)
		.orient('bottom')
		.ticks(domainWidth)
		.tickSize(-height);

	var axisY = d3.svg.axis()
		.scale(scaleY)
		.orient('left')
		.ticks(domainHeight)
		.tickSize(-width);

	var svg = d3.select('#canvas').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.append('rect')
		.attr('class', 'canvas')
		.attr('width', width)
		.attr('height', height);

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(axisX);

	svg.append('g')
		.attr('class', 'y axis')
		.call(axisY);

	var zeroFilter = function() { return $(this).text() == '0'; },
		$zeroTexts = $('#canvas text').filter(zeroFilter),
		$zeroLines = $zeroTexts.prev();

	$zeroLines.each(function() { this.classList.add('zero') });

	window.graphicObject = svg.append('g');
})();