import test from 'ava';
import {ss,spudslices} from "../lib/spudslices";
function passiveDeepEqual(t:{is:(A:any,B:any)=>any}) {
	return function re(a:any,b:any,ranAlready?: boolean,deepness?: number) {
		var ne={message:"Not equal (type conflict, depth "+deepness+")"};
		if (typeof deepness==="undefined") deepness=0;
		for(let i in a) {
			if (typeof a[i]==="function"&&
				typeof b[i]==="function") continue;
			if (typeof a[i]!==typeof b[i]) throw ne;
			if (typeof a[i]==="object") re(a[i],b[i],false,deepness+1);
			else t.is(a[i],b[i]);
		}
		if (!ranAlready) re(b,a,true,deepness);
	};
};
test.todo("Make proper untested api finder?");//The coverage tester may do better at this anyway.
/*PANIC MODE: TEST NOT VALID
test("new, untested apis or modules",t => {
	var   actualList:string[]=[],
		shouldbeList:string="version 24780,distance 32500,findRot 30600,rawRotate 40014,rotate 31464,Shape 20999,collisionDetectors 126225,Circle 18492,Polygon 24000,RightTriangle 38130,IsosolesRightTriangle 54093,Rectagle 26650,Square 22908,EqualDistShape 34224";
	for (var i in ss) {
		var strData=i+typeof ss[i]+String(JSON.stringify(ss[i])),
			sum=0;
		for(var ii=0;ii<strData.length;++ii) {//make checksum
			sum+=strData.charCodeAt(0)*(ii+1);
		}
		actualList.push(i+" "+sum);
	}
	t.is(actualList.join(","),shouldbeList);
});//*/
test("`spudslices` is equal to ss",t=> t.is(ss,spudslices));
test("The distance of (0,1) from the origin",t => {
	t.is(ss.distance(0,1),1);
});
test("The distance of (10000,1) from the origin",t => {
	t.is(ss.distance(10000,1),Math.sqrt(100000001));
});
test("The distance of (1,10000) from the origin",t => {
	t.is(ss.distance(1,10000),Math.sqrt(100000001));
});
test("The radian rotation of (0,1) from (1,0)",t => {
	t.is(ss.findRot(0,1),Math.PI/2);
});
test("The radian rotation of (1,1) from (1,0)",t => {
	t.deepEqual(ss.findRot(1,1).toString().split("").slice(0,17),//I am trimming off the last didget as it founds different
			 (Math.PI/4).toString().split("").slice(0,17));
});
test("The radian rotation of (0,-1) from (1,0)",t => {
	t.is(ss.findRot(0,-1),3*Math.PI/2);
});
test("The x-position of the raw rotation of the point (0,1) pi radians",t => {
	t.is(ss.rawRotate(-1,0,Math.PI)[0],-1);
});
test("The x-position of .rotate on the point (0,1) pi radians",t => {
	t.is(ss.rotate(-1,0,Math.PI)[0],1);
});
test("The type of newShape.dimensions",t => {
	t.is(typeof new ss.Shape().dimensions,"number");
});
test("The type of newShape.category",t => {
	t.is(typeof new ss.Shape().category,"string");
});
test("The type of newShape.points",t => {
	t.is(typeof new ss.Shape().points,"object");
	t.is(typeof new ss.Shape().points.length,"number");
});
test("The type of newShape.pointColor",t => {
	t.is(typeof new ss.Shape().pointColor,"string");
});
test("The type of newShape.pointColors",t => {
	t.is(typeof new ss.Shape().pointColors,"object");
	t.is(typeof new ss.Shape().pointColors.length,"number");
});
test("The type of newShape.pointSize",t => {
	t.is(typeof new ss.Shape().pointSize,"number");
});
test("The type of newShape.segments",t => {
	t.is(typeof new ss.Shape().segments,"object");
	t.is(typeof new ss.Shape().segments.length,"number");
});
test("The type of newShape.segmentColor",t => {
	t.is(typeof new ss.Shape().segmentColor,"string");
});
test("The type of newShape.segmentColors",t => {
	t.is(typeof new ss.Shape().segmentColors,"object");
	t.is(typeof new ss.Shape().segmentColors.length,"number");
});
test("The type of newShape.segmentSize",t => {
	t.is(typeof new ss.Shape().segmentSize,"number");
});
test("The type of newShape.faces",t => {
	t.is(typeof new ss.Shape().faces,"object");
	t.is(typeof new ss.Shape().faces.length,"number");
});
test("The type of newShape.faceColor",t => {
	t.is(typeof new ss.Shape().faceColor,"string");
});
test("The type of newShape.faceColors",t => {
	t.is(typeof new ss.Shape().faceColors,"object");
	t.is(typeof new ss.Shape().faceColors.length,"number");
});
//Both of these skipped tests relate to how `__proto__` and `prototype` work. It's really a hassle.
test("The constructor for shape",t => {
	if (typeof ss.Shape.prototype!=="undefined") {
		t.is(ss.Shape,ss.Shape.prototype.constructor);
	}else t.is(ss.Shape,ss.Shape.constructor);
});
test("The return of makeDup",t => {
	var a=new ss.Polygon([10,20],[93,23],[23,93]);
	passiveDeepEqual(t)(a.makeDup(),a);
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
	passiveDeepEqual(t)(a.convertToTriangles(),[
		new ss.Polygon([10,0],[0,0],[5,5]),
		new ss.Polygon([0,0],[0,10],[5,5]),
		new ss.Polygon([0,10],[10,10],[5,5]),
		new ss.Polygon([10,10],[10,0],[5,5]),
	]);
});
test("polygon.joinSegments",t => {
	var a=new ss.Polygon([0,0],[0,10],[10,10],[10,0]);
	t.is(a.joinSegments(1,2),a);
	passiveDeepEqual(t)(a,new ss.Polygon([0,0],[10,10],[10,0]));
});
test("The return of polygon.findCenter",t => {
	var a=new ss.Polygon([0,0],[10,10],[10,0]);
	t.deepEqual(a.makeDup().scale(3/10).findCenter(),[2,1]);
});
test("The return of polygon.splitSegment",t => {
	var a=new ss.Polygon([0,0],[10,10],[10,0]);
	t.is(a.splitSegment(1),a);
	passiveDeepEqual(t)(a,new ss.Polygon([0,0],[5,5],[10,10],[10,0]));
});
test("The result of polygon.splitSegment (manual point)",t => {
	var a=new ss.Polygon([0,0],[5,5],[10,10],[10,0]);
	passiveDeepEqual(t)(a.splitSegment(1,[0,10]),
		new ss.Polygon([0,0],[0,10],[5,5],[10,10],[10,0]));
});
test("The result of righttriangle",t => {
	passiveDeepEqual(t)(new ss.RightTriangle(1,2,3,4),new ss.Polygon([1,2],[4,2],[1,6]));
});
test("The result of IsosolesRightTriangle",t => {
	passiveDeepEqual(t)(new ss.IsosolesRightTriangle(2,3,4),new ss.Polygon([2,3],[6,3],[2,7]));
});
test("The result of Rectagle",t => {
	passiveDeepEqual(t)(new ss.Rectagle(1,2,3,4),new ss.Polygon([1,2],[4,2],[4,6],[1,6]));
});
test("The result of Square",t => {
	passiveDeepEqual(t)(new ss.Square(2,3,4),new ss.Polygon([2,3],[6,3],[6,7],[2,7]));
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
	passiveDeepEqual(t)(new ss.EqualDistShape(0,0,4,1).roundPoints(),
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
test("The type of the value of collisionDetecors",t => {
	t.is(typeof ss.collisionDetectors,"object");
});
test("The type of the value of collisionDetecors.circle",t => {
	t.is(typeof ss.collisionDetectors["circle"],"object");
});
test("The type of the value of collisionDetecors.circle.circle",t => {
	t.is(typeof ss.collisionDetectors["circle"].circle,"function");
});
test("The type of the value of collisionDetecors.circle.polygon",t => {
	t.is(typeof ss.collisionDetectors["circle"].polygon,"undefined");
});
test("The type of the value of collisionDetecors.polygon",t => {
	t.is(typeof ss.collisionDetectors["polygon"],"object");
});
test("The type of the value of collisionDetecors.polygon.circle",t => {
	t.is(typeof ss.collisionDetectors["polygon"].circle,"function");
});
test("The type of the value of collisionDetecors.polygon.polygon",t => {
	t.is(typeof ss.collisionDetectors["polygon"].polygon,"function");
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
