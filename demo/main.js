(function () {
	var cnvs = document.getElementById("win"),
		ctx=cnvs.getContext("2d");
	window.onresize = function () {
		cnvs.width = window.innerWidth;
		cnvs.height = window.innerHeight;
	}
	window.onresize();

	var tested=0,
		failed=0;
	function claim(name,actual,shouldbe,boolOverride) {
		console.log("[Test #"+(tested+1)+"] "+name+" is",actual,"(should be",shouldbe,")");
		tested++;
		var bool=actual===shouldbe;
		if (typeof boolOverride!=="undefined") bool=boolOverride(actual,shouldbe);
		if (bool) {
			console.info("PASS");
		}else{
			console.warn("FAIL");
			failed++;
		}
	}
	function claimTypeof(name,actual,shouldbe,boolOverride) {
		claim("The type of "+name,typeof actual,shouldbe,boolOverride);
	}
	function claimArray(name,actual,boolOverride) {
		claimTypeof(name,actual,"object",boolOverride);
		claimTypeof(name+".length",actual.length,"number",boolOverride);
	}
	function gradeLetter(percentage) {
		var gradeL="F";
		/*if (percentage>=97) gradeL="A+";
		else */if (percentage>=93) gradeL="A";
		else if (percentage>=90) gradeL="A-";
		else if (percentage>=87) gradeL="B+";
		else if (percentage>=83) gradeL="B";
		else if (percentage>=80) gradeL="B-";
		else if (percentage>=77) gradeL="C+";
		else if (percentage>=73) gradeL="C";
		else if (percentage>=70) gradeL="C-";
		else if (percentage>=67) gradeL="D+";
		else if (percentage>=65) gradeL="D";
		return gradeL;
	}
	function recursivelyCheck(a,s,hasCheckedBefore) {
		for (var i in a) {
			if (typeof s[i]!==typeof a[i]) return false;
			if (typeof a[i]==="object") {
				if (!recursivelyCheck(a[i],s[i])) return false;
			}else if (a[i]!=s[i]) return false;
		}
		if (!hasCheckedBefore) return recursivelyCheck(s,a,true);
		return true;
	}

	console.group("Unit test of library");
	
	claim("The distance of (0,1) from the origin",ss.distance(0,1),1);
	claim("The the radian rotation of (0,1) from (1,0)",
		ss.findRot(0,1),Math.PI/2);
	claim("The the radian rotation of (0,-1) from (1,0)",
		ss.findRot(0,-1),3*Math.PI/2);
	claim("The x-position of the raw rotation of the point (0,1) pi radians",
		ss.rawRotate(-1,0,Math.PI)[0],-1);
	claimTypeof("newShape.dimensions",new ss.Shape().dimensions,"number");
	claimArray("newShape.points",new ss.Shape().points);
	claimTypeof("newShape.pointColor",new ss.Shape().pointColor,"string");
	claimArray("newShape.pointColors",new ss.Shape().pointColors);
	claimTypeof("newShape.pointSize",new ss.Shape().pointSize,"number");
	claimArray("newShape.segments",new ss.Shape().segments);
	claimTypeof("newShape.segmentColor",new ss.Shape().segmentColor,"string");
	claimArray("newShape.segmentColors",new ss.Shape().segmentColors);
	claimTypeof("newShape.segmentSize",new ss.Shape().segmentSize,"number");
	claimArray("newShape.faces",new ss.Shape().faces);
	claimTypeof("newShape.faceColor",new ss.Shape().faceColor,"string");
	claimArray("newShape.facesColors",new ss.Shape().faceColors);
	claim("The constructor for shape",ss.Shape,
		ss.Shape.prototype.constructor);
	
	var a=new ss.Square(0,10,10);
	claim("The return of makeDup",a.makeDup(),a,recursivelyCheck);
	claim("The return of transpose",a.transpose(10,0),a);
	claim("The result of transpose",a.points[0],[10,10],recursivelyCheck);
	//Rotate it around itself
	claim("The return of rotate shape",a.rotate(15,15,Math.PI),a);
	claim("The return of roundpoints",a.roundPoints(),a);//round the points
	claim("The result of rotate",a.points[1],[10,20],recursivelyCheck);
	claim("The return of rotCenter",a.rotCenter(-Math.PI),a);//undo said rotation
	claim("The result of rotCenter",a.points[0],[10,10],recursivelyCheck);
	a.roundPoints();
	claim("The return of scale (one argument)",a.scale(4),a);
	claim("The result of scale",a.points[1],[80,40],recursivelyCheck);
	claim("The return of scale (two arguments)",a.scale(1/2,1/2),a);
	claim("The result of scale",a.points[1],[40,20],recursivelyCheck);
	claim("The return of drawOn",a.drawOn(ctx),a);
	a.transpose(40,0);
	claim("The return of drawPointsOn",a.drawPointsOn(ctx),a);
	a.transpose(40,0);
	claim("The return of drawSegmentsOn",a.drawSegmentsOn(ctx),a);
	a.transpose(40,0);
	claim("The return of drawFacesOn",a.drawFacesOn(ctx),a);
	a.transpose(-40*3,0).scale(1/2);
	var b=a.makeDup();
	claim("The result of identical collisionWith (0) (square,square)",
		ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[10,20],[10,10]],recursivelyCheck);
	claim("The result of identical collisionWith (1) (square,square)",
	ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[10,20],[10,10]],recursivelyCheck);
	b.transpose(5,5);
	claim("The result of good collisionWith (0) (square,square)",
		ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[20,10],[20,20]],recursivelyCheck);
	claim("The result of good collisionWith (1) (square,square)",
	ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[20,10],[20,20]],recursivelyCheck);
	b.transpose(10,10);
	claim("The result of failed collisionWith (square,square)",
		a.collisionWith(b),[],recursivelyCheck);
	b=new ss.Circle();
	throw JSON.stringify(a.drawOn(ctx));
	claim("The result of identical collisionWith (0) (circle,square)",
		ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[10,20],[10,10]],recursivelyCheck);
	claim("The result of identical collisionWith (1) (circle,square)",
	ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[10,20],[10,10]],recursivelyCheck);
	b.transpose(5,5);
	claim("The result of good collisionWith (0) (circle,square)",
		ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[20,10],[20,20]],recursivelyCheck);
	claim("The result of good collisionWith (1) (circle,square)",
	ss.Polygon.apply(ss,a.collisionWith(b)[0]).roundPoints().points,
		[[20,10],[20,20]],recursivelyCheck);
	b.transpose(10,10);
	claim("The result of failed collisionWith (circle,square)",
		a.collisionWith(b),[],recursivelyCheck);

	var grade=(tested-failed)/tested*100,gradeL=gradeLetter(grade);
	console.info("Got a(n)",gradeL,"(",Math.round(grade),
		"%) in the unit test.");
	console.table({
		"Tested":{
			Count:tested,
			Percent:"",
		},
		"Passed":{
			Count:tested-failed,
			Percent:(tested-failed)/tested*100+"%",
		},
		"Failed":{
			Count:failed,
			Percent:failed/tested*100+"%",
		}
	})
	console.groupEnd();
	if (gradeL==="F") console.error("Failed unit test!");
	else if (grade<100) console.warn("Imperfect score in unit test");
	window.a=a;
})()