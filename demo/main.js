(function () {
	var cnvs = document.getElementById("win"),
		ctx=cnvs.getContext("2d");
	window.onresize = function () {
		cnvs.width = window.innerWidth;
		cnvs.height = window.innerHeight;
	};
	window.onresize();
})();