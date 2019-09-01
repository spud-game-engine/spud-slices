import test from 'ava';
var ss=require('./spudslices');
function claimTypeof(name,val) {
	test.todo("Make \""+name+"\" into a real test.");
	test("The type of "+name,t => {
		var outP=val(t);
		t.is(typeof outP[0],outP[1]);
	});
}
function claimArray(name,actual) {
	test.todo("Make \""+name+"\" into a real test.");
	claimTypeof(name,t => {
		return [actual,"object"];
	});
	claimTypeof(name+".length",t => {
		return [actual.length,"number"];
	});
}
test("The distance of (0,1) from the origin",t => {
	t.is(ss.distance(0,1),1);
});
test("The the radian rotation of (0,1) from (1,0)",t => {
	t.is(ss.findRot(0,1),Math.PI/2);
});
test("The the radian rotation of (0,-1) from (1,0)",t => {
	t.is(ss.findRot(0,-1),3*Math.PI/2);
});
test("The x-position of the raw rotation of the point (0,1) pi radians",t => {
	t.is(ss.rawRotate(-1,0,Math.PI)[0],-1);
});
test("The x-position of .rotate on the point (0,1) pi radians",t => {
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
test("The constructor for shape",t => {
	t.is(ss.Shape,ss.Shape.prototype.constructor);
});
var a=new ss.Polygon(10,20,93);
test("The return of makeDup",t => {
	t.deepEqual(a.makeDup(),a);
});
test("polygon.category",t => {
	t.is(a.category,"polygon");
});
test("polygon.faces",t => {
	t.deepEqual(a.faces,[[0,1,2]]);
});
test("polygon.segments",t => {
	t.deepEqual(a.segments,[[2,0],[0,1],[1,2]]);
});
test("polygon.points",t => {
	t.deepEqual(a.points,[10,20,93]);
});
a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
test("(more) polygon.faces",t => {
	t.deepEqual(a.faces,[[0,1,2,3]]);
});
test("(more) polygon.segments",t => {
	t.deepEqual(a.segments,[[3,0],[0,1],[1,2],[2,3]]);
});
test("(more) polygon.points",t => {
	t.deepEqual(a.points,[[0,0],[0,10],[10,10],[10,0]]);
});
test("The return of polygon.convertToTriangles",t => {
	t.deepEqual(a.convertToTriangles(),[
		new ss.Polygon([10,0],[0,0],[5,5]),
		new ss.Polygon([0,0],[0,10],[5,5]),
		new ss.Polygon([0,10],[10,10],[5,5]),
		new ss.Polygon([10,10],[10,0],[5,5]),
	]);
});
test("The return of polygon.joinSegments",t => {
	t.is(a.joinSegments(1,2),a);
});
test("The result of polygon.joinSegments",t => {
	t.deepEqual(a,new ss.Polygon([0,0],[10,10],[10,0]));
});
test("The return of polygon.findCenter",t => {
	t.deepEqual(a.makeDup().scale(3/10).findCenter(),[2,1]);
});
test("The return of polygon.splitSegment",t => {
	t.is(a.splitSegment(1),a);
});
test("The result of polygon.splitSegment",t => {
	t.deepEqual(a,new ss.Polygon([0,0],[5,5],[10,10],[10,0]));
});
test("The result of polygon.splitSegment (manual point)",t => {
	t.deepEqual(a.splitSegment(1,[0,10]),
	new ss.Polygon([0,0],[0,10],[5,5],[10,10],[10,0]));
});
test("The result of righttriangle",t => {
	t.deepEqual(new ss.RightTriangle(1,2,3,4),new ss.Polygon([1,2],[4,2],[1,6]));
});
test("The result of IsosolesRightTriangle",t => {
	t.deepEqual(new ss.IsosolesRightTriangle(2,3,4),new ss.Polygon([2,3],[6,3],[2,7]));
});
test("The result of Rectagle",t => {
	t.deepEqual(new ss.Rectagle(1,2,3,4),new ss.Polygon([1,2],[4,2],[4,6],[1,6]));
});
test("The result of Square",t => {
	t.deepEqual(new ss.Square(2,3,4),new ss.Polygon([2,3],[6,3],[6,7],[2,7]));
});
a=new ss.Square(0,10,10);
test("The return of transpose",t => {
	t.is(a.transpose(10,0),a);
});
test("The result of transpose",t => {
	t.deepEqual(a.points[0],[10,10]);
});
//Rotate it around itself
test("The return of rotate shape",t => {
	t.is(a.rotate(15,15,Math.PI),a);
});
test("The return of roundpoints",t => {
	t.is(a.roundPoints(),a);
});//round the points
test("The result of rotate",t => {
	t.deepEqual(a.points[1],[10,20]);
});
test("The result of EqualDistShape",t => {
	t.deepEqual(new ss.EqualDistShape(0,0,4,1).roundPoints(),
		new ss.Polygon([1,0],[0,1],[-1,0],[0,-1]));
});
test("The return of rotCenter",t => {
	t.is(a.rotCenter(-Math.PI),a);
});//undo said rotation
test("The result of rotCenter",t => {
	t.deepEqual(a.points[0],[10,10]);
});
a.roundPoints();
test("The return of scale (one argument)",t => {
	t.is(a.scale(4),a);
});
test("The result of scale",t => {
	t.deepEqual(a.points[1],[80,40]);
});
test("The return of scale (two arguments)",t => {
	t.is(a.scale(1/2,1/2),a);
});
test("The result of another scale",t => {
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
test("The result of identical collisionWith (square,square)",t => {
	t.deepEqual(a.collisionWith(b),[[[10,20],[10,10]],[[10,20],[10,10]]]);
});
b.transpose(5,5);
test("The result of good collisionWith (square,square)",t => {
	t.deepEqual(a.collisionWith(b),[[[20,10],[20,20]],[[15,15],[25,15]]]);
});
b.transpose(10,10);
test("The result of failed collisionWith (square,square)",t => {
	t.deepEqual([a.collisionWith(b)],[[]]);
});
b=new ss.Circle(20,20,10);
test("circle.category",t=> {
	t.is(b.category,"circle");
});
test("circle radius (points[0])",t=>{
	t.is(b.points[0],10);
});
test("circle center (points[1])",t=>{
	t.deepEqual(b.points[1],[20,20]);
});
test("circle segment (segments[0])",t=>{
	t.deepEqual(b.segments[0],[0,1]);
});
test("circle.faces",t=>{
	t.deepEqual(b.faces,[[0]]);
});
test("The result of good collisionWith (circle,square)",t => {
	t.deepEqual(a.collisionWith(b),[[[10,20],[10,10]],[10,[20,20]]]);
});
b.transpose(10,10);
test("The result of failed collisionWith (circle,square)",t => {
	t.deepEqual([a.collisionWith(b)],[[]]);
});
a=b.makeDup();
test("The result of identical collisionWith (circle,circle)",t => {
	t.deepEqual(a.collisionWith(b),[[10,[30,30]],[10,[30,30]]]);
});
b.transpose(5,5);
test("The result of good collisionWith (circle,circle)",t => {
	t.deepEqual(a.collisionWith(b),[[10,[30,30]],[10,[35,35]]]);
});
b.transpose(10,100);
test("The result of failed collisionWith (circle,circle)",t => {
	t.deepEqual([a.collisionWith(b)],[[]]);
});//*/
