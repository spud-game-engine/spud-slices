(function () {
	var cnvs = document.getElementById("win");
	window.onresize = function () {
		cnvs.width = window.innerWidth;
		cnvs.height = window.innerHeight;
	}
	window.onresize();

	var passed=0,
		tested=0,
		failed=0;
	function test(bool) {
		tested++;
		if (bool) {
			console.info("PASS");
			passed++;
		}else{
			console.warn("FAIL");
			failed++;
		}
	}
	function claim(name,actual,shouldbe) {
		console.log(name,actual,"(should be",shouldbe,")");
		test(actual===shouldbe);
	}

	console.group("Unit test of library");
	claim("The distance of (0,1) from the origin is",pc.distance(0,1),1);
	claim("The the radian rotation of (-1,0) from (1,0) is",
		pc.findRot(-1,0),Math.PI);
	claim("",1,1);
	console.log("Tested:",tested);
	console.log("Passed:",passed, "(",passed/tested*100,"%)");
	console.log("Failed:",failed, "(",failed/tested*100,"%)");
	console.groupEnd();
	var gradeL="F",grade=passed/tested*100;
	if (grade>=97) gradeL="A+";
	else if (grade>=93) gradeL="A";
	else if (grade>=90) gradeL="A-";
	else if (grade>=87) gradeL="B+";
	else if (grade>=83) gradeL="B";
	else if (grade>=80) gradeL="B-";
	else if (grade>=77) gradeL="C+";
	else if (grade>=73) gradeL="C";
	else if (grade>=70) gradeL="C-";
	else if (grade>=67) gradeL="D+";
	else if (grade>=65) gradeL="D";
	console.info("Got a(n)",gradeL,"(",Math.round(grade),"%) in the unit test.");
})()