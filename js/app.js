(function() {
	window.vm = {
		shapes: [
			Lingkaran,
			Persegi,
			Garis
		],
		currentShape: ko.observable(undefined)
	};

	vm.currentShape.subscribe(clearShapes);

	ko.applyBindings(vm);
})();