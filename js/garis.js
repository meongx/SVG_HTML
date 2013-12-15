Garis = {
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
			x = context.inputs.tx(),
			y = context.inputs.ty();

		context.fn.translate(x,y);
	},
	resetTranslation: function() {
		vm.currentShape().fn.translate(0, 0);
	},
	rotate: function() {
		var context = vm.currentShape(),
			shape = context.shape(),
			x1 = parseInt(shape.line.attr('x1')),
			y1 = parseInt(shape.line.attr('y1')),
			x2 = parseInt(shape.line.attr('x2')),
			y2 = parseInt(shape.line.attr('y2')),
			startDeg = shape.currentRotation,
			rx = x1 + ((x2 - x1) / 2),
			ry = y1 - ((y1 - y2) / 2),
			rxy = ' ' + rx + ' ' + ry,
			deg = context.inputs.deg();

		var istr = d3.interpolateString(
			'rotate(' + startDeg + rxy + ')',
			'rotate(' + deg + rxy + ')'
		);

		shape.line.transition()
			.attrTween('transform', function() { return istr });

		shape.p1.transition()
			.attrTween('transform', function() { return istr });

		shape.p2.transition()
			.attrTween('transform', function() { return istr });

		shape.currentRotation = deg;
	},
	resetRotation: function() {
		var temp = vm.currentShape().inputs.deg();
		vm.currentShape().inputs.deg(0);
		vm.currentShape().rotate(0);
		vm.currentShape().inputs.deg(temp);
	},
	clear: clearShapes,

	fn: {
		translate: function(x,y) {
			var context = vm.currentShape(),
				shape = context.shape(),
				origin = shape.lineOriginalCoord,
				tx = scaleLength(x),
				ty = scaleLength(y),
				x1 = origin.x1 + tx,
				y1 = origin.y1 - ty,
				x2 = origin.x2 + tx,
				y2 = origin.y2 - ty;

			var st = shape.line.transition()
				.attr('x1', x1)
				.attr('y1', y1)
				.attr('x2', x2)
				.attr('y2', y2);

			var p1t = shape.p1.transition()
				.attr('cx', x1)
				.attr('cy', y1);

			var p2t = shape.p2.transition()
				.attr('cx', x2)
				.attr('cy', y2);

			var lt = shape.line.attr('transform');
			if (lt) {
				var deg = lt.substring(7, lt.indexOf(' ')),
					rx = x1 + ((x2 - x1) / 2),
					ry = y1 - ((y1 - y2) / 2),
					rxy = ' ' + rx + ' ' + ry;

				var istr = d3.interpolateString(
					lt,
					'rotate(' + deg + rxy + ')'
				);
				console.log(x1,y1,x2,y2,rx,ry)

				st.attrTween('transform', function()  { return istr });
				p1t.attrTween('transform', function() { return istr });
				p2t.attrTween('transform', function() { return istr });
			}
		}
	}
}