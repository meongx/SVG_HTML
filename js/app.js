window.vm = {};

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = window.innerWidth - 40 - margin.left - margin.right,
    height = window.innerHeight - 100 - margin.top - margin.bottom,
	scale = 30,
	domainX = Math.round(width / 2 / scale),
	domainY = Math.round(height / 2 / scale);

var scaleX = d3.scale.linear()
	.domain([-domainX, domainX])
	.range([0, width]);

var scaleY = d3.scale.linear()
	.domain([-domainY, domainY])
	.range([height, 0]);

var axisX = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(width / scale)
	.tickSize(-height);

var axisY = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(height / scale)
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

ko.applyBindings(vm);