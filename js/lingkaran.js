Lingkaran = {
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
}