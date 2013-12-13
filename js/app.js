(function() {
	var clearShapes = function() { window.graphicObject.selectAll('g').remove() };

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
				clear: clearShapes
			},
			{
				name: 'Persegi',
				inputs: {
					x: ko.observable(0),
					y: ko.observable(0),
					width: ko.observable(1),
					height: ko.observable(1),
					scale: ko.observable(2),
					rx: ko.observable(0),
					ry: ko.observable(0),
					deg: ko.observable(45)
				},
				draw: function() {
					vm.currentShape().clear();

					var inputs = vm.currentShape().inputs,
						x = scaleX(inputs.x()),
						y = scaleY(inputs.y()),
						c = window.graphicObject.append('g');

					var size = {
						width: scaleLength(inputs.width()),
						height: scaleLength(inputs.height())
					}

					var _shape = {
						currentRectRotation: 0,
						originalRectSize: size,

						rect: c.append('rect')
							.attr('class', 'graphic')
							.attr('x', x)
							.attr('y', y)
							.attr('width', 0)
							.attr('height', 0)
					}
					vm.currentShape()._shape = _shape;

					_shape.rect.transition()
						.attr('width', size.width)
						.attr('height', size.height);
				},
				scale: function() {
					var context = vm.currentShape(),
						rect = context._shape.rect,
						originalSize = context._shape.originalRectSize,
						scale = context.inputs.scale();

					rect.transition()
						.attr('width', originalSize.width * scale)
						.attr('height', originalSize.height * scale);
				},
				rotate: function() {
					var context = vm.currentShape()
						rect = context._shape.rect,
						startDeg = context._shape.currentRectRotation,
						i = context.inputs,
						rx = scaleX(i.rx()),
						ry = scaleY(i.ry()),
						rxy = ' ' + rx + ' ' + ry
						deg = i.deg();

					rect
						.transition()
						.attrTween('transform', function() {
							return d3.interpolateString(
								'rotate(' + startDeg + rxy + ')',
								'rotate(' + deg + rxy + ')'
							)
						});

					//save current rotation
					vm.currentShape()._shape.currentRectRotation = deg;
				},
				resetRotation: function() {
					vm.currentShape().inputs.deg(0);
					vm.currentShape().rotate();
				},
				clear: clearShapes
			},
			{
				name: 'Garis',
				inputs: {

				},
				draw: function() {

				},
				scale: function() {

				},
				clear: clearShapes
			}
		],
		currentShape: ko.observable(undefined)
	};

	vm.currentShape.subscribe(clearShapes);

	ko.applyBindings(vm);
})();