import test from 'ava';
var ss=require('./spudslices');
function claim(name,val,boolOverride) {
	test.todo("Make \""+name+"\" into a real test.");
	//When doing so, the old testing system must still get a 100%
	test(name,t => {
		var outP=val(t);
		return;
		var actual=outP[0],
		shouldbe=outP[1];
		if (typeof boolOverride!=="undefined") {
			if (boolOverride==recursivelyCheck) t.deepEqual(actual,shouldbe);
			//if a test fails, and you can see this, then make it into a real test before going on
			t.true(boolOverride(actual,shouldbe));
		}else t.is(actual,shouldbe);
		//if a test fails, and you can see this, then make it into a real test before going on
	});
}
function claimTypeof(name,val) {
	claim("The type of "+name,t => {
		var outP=val(t);
		t.is(typeof outP[0],outP[1]);
	});
}
function claimArray(name,actual) {
	claimTypeof(name,t => {
		return [actual,"object"];
	});
	claimTypeof(name+".length",t => {
		return [actual.length,"number"];
	});
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
claim("The distance of (0,1) from the origin",t => {
	t.is(ss.distance(0,1),1);
});
claim("The the radian rotation of (0,1) from (1,0)",t => {
	t.is(ss.findRot(0,1),Math.PI/2);
});
claim("The the radian rotation of (0,-1) from (1,0)",t => {
	t.is(ss.findRot(0,-1),3*Math.PI/2);
});
claim("The x-position of the raw rotation of the point (0,1) pi radians",t => {
	t.is(ss.rawRotate(-1,0,Math.PI)[0],-1);
});
claim("The x-position of .rotate on the point (0,1) pi radians",t => {
	t.is(ss.rotate(-1,0,Math.PI)[0],1);
});
claimTypeof("newShape.dimensions",t => {
	return [new ss.Shape().dimensions,"number"];
});
claimTypeof("newShape.category",t => {
	return [new ss.Shape().category,"string"];
});
claimArray("newShape.points",new ss.Shape().points);
claimTypeof("newShape.pointColor",t => {
	return [new ss.Shape().pointColor,"string"];
});
claimArray("newShape.pointColors",[new ss.Shape().pointColors]);
claimTypeof("newShape.pointSize",t => {
	return [new ss.Shape().pointSize,"number"];
});
claimArray("newShape.segments",[new ss.Shape().segments]);
claimTypeof("newShape.segmentColor",t => {
	return [new ss.Shape().segmentColor,"string"];
});
claimArray("newShape.segmentColors",new ss.Shape().segmentColors);
claimTypeof("newShape.segmentSize",t => {
	return [new ss.Shape().segmentSize,"number"];
});
claimArray("newShape.faces",new ss.Shape().faces);
claimTypeof("newShape.faceColor",t => {
	return [new ss.Shape().faceColor,"string"];
});
claimArray("newShape.facesColors",new ss.Shape().faceColors);
claim("The constructor for shape",t => {
	t.is(ss.Shape,ss.Shape.prototype.constructor);
});
var a=new ss.Polygon(10,20,93);
claim("The return of makeDup",t => {
	t.deepEqual(a.makeDup(),a);
});
claim("polygon.category",t => {
	t.is(a.category,"polygon");
});
claim("polygon.faces",t => {
	t.deepEqual(a.faces,[[0,1,2]]);
});
claim("polygon.segments",t => {
	t.deepEqual(a.segments,[[2,0],[0,1],[1,2]]);
});
claim("polygon.points",t => {
	t.deepEqual(a.points,[10,20,93]);
});
a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
claim("(more) polygon.faces",t => {
	t.deepEqual(a.faces,[[0,1,2,3]]);
});
claim("(more) polygon.segments",t => {
	t.deepEqual(a.segments,[[3,0],[0,1],[1,2],[2,3]]);
});
claim("(more) polygon.points",t => {
	t.deepEqual(a.points,[[0,0],[0,10],[10,10],[10,0]]);
});
claim("The return of polygon.convertToTriangles",t => {
	t.deepEqual(a.convertToTriangles(),[
		new ss.Polygon([10,0],[0,0],[5,5]),
		new ss.Polygon([0,0],[0,10],[5,5]),
		new ss.Polygon([0,10],[10,10],[5,5]),
		new ss.Polygon([10,10],[10,0],[5,5]),
	]);
});
claim("The return of polygon.joinSegments",t => {
	t.is(a.joinSegments(1,2),a);
});
claim("The result of polygon.joinSegments",t => {
	t.deepEqual(a,new ss.Polygon([0,0],[10,10],[10,0]));
});
claim("The return of polygon.findCenter",t => {
	t.deepEqual(a.makeDup().scale(3/10).findCenter(),[2,1]);
});
claim("The return of polygon.splitSegment",t => {
	t.is(a.splitSegment(1),a);
});
claim("The result of polygon.splitSegment",t => {
	t.deepEqual(a,new ss.Polygon([0,0],[5,5],[10,10],[10,0]));
});
claim("The result of polygon.splitSegment (manual point)",t => {
	t.deepEqual(a.splitSegment(1,[0,10]),
	new ss.Polygon([0,0],[0,10],[5,5],[10,10],[10,0]));
});
claim("The result of righttriangle",t => {
	t.deepEqual(new ss.RightTriangle(1,2,3,4),new ss.Polygon([1,2],[4,2],[1,6]));
});
claim("The result of IsosolesRightTriangle",t => {
	t.deepEqual(new ss.IsosolesRightTriangle(2,3,4),new ss.Polygon([2,3],[6,3],[2,7]));
});
claim("The result of Rectagle",t => {
	t.deepEqual(new ss.Rectagle(1,2,3,4),new ss.Polygon([1,2],[4,2],[4,6],[1,6]));
});
claim("The result of Square",t => {
	t.deepEqual(new ss.Square(2,3,4),new ss.Polygon([2,3],[6,3],[6,7],[2,7]));
});
a=new ss.Square(0,10,10);
claim("The return of transpose",t => {
	t.is(a.transpose(10,0),a);
});
claim("The result of transpose",t => {
	t.deepEqual(a.points[0],[10,10]);
});
//Rotate it around itself
claim("The return of rotate shape",t => {
	t.is(a.rotate(15,15,Math.PI),a);
});
claim("The return of roundpoints",t => {
	t.is(a.roundPoints(),a);
});//round the points
claim("The result of rotate",t => {
	t.deepEqual(a.points[1],[10,20]);
});
claim("The result of EqualDistShape",t => {
	t.deepEqual(new ss.EqualDistShape(0,0,4,1).roundPoints(),
		new ss.Polygon([1,0],[0,1],[-1,0],[0,-1]));
});
claim("The return of rotCenter",t => {
	t.is(a.rotCenter(-Math.PI),a);
});//undo said rotation
claim("The result of rotCenter",t => {
	t.deepEqual(a.points[0],[10,10]);
});
a.roundPoints();
claim("The return of scale (one argument)",t => {
	t.is(a.scale(4),a);
});
claim("The result of scale",t => {
	t.deepEqual(a.points[1],[80,40]);
});
claim("The return of scale (two arguments)",t => {
	t.is(a.scale(1/2,1/2),a);
});
claim("The result of another scale",t => {
	t.deepEqual(a.points[1],[40,20]);
});
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
claimTypeof("The value of collisionDetecors",t => {
	return [ss.collisionDetectors,"object"];
});
claimTypeof("The value of collisionDetecors.circle",t => {
	return [ss.collisionDetectors.circle,"object"];
});
claimTypeof("The value of collisionDetecors.circle.circle",t => {
	return [ss.collisionDetectors.circle.circle,"function"];
});
claimTypeof("The value of collisionDetecors.circle.polygon",t => {
	return [ss.collisionDetectors.circle.polygon,"undefined"];
});
claimTypeof("The value of collisionDetecors.polygon",t => {
	return [ss.collisionDetectors.polygon,"object"];
});
claimTypeof("The value of collisionDetecors.polygon.circle",t => {
	return [ss.collisionDetectors.polygon.circle,"function"];
});
claimTypeof("The value of collisionDetecors.polygon.polygon",t => {
	return [ss.collisionDetectors.polygon.polygon,"function"];
});
claim("The result of identical collisionWith (square,square)",t => {
	t.deepEqual(a.collisionWith(b),[[[10,20],[10,10]],[[10,20],[10,10]]]);
});
b.transpose(5,5);
claim("The result of good collisionWith (square,square)",t => {
	t.deepEqual(a.collisionWith(b),[[[20,10],[20,20]],[[15,15],[25,15]]]);
});
b.transpose(10,10);
claim("The result of failed collisionWith (square,square)",t => {
	t.deepEqual([a.collisionWith(b)],[[]]);
});
b=new ss.Circle(20,20,10);
claim("circle.category",t=> {
	t.is(b.category,"circle");
});
claim("circle radius (points[0])",t=>{
	t.is(b.points[0],10);
});
claim("circle center (points[1])",t=>{
	t.deepEqual(b.points[1],[20,20]);
});
claim("circle segment (segments[0])",t=>{
	t.deepEqual(b.segments[0],[0,1]);
});
claim("circle.faces",t=>{
	t.deepEqual(b.faces,[[0]]);
});
claim("The result of good collisionWith (circle,square)",t => {
	t.deepEqual(a.collisionWith(b),[[[10,20],[10,10]],[10,[20,20]]]);
});
b.transpose(10,10);
claim("The result of failed collisionWith (circle,square)",t => {
	t.deepEqual([a.collisionWith(b)],[[]]);
});
a=b.makeDup();
claim("The result of identical collisionWith (circle,circle)",t => {
	t.deepEqual(a.collisionWith(b),[[10,[30,30]],[10,[30,30]]]);
});
b.transpose(5,5);
claim("The result of good collisionWith (circle,circle)",t => {
	t.deepEqual(a.collisionWith(b),[[10,[30,30]],[10,[35,35]]]);
});
b.transpose(10,100);
claim("The result of failed collisionWith (circle,circle)",t => {
	t.deepEqual([a.collisionWith(b)],[[]]);
});//*/
