import test from 'ava';
var ss=require('./spudslices');
function claim(name,val,boolOverride) {
	test.todo("Make \""+name+"\" into a real test.");
	//When doing so, the old testing system must still get a 100%
	var actual=val[0],
		shouldbe=val[1];
	test(name,t => {
		if (typeof boolOverride!=="undefined") {
			if (boolOverride==recursivelyCheck) t.deepEqual(actual,shouldbe);
			//if a test fails, and you can see this, then make it into a real test before going on
			t.true(boolOverride(actual,shouldbe));
		}else t.is(actual,shouldbe);
		//if a test fails, and you can see this, then make it into a real test before going on
	});
}
function claimTypeof(name,actual,shouldbe,boolOverride) {
	claim("The type of "+name,[typeof actual,shouldbe],boolOverride);
}
function claimArray(name,actual,boolOverride) {
	claimTypeof(name,actual,"object",boolOverride);
	claimTypeof(name+".length",actual.length,"number",boolOverride);
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
claim("The distance of (0,1) from the origin",[ss.distance(0,1),1]);
claim("The the radian rotation of (0,1) from (1,0)",
	[ss.findRot(0,1),Math.PI/2]);
claim("The the radian rotation of (0,-1) from (1,0)",
	[ss.findRot(0,-1),3*Math.PI/2]);
claim("The x-position of the raw rotation of the point (0,1) pi radians",
	[ss.rawRotate(-1,0,Math.PI)[0],-1]);
claim("The x-position of .rotate on the point (0,1) pi radians",
	[ss.rotate(-1,0,Math.PI)[0],1]);
claimTypeof("newShape.dimensions",new ss.Shape().dimensions,"number");
claimTypeof("newShape.category",new ss.Shape().category,"string");
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
claim("The constructor for shape",[ss.Shape,
	ss.Shape.prototype.constructor]);
var a=new ss.Polygon(10,20,93);
claim("The return of makeDup",[a.makeDup(),a],recursivelyCheck);
claim("polygon.category",[a.category,"polygon"]);
claim("polygon.faces",[a.faces,[[0,1,2]]],recursivelyCheck);
claim("polygon.segments",[a.segments,[[2,0],[0,1],[1,2]]],recursivelyCheck);
claim("polygon.points",[a.points,[10,20,93]],recursivelyCheck);
a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
claim("(more) polygon.faces",[a.faces,[[0,1,2,3]]],recursivelyCheck);
claim("(more) polygon.segments",[a.segments,[[3,0],[0,1],[1,2],[2,3]]],recursivelyCheck);
claim("(more) polygon.points",[a.points,[[0,0],[0,10],[10,10],[10,0]]],recursivelyCheck);
claim("The return of polygon.convertToTriangles",
	[a.convertToTriangles(),[
		new ss.Polygon([10,0],[0,0],[5,5]),
		new ss.Polygon([0,0],[0,10],[5,5]),
		new ss.Polygon([0,10],[10,10],[5,5]),
		new ss.Polygon([10,10],[10,0],[5,5]),
	]],recursivelyCheck);
claim("The return of polygon.joinSegments",[a.joinSegments(1,2),a]);
claim("The result of polygon.joinSegments",[a,
	new ss.Polygon([0,0],[10,10],[10,0])],recursivelyCheck);
claim("The return of polygon.findCenter",[a.makeDup().scale(3/10).findCenter(),
	[2,1]],recursivelyCheck);
claim("The return of polygon.splitSegment",[a.splitSegment(1),a]);
claim("The result of polygon.splitSegment",[a,
	new ss.Polygon([0,0],[5,5],[10,10],[10,0])],recursivelyCheck);
claim("The result of polygon.splitSegment (manual point)",
	[a.splitSegment(1,[0,10]),
	new ss.Polygon([0,0],[0,10],[5,5],[10,10],[10,0])],recursivelyCheck);
claim("The result of righttriangle",[new ss.RightTriangle(1,2,3,4),
	new ss.Polygon([1,2],[4,2],[1,6])],recursivelyCheck);
claim("The result of IsosolesRightTriangle",[new ss.IsosolesRightTriangle(2,3,4),
	new ss.Polygon([2,3],[6,3],[2,7])],recursivelyCheck);
claim("The result of Rectagle",[new ss.Rectagle(1,2,3,4),
	new ss.Polygon([1,2],[4,2],[4,6],[1,6])],recursivelyCheck);
claim("The result of Square",[new ss.Square(2,3,4),
	new ss.Polygon([2,3],[6,3],[6,7],[2,7])],recursivelyCheck);
a=new ss.Square(0,10,10);
claim("The return of transpose",[a.transpose(10,0),a]);
claim("The result of transpose",[a.points[0],[10,10]],recursivelyCheck);
//Rotate it around itself
claim("The return of rotate shape",[a.rotate(15,15,Math.PI),a]);
claim("The return of roundpoints",[a.roundPoints(),a]);//round the points
claim("The result of rotate",[a.points[1],[10,20]],recursivelyCheck);
claim("The result of EqualDistShape",[new ss.EqualDistShape(0,0,4,1).roundPoints(),
	new ss.Polygon([1,0],[0,1],[-1,0],[0,-1])],recursivelyCheck);
claim("The return of rotCenter",[a.rotCenter(-Math.PI),a]);//undo said rotation
claim("The result of rotCenter",[a.points[0],[10,10]],recursivelyCheck);
a.roundPoints();
claim("The return of scale (one argument)",[a.scale(4),a]);
claim("The result of scale",[a.points[1],[80,40]],recursivelyCheck);
claim("The return of scale (two arguments)",[a.scale(1/2,1/2),a]);
claim("The result of another scale",[a.points[1],[40,20]],recursivelyCheck);
//claimT("The return of drawPointsOn",[a.drawPointsOn(ctx),a]);
test.todo("The return of drawPointsOn");
a.transpose(40,0);
//claimT("The return of drawSegmentsOn",[a.drawSegmentsOn(ctx),a]);
test.todo("The return of drawSegmentsOn");
a.transpose(40,0);
//claimT("The return of drawFacesOn",[a.drawFacesOn(ctx),a]);
test.todo("The return of drawFacesOn");
a.transpose(40,0);
//claimT("The return of drawOn",[a.drawOn(ctx),a]);
a.transpose(-40*3,0).scale(1/2);
var b=a.makeDup();
claimTypeof("The value of collisionDetecors",ss.collisionDetectors,"object");
claimTypeof("The value of collisionDetecors.circle",
	ss.collisionDetectors.circle,"object");
claimTypeof("The value of collisionDetecors.circle.circle",
	ss.collisionDetectors.circle.circle,"function");
claimTypeof("The value of collisionDetecors.circle.polygon",
	ss.collisionDetectors.circle.polygon,"undefined");
claimTypeof("The value of collisionDetecors.polygon",
	ss.collisionDetectors.polygon,"object");
claimTypeof("The value of collisionDetecors.polygon.circle",
	ss.collisionDetectors.polygon.circle,"function");
claimTypeof("The value of collisionDetecors.polygon.polygon",
	ss.collisionDetectors.polygon.polygon,"function");
claim("The result of identical collisionWith (square,square)",
	[a.collisionWith(b),
	[[[10,20],[10,10]],[[10,20],[10,10]]]],recursivelyCheck);
b.transpose(5,5);
claim("The result of good collisionWith (square,square)",
	[a.collisionWith(b),
	[[[20,10],[20,20]],[[15,15],[25,15]]]],recursivelyCheck);
b.transpose(10,10);
claim("The result of failed collisionWith (square,square)",
	[[a.collisionWith(b)],[[]]],recursivelyCheck);
b=new ss.Circle(20,20,10);
claim("circle.category",b.category,"circle");
claim("circle radius (points[0])",[b.points[0],10]);
claim("circle center (points[1])",[b.points[1],[20,20]],recursivelyCheck);
claim("circle segment (segments[0])",[b.segments[0],[0,1]],recursivelyCheck);
claim("circle.faces",[b.faces,[[0]]],recursivelyCheck);
claim("The result of good collisionWith (circle,square)",
	[a.collisionWith(b),
	[[[10,20],[10,10]],[10,[20,20]]]],recursivelyCheck);
b.transpose(10,10);
claim("The result of failed collisionWith (circle,square)",
	[[a.collisionWith(b)],[[]]],recursivelyCheck);
a=b.makeDup();
claim("The result of identical collisionWith (circle,circle)",
	[a.collisionWith(b),
	[[10,[30,30]],[10,[30,30]]]],recursivelyCheck);
b.transpose(5,5);
claim("The result of good collisionWith (circle,circle)",
	[a.collisionWith(b),
	[[10,[30,30]],[10,[35,35]]]],recursivelyCheck);
b.transpose(10,100);
claim("The result of failed collisionWith (circle,circle)",
	[[a.collisionWith(b)],[[]]],recursivelyCheck);//*/
