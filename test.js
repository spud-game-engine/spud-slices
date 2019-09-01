import test from 'ava';
var ss=require('./spudslices');
function claimTypeof(name,val) {
	test.todo("Make \""+name+"\" into a real test.");
	test("The type of "+name,val);
}
function claimArray(name,actual) {
	claimTypeof(name,t => {
		t.is(typeof actual,"object");
	});
	claimTypeof(name+".length",t => {
		t.is(typeof actual.length,"number");
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
	t.is(typeof new ss.Shape().dimensions,"number");
});
claimTypeof("newShape.category",t => {
	t.is(typeof new ss.Shape().category,"string");
});
claimArray("newShape.points",new ss.Shape().points);
claimTypeof("newShape.pointColor",t => {
	t.is(typeof new ss.Shape().pointColor,"string");
});
claimArray("newShape.pointColors",[new ss.Shape().pointColors]);
claimTypeof("newShape.pointSize",t => {
	t.is(typeof new ss.Shape().pointSize,"number");
});
claimArray("newShape.segments",[new ss.Shape().segments]);
claimTypeof("newShape.segmentColor",t => {
	t.is(typeof new ss.Shape().segmentColor,"string");
});
claimArray("newShape.segmentColors",new ss.Shape().segmentColors);
claimTypeof("newShape.segmentSize",t => {
	t.is(typeof new ss.Shape().segmentSize,"number");
});
claimArray("newShape.faces",new ss.Shape().faces);
claimTypeof("newShape.faceColor",t => {
	t.is(typeof new ss.Shape().faceColor,"string");
});
claimArray("newShape.facesColors",new ss.Shape().faceColors);
test.skip("The constructor for shape",t => {
	t.is(ss.Shape,ss.Shape.prototype.constructor);
});
test.skip("The return of makeDup",t => {
	var a=new ss.Polygon(10,20,93);
	t.deepEqual(a.makeDup(),a);
});
test("polygon.category",t => {
	var a=new ss.Polygon(10,20,93);
	t.is(a.category,"polygon");
});
test("polygon.faces",t => {
	var a=new ss.Polygon(10,20,93);
	t.deepEqual(a.faces,[[0,1,2]]);
});
test("polygon.segments",t => {
	var a=new ss.Polygon(10,20,93);
	t.deepEqual(a.segments,[[2,0],[0,1],[1,2]]);
});
test("polygon.points",t => {
	var a=new ss.Polygon(10,20,93);
	t.deepEqual(a.points,[10,20,93]);
});
test("(more) polygon.faces",t => {
	var a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
	t.deepEqual(a.faces,[[0,1,2,3]]);
});
test("(more) polygon.segments",t => {
	var a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
	t.deepEqual(a.segments,[[3,0],[0,1],[1,2],[2,3]]);
});
test("(more) polygon.points",t => {
	var a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
	t.deepEqual(a.points,[[0,0],[0,10],[10,10],[10,0]]);
});
test("The return of polygon.convertToTriangles",t => {
	var a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
	t.deepEqual(a.convertToTriangles(),[
		new ss.Polygon([10,0],[0,0],[5,5]),
		new ss.Polygon([0,0],[0,10],[5,5]),
		new ss.Polygon([0,10],[10,10],[5,5]),
		new ss.Polygon([10,10],[10,0],[5,5]),
	]);
});
test("polygon.joinSegments",t => {
	var a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
	t.is(a.joinSegments(1,2),a);
	t.deepEqual(a,new ss.Polygon([0,0],[10,10],[10,0]));
});
test("The return of polygon.findCenter",t => {
	var a=new ss.Polygon([0,0],[10,10],[10,0]);
	t.deepEqual(a.makeDup().scale(3/10).findCenter(),[2,1]);
});
test("The return of polygon.splitSegment",t => {
	var a=new ss.Polygon([0,0],[10,10],[10,0]);
	t.is(a.splitSegment(1),a);
	t.deepEqual(a,new ss.Polygon([0,0],[5,5],[10,10],[10,0]));
});
test("The result of polygon.splitSegment (manual point)",t => {
	var a=new ss.Polygon([0,0],[5,5],[10,10],[10,0]);
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
test("The return of transpose",t => {
	var a=new ss.Square(0,10,10);
	t.is(a.transpose(10,0),a);
	t.deepEqual(a.points[0],[10,10]);
});
//Rotate it around itself
test("rotate shape",t => {
	var a=new ss.Square(0,10,10).transpose(10,0);
	t.is(a.rotate(15,15,Math.PI),a);
	a.roundPoints();
	t.deepEqual(a.points[1],[10,20]);
});//round the points
test("The return of roundpoints",t => {
	var a=new ss.Square(0,10,10).transpose(10,0)
		.rotate(15,15,Math.PI);
	t.is(a.roundPoints(),a);
});//round the points
test("The result of EqualDistShape",t => {
	t.deepEqual(new ss.EqualDistShape(0,0,4,1).roundPoints(),
		new ss.Polygon([1,0],[0,1],[-1,0],[-0,-1]));
});
test("The return of rotCenter",t => {
	var a=new ss.Square(10,10,10).rotate(15,15,Math.PI).roundPoints();
	t.is(a.rotCenter(-Math.PI),a);
	a.roundPoints();
	t.deepEqual(a.points[0],[10,10]);
});
test("The return of scale (one argument)",t => {
	var a=new ss.Square(10,10,10);
	t.is(a.scale(4),a);
	a.roundPoints();
	t.deepEqual(a.points[1],[80,40]);
});
test("The return of scale (two arguments)",t => {
	var a=new ss.Square(10,10,10).scale(4);
	t.is(a.scale(1/2,1/2),a);
	t.deepEqual(a.points[1],[40,20]);
});
//claimT("The return of drawPointsOn",[a.drawPointsOn(ctx),a]);
test.todo("The return of drawPointsOn");
//a.transpose(40,0);
//claimT("The return of drawSegmentsOn",[a.drawSegmentsOn(ctx),a]);
test.todo("The return of drawSegmentsOn");
//a.transpose(40,0);
//claimT("The return of drawFacesOn",[a.drawFacesOn(ctx),a]);
test.todo("The return of drawFacesOn");
//a.transpose(40,0);
//claimT("The return of drawOn",[a.drawOn(ctx),a]);
//a.transpose(-40*3,0).scale(1/2);
//var b=a.makeDup();
claimTypeof("The value of collisionDetecors",t => {
	t.is(typeof ss.collisionDetectors,"object");
});
claimTypeof("The value of collisionDetecors.circle",t => {
	t.is(typeof ss.collisionDetectors.circle,"object");
});
claimTypeof("The value of collisionDetecors.circle.circle",t => {
	t.is(typeof ss.collisionDetectors.circle.circle,"function");
});
claimTypeof("The value of collisionDetecors.circle.polygon",t => {
	t.is(typeof ss.collisionDetectors.circle.polygon,"undefined");
});
claimTypeof("The value of collisionDetecors.polygon",t => {
	t.is(typeof ss.collisionDetectors.polygon,"object");
});
claimTypeof("The value of collisionDetecors.polygon.circle",t => {
	t.is(typeof ss.collisionDetectors.polygon.circle,"function");
});
claimTypeof("The value of collisionDetecors.polygon.polygon",t => {
	t.is(typeof ss.collisionDetectors.polygon.polygon,"function");
});
test("The result of identical collisionWith (square,square)",t => {
	var a=new ss.Square(10,10,10),
		b=new ss.Square(10,10,10);
	t.deepEqual(a.collisionWith(b),[[[10,20],[10,10]],[[10,20],[10,10]]]);
});
test("The result of good collisionWith (square,square)",t => {
	var a=new ss.Square(10,10,10),
		b=new ss.Square(15,15,10);
	t.deepEqual(a.collisionWith(b),[[[20,10],[20,20]],[[15,15],[25,15]]]);
});
test("The result of failed collisionWith (square,square)",t => {
	var a=new ss.Square(10,10,10),
		b=new ss.Square(25,25,10);
	t.deepEqual([a.collisionWith(b)],[[]]);
});
test("circle.category",t=> {
	var b=new ss.Circle(20,20,10);
	t.is(b.category,"circle");
});
test("circle radius (points[0])",t=>{
	var b=new ss.Circle(20,20,10);
	t.is(b.points[0],10);
});
test("circle center (points[1])",t=>{
	var b=new ss.Circle(20,20,10);
	t.deepEqual(b.points[1],[20,20]);
});
test("circle segment (segments[0])",t=>{
	var b=new ss.Circle(20,20,10);
	t.deepEqual(b.segments[0],[0,1]);
});
test("circle.faces",t=>{
	var b=new ss.Circle(20,20,10);
	t.deepEqual(b.faces,[[0]]);
});
test("The result of good collisionWith (circle,square)",t => {
	var a=new ss.Square(10,10,10),
		b=new ss.Circle(20,20,10);
	t.deepEqual(a.collisionWith(b),[[[10,20],[10,10]],[10,[20,20]]]);
});
test("The result of failed collisionWith (circle,square)",t => {
	var a=new ss.Square(10,10,10),
		b=new ss.Circle(30,30,10);
	t.deepEqual([a.collisionWith(b)],[[]]);
});
test("The result of identical collisionWith (circle,circle)",t => {
	var a=new ss.Circle(30,30,10),
		b=new ss.Circle(30,30,10);
	t.deepEqual(a.collisionWith(b),[[10,[30,30]],[10,[30,30]]]);
});
test("The result of good collisionWith (circle,circle)",t => {
	var a=new ss.Circle(30,30,10),
		b=new ss.Circle(35,35,10);
	t.deepEqual(a.collisionWith(b),[[10,[30,30]],[10,[35,35]]]);
});
test("The result of failed collisionWith (circle,circle)",t => {
	var a=new ss.Circle(30,30,10),
		b=new ss.Circle(45,135,10);
	t.deepEqual([a.collisionWith(b)],[[]]);
});//*/
