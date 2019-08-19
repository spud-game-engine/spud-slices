(function () {
	var cnvs = document.getElementById("win"),
		ctx=cnvs.getContext("2d");
	window.onresize = function () {
		cnvs.width = window.innerWidth;
		cnvs.height = window.innerHeight;
	}
	window.onresize();

	var tested=0,
		failed=0,
		importantF=0;
	function claim(name,actual,shouldbe,important,boolOverride) {
		console.log("[Test #"+(tested+1)+"] "+name+" is",actual,"(should be",shouldbe,")");
		tested++;
		var bool=actual===shouldbe;
		if (typeof boolOverride!=="undefined") bool=boolOverride(actual,shouldbe);
		if (bool) {
			console.info("PASS");
		}else if (typeof important==="undefined"||important){
			console.error("CRITICAL FAIL");
			failed++;
			importantF++;
		}else{
			console.warn("FAIL");
			failed++;
		}
	}
	function claimTypeof(name,actual,shouldbe,important,boolOverride) {
		claim("The type of "+name,typeof actual,shouldbe,important,
			boolOverride);
	}
	function claimArray(name,actual,important,boolOverride) {
		claimTypeof(name,actual,"object",important,boolOverride);
		claimTypeof(name+".length",actual.length,"number",important,boolOverride);
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
	function invert(a,c) {
		return a!==c;
	}

	console.group("Unit test of library");
	
	claim("The distance of (0,1) from the origin",pc.distance(0,1),1);
	claim("The the radian rotation of (0,1) from (1,0)",
		pc.findRot(0,1),Math.PI/2);
	claim("The the radian rotation of (0,-1) from (1,0)",
		pc.findRot(0,-1),3*Math.PI/2,false);
	claim("The x-position of the raw rotation of the point (0,1) pi radians",
		pc.rawRotate(-1,0,Math.PI)[0],-1);
	claimTypeof("newShape.dimensions",new pc.Shape().dimensions,"number");
	claimArray("newShape.points",new pc.Shape().points);
	claimTypeof("newShape.pointColor",new pc.Shape().pointColor,"string");
	claimArray("newShape.pointColors",new pc.Shape().pointColors);
	claimTypeof("newShape.pointSize",new pc.Shape().pointSize,"number");
	claimArray("newShape.segments",new pc.Shape().segments);
	claimTypeof("newShape.segmentColor",new pc.Shape().segmentColor,"string");
	claimArray("newShape.segmentColors",new pc.Shape().segmentColors);
	claimTypeof("newShape.segmentSize",new pc.Shape().segmentSize,"number");
	claimArray("newShape.faces",new pc.Shape().faces);
	claimTypeof("newShape.faceColor",new pc.Shape().faceColor,"string");
	claimArray("newShape.facesColors",new pc.Shape().faceColors);
	claim("The constructor for shape",pc.Shape,
		pc.Shape.prototype.constructor);
	
	var a=new pc.Square(0,10,10);
	claim("The return of transpose",a.transpose(10,0),a);
	claim("The result of transpose (x)",a.points[0][0],10);
	claim("The result of transpose (y)",a.points[0][1],10);
	claim("The return of scale (one argument)",a.scale(4),a);
	claim("The result of scale (x)",a.points[1][0],80);
	claim("The result of scale (y)",a.points[1][1],40);
	claim("The return of scale (two arguments)",a.scale(1/2,1/2),a);
	claim("The result of scale (x)",a.points[1][0],40);
	claim("The result of scale (y)",a.points[1][1],20);
	claim("The return of drawOn",a.drawOn(ctx),a);
	a.transpose(40,0);
	claim("The return of drawPointsOn",a.drawPointsOn(ctx),a);
	a.transpose(40,0);
	claim("The return of drawSegmentsOn",a.drawSegmentsOn(ctx),a);
	a.transpose(40,0);
	claim("The return of drawFacesOn",a.drawFacesOn(ctx),a);
	
	var grade=(tested-failed)/tested*100,gradeL=gradeLetter(grade);
	console.info("Got a(n)",gradeL,"(",Math.round(grade),
		"%) in the strict unit test.");
	var grade=(tested-importantF)/tested*100,gradeL=gradeLetter(grade);
	console.info("Got a(n)",gradeL,"(",Math.round(grade),
		"%) in the critical unit test.");
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
		},
		"Critical Failures":{
			Count:importantF,
			Percent:importantF/tested*100+"%",
		}
	})
	console.groupEnd();
	if (gradeL==="F") console.error("Failed crit in unit test!");
	else if (grade<100) console.warn("Imperfect crit score in unit test");
	window.a=a;
})()