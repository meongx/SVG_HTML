(function() {
	window.vm = {
		shapes: [
			{
				name: 'Lingkaran',
				inputs: {
					x: ko.observable(0),
					y: ko.observable(0),
					r: ko.observable(1)
				},
				draw: function() {
					vm.currentShape().clear();

					var i = vm.currentShape().inputs
						x = i.x(),
						y = i.y(),
						r = i.r(),
						c = window.graphicObject.append('g');

					var circle = c.append('circle')
						.attr('cx', scaleX(x))
						.attr('cy', scaleY(y))
						.attr('r', 1)
						.attr('class', 'graphic');
					var centerPoint = c.append('circle')
						.attr('cx', scaleX(x))
						.attr('cy', scaleY(y))
						.attr('r', 3)
						.attr('class', 'point-center');

					circle.transition()
						.attr('r',scaleLength(r));
				},
				clear: function() {
					window.graphicObject.selectAll('g').remove();
				}
			},
			{
				name: 'Persegi',
			},
			{
				name: 'Garis',
			}
		],
		currentShape: ko.observable(undefined)
	};

	vm.currentShape.subscribe(function(oldValue) {
		if (!oldValue) return;
		oldValue.clear();
	}, null, 'beforeChange')

	ko.applyBindings(vm);
})();