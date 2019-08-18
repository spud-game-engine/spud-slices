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
		console.log(name,actual,"(should be",shouldbe,")");
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

	console.groupCollapsed("Unit test of library");
	
	claim("The distance of (0,1) from the origin is",pc.distance(0,1),1);
	claim("The the radian rotation of (0,1) from (1,0) is",
		pc.findRot(0,1),Math.PI/2);
	claim("The the radian rotation of (0,-1) from (1,0) is",
		pc.findRot(0,-1),3*Math.PI/2,false);
	claim("The x-position of the raw rotation of the point (0,1) pi radians is",
		pc.rawRotate(-1,0,Math.PI)[0],-1);
	claim("The x-position of the rotation of the point (0,1) pi radians is",
		pc.rotate(-1,0,Math.PI)[0],1);
	claim("The x-position of the rotation of the point (0,1) pi radians is",
		pc.rotate(-1,0,Math.PI)[0],1);
	
	console.log("Tested:",tested);
	console.log("Passed:",tested-failed, "(",(tested-failed)/tested*100,"%)");
	console.log("Failed:",failed, "(",failed/tested*100,"%)");
	console.log("Critical Failures:",failed, "(",importantF/tested*100,"%)");
	console.groupEnd();
	var grade=(tested-failed)/tested*100,gradeL=gradeLetter(grade);
	console.info("Got a(n)",gradeL,"(",Math.round(grade),"%) in the strict unit test.");
	var grade=(tested-importantF)/tested*100,gradeL=gradeLetter(grade);
	console.info("Got a(n)",gradeL,"(",Math.round(grade),"%) in the critical unit test.");
})()