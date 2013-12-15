Persegi = {
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
			i = context.inputs,
			tx = scaleX(i.tx()),
			ty = scaleY(i.ty());

		//TODO: scale should be calculated inside fn.translate()
		context.fn.translate(tx,ty);
	},
	resetTranslation: function() {
		var context = vm.currentShape(),
			shape = context.shape(),
			tx = shape.originalRectCoord.x,
			ty = shape.originalRectCoord.y;

		//TODO: should be fn.translate(0,0)
		context.fn.translate(tx,ty);
	},
	clear: clearShapes,

	fn: {
		translate: function(x,y) {
			var rect = vm.currentShape().shape().rect;

			var transition = rect.transition()
							.attr('x', x)
							.attr('y', y);

			var transform = rect.attr('transform');
			if (transform) {
				var deg = transform.substring(7, transform.indexOf(' ')),
					tx = x + (rect.attr('width')  / 2),
					ty = y + (rect.attr('height') / 2);

				transition.attrTween('transform', function() {
					return d3.interpolateString(
						transform,
						'rotate(' + deg + ' ' + tx + ' ' + ty + ')'
					);
				})
			}
		}
	}
}