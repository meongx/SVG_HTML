(function() {
	window.vm = {
		shapes: [
			{
				name: 'Lingkaran',
				inputs: {
					x: ko.observable(0),
					y: ko.observable(0),
					r: ko.observable(1),

					scale: ko.observable(2)
				},
				draw: function() {
					vm.currentShape().clear();

					var i = vm.currentShape().inputs
						x = i.x(),
						y = i.y(),
						r = scaleLength(i.r()),
						c = window.graphicObject.append('g');

					vm.currentShape()._shape = {
						circle: c.append('circle')
							.attr('cx', scaleX(x))
							.attr('cy', scaleY(y))
							.attr('r', 1)
							.attr('class', 'graphic'),

						circleOriginalRadius: r, // used for scaling

						centerPoint: c.append('circle')
							.attr('cx', scaleX(x))
							.attr('cy', scaleY(y))
							.attr('r', 3)
							.attr('class', 'point-center')
					}

					vm.currentShape()._shape.circle.transition()
						.attr('r',r);
				},
				scale: function() {
					var scaleValue = vm.currentShape().inputs.scale(),
						shape = vm.currentShape()._shape
						circle = shape.circle,
						radius = shape.circleOriginalRadius;

					circle.transition()
						.attr('r',scaleValue * radius)
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