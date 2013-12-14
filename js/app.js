(function() {
	var clearShapes = function() { 
		window.graphicObject.selectAll('g').remove();
		vm.currentShape().shape(undefined);
	};

	window.vm = {
		shapes: [
			{
				name: 'Lingkaran',
				shape: ko.observable(undefined),
				inputs: {
					x: ko.observable(0),
					y: ko.observable(0),
					r: ko.observable(1),

					scale: ko.observable(2),

					tx: ko.observable(1),
					ty: ko.observable(1)
				},
				draw: function() {
					vm.currentShape().clear();

					var i = vm.currentShape().inputs
						x = scaleX(i.x()),
						y = scaleY(i.y()),
						r = scaleLength(i.r()),
						c = window.graphicObject.append('g');

					vm.currentShape().shape({
						circle: c.append('circle')
							.attr('cx', x)
							.attr('cy', y)
							.attr('r', 1)
							.attr('class', 'graphic'),

						circleOriginalRadius: r, // used for scaling
						circleOriginalCenter: { x: x, y: y}, // for translation

						centerPoint: c.append('circle')
							.attr('cx', x)
							.attr('cy', y)
							.attr('r', 3)
							.attr('class', 'point')
					});

					vm.currentShape().shape().circle.transition()
						.attr('r',r);
				},
				scale: function() {
					var scaleValue = vm.currentShape().inputs.scale(),
						shape = vm.currentShape().shape()
						circle = shape.circle,
						radius = shape.circleOriginalRadius;

					circle.transition()
						.attr('r',scaleValue * radius)
				},
				resetScale: function() {
					var shape = vm.currentShape().shape()
						circle = shape.circle,
						radius = shape.circleOriginalRadius;

					circle.transition()
						.attr('r', radius);
				},
				translate: function() {
					var context = vm.currentShape(),
						circle = context.shape().circle,
						centerPoint = context.shape().centerPoint,
						tx = scaleX(context.inputs.tx()),
						ty = scaleY(context.inputs.ty());

					circle.transition()
						.attr('cx', tx)
						.attr('cy', ty);

					centerPoint.transition()
						.attr('cx', tx)
						.attr('cy', ty);
				},
				resetTranslation: function() {
					var context = vm.currentShape(),
						shape = context.shape(),
						circle = shape.circle,
						centerPoint = shape.centerPoint,
						tx = shape.circleOriginalCenter.x,
						ty = shape.circleOriginalCenter.y;

					circle.transition()
						.attr('cx', tx)
						.attr('cy', ty);

					centerPoint.transition()
						.attr('cx', tx)
						.attr('cy', ty);
				},
				clear: clearShapes
			},
			{
				name: 'Persegi',
				shape: ko.observable(undefined),
				inputs: {
					x: ko.observable(0),
					y: ko.observable(0),
					width: ko.observable(1),
					height: ko.observable(1),

					scale: ko.observable(2),

					rx: ko.observable(0),
					ry: ko.observable(0),
					deg: ko.observable(45),

					tx: ko.observable(1),
					ty: ko.observable(1)
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

					var shape = {
						currentRectRotation: 0,
						originalRectSize: size,
						originalRectCoord: { x: x, y: y },

						rect: c.append('rect')
							.attr('class', 'graphic')
							.attr('x', x)
							.attr('y', y)
							.attr('width', 0)
							.attr('height', 0)
					}
					vm.currentShape().shape(shape);

					shape.rect.transition()
						.attr('width', size.width)
						.attr('height', size.height);
				},
				scale: function() {
					var context = vm.currentShape(),
						rect = context.shape().rect,
						originalSize = context.shape().originalRectSize,
						scale = context.inputs.scale();

					rect.transition()
						.attr('width', originalSize.width * scale)
						.attr('height', originalSize.height * scale);
				},
				resetScale: function() {
					var context = vm.currentShape(),
						rect = context.shape().rect,
						originalSize = context.shape().originalRectSize;

					rect.transition()
						.attr('width', originalSize.width)
						.attr('height', originalSize.height);
				},
				rotate: function() {
					var context = vm.currentShape()
						rect = context.shape().rect,
						startDeg = context.shape().currentRectRotation,
						i = context.inputs,
						//rx = scaleX(i.rx()),
						//ry = scaleY(i.ry()),
						rx = parseInt(rect.attr('x')) + (rect.attr('width') / 2),
						ry = parseInt(rect.attr('y')) + (rect.attr('height') / 2),
						rxy = ' ' + rx + ' ' + ry,
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
					vm.currentShape().shape().currentRectRotation = deg;
				},
				resetRotation: function() {
					var temp = vm.currentShape().inputs.deg();
					vm.currentShape().inputs.deg(0);
					vm.currentShape().rotate();
					vm.currentShape().inputs.deg(temp);
				},
				translate: function() {
					var context = vm.currentShape(),
						rect = context.shape().rect,
						tx = scaleX(context.inputs.tx()),
						ty = scaleY(context.inputs.ty());

					rect.transition()
						.attr('x', tx)
						.attr('y', ty);
				},
				resetTranslation: function() {
					var context = vm.currentShape().shape(),
						rect = context.rect,
						tx = context.originalRectCoord.x,
						ty = context.originalRectCoord.y;

					rect.transition()
						.attr('x', tx)
						.attr('y', ty);
				},
				clear: clearShapes
			},
			{
				name: 'Garis',
				shape: ko.observable(undefined),
				inputs: {
					x1: ko.observable(1),
					y1: ko.observable(1),
					x2: ko.observable(5),
					y2: ko.observable(1),

					tx: ko.observable(1),
					ty: ko.observable(1),

					deg: ko.observable(45)
				},
				draw: function() {
					vm.currentShape().clear();

					var context = vm.currentShape(),
						ctx = window.graphicObject.append('g'),
						inputs = context.inputs,
						x1 = scaleX(inputs.x1()),
						y1 = scaleY(inputs.y1()),
						x2 = scaleX(inputs.x2()),
						y2 = scaleY(inputs.y2());

					context.shape({
						currentRotation: 0,
						lineOriginalCoord: { x1: x1, y1: y1, x2: x2, y2: y2 },
						line: ctx.append('line')
								.attr('class', 'graphic')
								.attr('x1', x1)
								.attr('y1', y1)
								.attr('x2', x1)
								.attr('y2', y1),

						p1: ctx.append('circle')
								.attr('class', 'point')
								.attr('cx', x1)
								.attr('cy', y1)
								.attr('r', 3),

						p2: ctx.append('circle')
								.attr('class', 'point')
								.attr('cx', x1)
								.attr('cy', y1)
								.attr('r', 3)
					});

					context.shape().line.transition()
						.attr('x2', x2)
						.attr('y2', y2);

					context.shape().p2.transition()
						.attr('cx', x2)
						.attr('cy', y2);
				},
				translate: function() {
					var context = vm.currentShape(),
						shape = context.shape(),
						origin = shape.lineOriginalCoord,
						tx = scaleLength(context.inputs.tx()),
						ty = scaleLength(context.inputs.ty());

					shape.line.transition()
						.attr('x1', origin.x1 + tx)
						.attr('y1', origin.y1 - ty)
						.attr('x2', origin.x2 + tx)
						.attr('y2', origin.y2 - ty);

					shape.p1.transition()
						.attr('cx', origin.x1 + tx)
						.attr('cy', origin.y1 - ty);

					shape.p2.transition()
						.attr('cx', origin.x2 + tx)
						.attr('cy', origin.y2 - ty);
				},
				resetTranslation: function() {
					var context = vm.currentShape(),
						shape = context.shape(),
						origin = shape.lineOriginalCoord;

					shape.line.transition()
						.attr('x1', origin.x1)
						.attr('y1', origin.y1)
						.attr('x2', origin.x2)
						.attr('y2', origin.y2);

					shape.p1.transition()
						.attr('cx', origin.x1)
						.attr('cy', origin.y1);

					shape.p2.transition()
						.attr('cx', origin.x2)
						.attr('cy', origin.y2);
				},
				rotate: function() {
					var context = vm.currentShape(),
						shape = context.shape(),
						origin = shape.lineOriginalCoord,
						startDeg = shape.currentRotation,
						rx = origin.x1 + ((origin.x2 - origin.x1) / 2),
						ry = origin.y1 - ((origin.y1 - origin.y2) / 2),
						rxy = ' ' + rx + ' ' + ry,
						deg = context.inputs.deg();

					shape.line.transition()
						.attrTween('transform', function() {
							return d3.interpolateString(
								'rotate(' + startDeg + rxy + ')',
								'rotate(' + deg + rxy + ')'
							);
						});

					shape.p1.transition()
						.attrTween('transform', function() {
							return d3.interpolateString(
								'rotate(' + startDeg + rxy + ')',
								'rotate(' + deg + rxy + ')'
							);
						});

					shape.p2.transition()
						.attrTween('transform', function() {
							return d3.interpolateString(
								'rotate(' + startDeg + rxy + ')',
								'rotate(' + deg + rxy + ')'
							);
						});

					shape.currentRotation = deg;
				},
				resetRotation: function() {
					var temp = vm.currentShape().inputs.deg();
					vm.currentShape().inputs.deg(0);
					vm.currentShape().rotate(0);
					vm.currentShape().inputs.deg(temp);
				},
				clear: clearShapes
			}
		],
		currentShape: ko.observable(undefined)
	};

	vm.currentShape.subscribe(clearShapes);

	ko.applyBindings(vm);
})();