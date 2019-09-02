"use strict";
exports.__esModule = true;
var ava_1 = require("ava");
var ss = require('./spudslices');
function passiveDeepEqual(t) {
    return function re(a, b, ranAlready, deepnes) {
        var ne = { message: "Not equal (type conflict, depth " + deepnes + ")" };
        for (var i in a) {
            if (typeof a[i] === "function" &&
                typeof b[i] === "function")
                continue;
            if (typeof a[i] !== typeof b[i])
                throw ne;
            if (typeof a[i] === "object")
                re(a[i], b[i], false, deepnes + 1);
            else
                t.is(a[i], b[i]);
        }
        if (!ranAlready)
            re(b, a, true, deepnes);
    };
}
ava_1["default"]("The distance of (0,1) from the origin", function (t) {
    t.is(ss.distance(0, 1), 1);
});
ava_1["default"]("The the radian rotation of (0,1) from (1,0)", function (t) {
    t.is(ss.findRot(0, 1), Math.PI / 2);
});
ava_1["default"]("The the radian rotation of (0,-1) from (1,0)", function (t) {
    t.is(ss.findRot(0, -1), 3 * Math.PI / 2);
});
ava_1["default"]("The x-position of the raw rotation of the point (0,1) pi radians", function (t) {
    t.is(ss.rawRotate(-1, 0, Math.PI)[0], -1);
});
ava_1["default"]("The x-position of .rotate on the point (0,1) pi radians", function (t) {
    t.is(ss.rotate(-1, 0, Math.PI)[0], 1);
});
ava_1["default"]("The type of newShape.dimensions", function (t) {
    t.is(typeof new ss.Shape().dimensions, "number");
});
ava_1["default"]("The type of newShape.category", function (t) {
    t.is(typeof new ss.Shape().category, "string");
});
ava_1["default"]("The type of newShape.points", function (t) {
    t.is(typeof new ss.Shape().points, "object");
    t.is(typeof new ss.Shape().points.length, "number");
});
ava_1["default"]("The type of newShape.pointColor", function (t) {
    t.is(typeof new ss.Shape().pointColor, "string");
});
ava_1["default"]("The type of newShape.pointColors", function (t) {
    t.is(typeof new ss.Shape().pointColors, "object");
    t.is(typeof new ss.Shape().pointColors.length, "number");
});
ava_1["default"]("The type of newShape.pointSize", function (t) {
    t.is(typeof new ss.Shape().pointSize, "number");
});
ava_1["default"]("The type of newShape.segments", function (t) {
    t.is(typeof new ss.Shape().segments, "object");
    t.is(typeof new ss.Shape().segments.length, "number");
});
ava_1["default"]("The type of newShape.segmentColor", function (t) {
    t.is(typeof new ss.Shape().segmentColor, "string");
});
ava_1["default"]("The type of newShape.segmentColors", function (t) {
    t.is(typeof new ss.Shape().segmentColors, "object");
    t.is(typeof new ss.Shape().segmentColors.length, "number");
});
ava_1["default"]("The type of newShape.segmentSize", function (t) {
    t.is(typeof new ss.Shape().segmentSize, "number");
});
ava_1["default"]("The type of newShape.faces", function (t) {
    t.is(typeof new ss.Shape().faces, "object");
    t.is(typeof new ss.Shape().faces.length, "number");
});
ava_1["default"]("The type of newShape.faceColor", function (t) {
    t.is(typeof new ss.Shape().faceColor, "string");
});
ava_1["default"]("The type of newShape.faceColors", function (t) {
    t.is(typeof new ss.Shape().faceColors, "object");
    t.is(typeof new ss.Shape().faceColors.length, "number");
});
//Both of these skipped tests relate to how `__proto__` and `prototype` work. It's really a hassle.
ava_1["default"]("The constructor for shape", function (t) {
    if (typeof ss.Shape.prototype !== "undefined") {
        t.is(ss.Shape, ss.Shape.prototype.constructor);
    }
    else if (typeof ss.Shape.__proto__ !== "undefined") {
        t.is(ss.Shape, ss.Shape.__proto__.constructor);
    }
    else
        t.is(ss.Shape, ss.Shape.constructor);
});
ava_1["default"].skip("The return of makeDup", function (t) {
    var a = new ss.Polygon([10, 20], [93, 23], [23, 93]);
    t.deepEqual(a.makeDup(), a);
});
ava_1["default"]("polygon.category", function (t) {
    var a = new ss.Polygon(10, 20, 93);
    t.is(a.category, "polygon");
});
ava_1["default"]("polygon.faces", function (t) {
    var a = new ss.Polygon(10, 20, 93);
    t.deepEqual(a.faces, [[0, 1, 2]]);
});
ava_1["default"]("polygon.segments", function (t) {
    var a = new ss.Polygon(10, 20, 93);
    t.deepEqual(a.segments, [[2, 0], [0, 1], [1, 2]]);
});
ava_1["default"]("polygon.points", function (t) {
    var a = new ss.Polygon(10, 20, 93);
    t.deepEqual(a.points, [10, 20, 93]);
});
ava_1["default"]("(more) polygon.faces", function (t) {
    var a = new ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
    t.deepEqual(a.faces, [[0, 1, 2, 3]]);
});
ava_1["default"]("(more) polygon.segments", function (t) {
    var a = new ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
    t.deepEqual(a.segments, [[3, 0], [0, 1], [1, 2], [2, 3]]);
});
ava_1["default"]("(more) polygon.points", function (t) {
    var a = new ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
    t.deepEqual(a.points, [[0, 0], [0, 10], [10, 10], [10, 0]]);
});
ava_1["default"]("The return of polygon.convertToTriangles", function (t) {
    var a = new ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
    passiveDeepEqual(t)(a.convertToTriangles(), [
        new ss.Polygon([10, 0], [0, 0], [5, 5]),
        new ss.Polygon([0, 0], [0, 10], [5, 5]),
        new ss.Polygon([0, 10], [10, 10], [5, 5]),
        new ss.Polygon([10, 10], [10, 0], [5, 5]),
    ]);
});
ava_1["default"]("polygon.joinSegments", function (t) {
    var a = new ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
    t.is(a.joinSegments(1, 2), a);
    passiveDeepEqual(t)(a, new ss.Polygon([0, 0], [10, 10], [10, 0]));
});
ava_1["default"]("The return of polygon.findCenter", function (t) {
    var a = new ss.Polygon([0, 0], [10, 10], [10, 0]);
    t.deepEqual(a.makeDup().scale(3 / 10).findCenter(), [2, 1]);
});
ava_1["default"]("The return of polygon.splitSegment", function (t) {
    var a = new ss.Polygon([0, 0], [10, 10], [10, 0]);
    t.is(a.splitSegment(1), a);
    passiveDeepEqual(t)(a, new ss.Polygon([0, 0], [5, 5], [10, 10], [10, 0]));
});
ava_1["default"]("The result of polygon.splitSegment (manual point)", function (t) {
    var a = new ss.Polygon([0, 0], [5, 5], [10, 10], [10, 0]);
    passiveDeepEqual(t)(a.splitSegment(1, [0, 10]), new ss.Polygon([0, 0], [0, 10], [5, 5], [10, 10], [10, 0]));
});
ava_1["default"]("The result of righttriangle", function (t) {
    passiveDeepEqual(t)(new ss.RightTriangle(1, 2, 3, 4), new ss.Polygon([1, 2], [4, 2], [1, 6]));
});
ava_1["default"]("The result of IsosolesRightTriangle", function (t) {
    passiveDeepEqual(t)(new ss.IsosolesRightTriangle(2, 3, 4), new ss.Polygon([2, 3], [6, 3], [2, 7]));
});
ava_1["default"]("The result of Rectagle", function (t) {
    passiveDeepEqual(t)(new ss.Rectagle(1, 2, 3, 4), new ss.Polygon([1, 2], [4, 2], [4, 6], [1, 6]));
});
ava_1["default"]("The result of Square", function (t) {
    passiveDeepEqual(t)(new ss.Square(2, 3, 4), new ss.Polygon([2, 3], [6, 3], [6, 7], [2, 7]));
});
ava_1["default"]("The return of transpose", function (t) {
    var a = new ss.Square(0, 10, 10);
    t.is(a.transpose(10, 0), a);
    t.deepEqual(a.points[0], [10, 10]);
});
//Rotate it around itself
ava_1["default"]("rotate shape", function (t) {
    var a = new ss.Square(0, 10, 10).transpose(10, 0);
    t.is(a.rotate(15, 15, Math.PI), a);
    a.roundPoints();
    t.deepEqual(a.points[1], [10, 20]);
}); //round the points
ava_1["default"]("The return of roundpoints", function (t) {
    var a = new ss.Square(0, 10, 10).transpose(10, 0)
        .rotate(15, 15, Math.PI);
    t.is(a.roundPoints(), a);
}); //round the points
ava_1["default"]("The result of EqualDistShape", function (t) {
    passiveDeepEqual(t)(new ss.EqualDistShape(0, 0, 4, 1).roundPoints(), new ss.Polygon([1, 0], [0, 1], [-1, 0], [-0, -1]));
});
ava_1["default"]("The return of rotCenter", function (t) {
    var a = new ss.Square(10, 10, 10).rotate(15, 15, Math.PI).roundPoints();
    t.is(a.rotCenter(-Math.PI), a);
    a.roundPoints();
    t.deepEqual(a.points[0], [10, 10]);
});
ava_1["default"]("The return of scale (one argument)", function (t) {
    var a = new ss.Square(10, 10, 10);
    t.is(a.scale(4), a);
    a.roundPoints();
    t.deepEqual(a.points[1], [80, 40]);
});
ava_1["default"]("The return of scale (two arguments)", function (t) {
    var a = new ss.Square(10, 10, 10).scale(4);
    t.is(a.scale(1 / 2, 1 / 2), a);
    t.deepEqual(a.points[1], [40, 20]);
});
//claimT("The return of drawPointsOn",[a.drawPointsOn(ctx),a]);
ava_1["default"].todo("The return of drawPointsOn");
//a.transpose(40,0);
//claimT("The return of drawSegmentsOn",[a.drawSegmentsOn(ctx),a]);
ava_1["default"].todo("The return of drawSegmentsOn");
//a.transpose(40,0);
//claimT("The return of drawFacesOn",[a.drawFacesOn(ctx),a]);
ava_1["default"].todo("The return of drawFacesOn");
//a.transpose(40,0);
//claimT("The return of drawOn",[a.drawOn(ctx),a]);
//a.transpose(-40*3,0).scale(1/2);
//var b=a.makeDup();
ava_1["default"]("The type of the value of collisionDetecors", function (t) {
    t.is(typeof ss.collisionDetectors, "object");
});
ava_1["default"]("The type of the value of collisionDetecors.circle", function (t) {
    t.is(typeof ss.collisionDetectors.circle, "object");
});
ava_1["default"]("The type of the value of collisionDetecors.circle.circle", function (t) {
    t.is(typeof ss.collisionDetectors.circle.circle, "function");
});
ava_1["default"]("The type of the value of collisionDetecors.circle.polygon", function (t) {
    t.is(typeof ss.collisionDetectors.circle.polygon, "undefined");
});
ava_1["default"]("The type of the value of collisionDetecors.polygon", function (t) {
    t.is(typeof ss.collisionDetectors.polygon, "object");
});
ava_1["default"]("The type of the value of collisionDetecors.polygon.circle", function (t) {
    t.is(typeof ss.collisionDetectors.polygon.circle, "function");
});
ava_1["default"]("The type of the value of collisionDetecors.polygon.polygon", function (t) {
    t.is(typeof ss.collisionDetectors.polygon.polygon, "function");
});
ava_1["default"]("The result of identical collisionWith (square,square)", function (t) {
    var a = new ss.Square(10, 10, 10), b = new ss.Square(10, 10, 10);
    t.deepEqual(a.collisionWith(b), [[[10, 20], [10, 10]], [[10, 20], [10, 10]]]);
});
ava_1["default"]("The result of good collisionWith (square,square)", function (t) {
    var a = new ss.Square(10, 10, 10), b = new ss.Square(15, 15, 10);
    t.deepEqual(a.collisionWith(b), [[[20, 10], [20, 20]], [[15, 15], [25, 15]]]);
});
ava_1["default"]("The result of failed collisionWith (square,square)", function (t) {
    var a = new ss.Square(10, 10, 10), b = new ss.Square(25, 25, 10);
    t.deepEqual([a.collisionWith(b)], [[]]);
});
ava_1["default"]("circle.category", function (t) {
    var b = new ss.Circle(20, 20, 10);
    t.is(b.category, "circle");
});
ava_1["default"]("circle radius (points[0])", function (t) {
    var b = new ss.Circle(20, 20, 10);
    t.is(b.points[0], 10);
});
ava_1["default"]("circle center (points[1])", function (t) {
    var b = new ss.Circle(20, 20, 10);
    t.deepEqual(b.points[1], [20, 20]);
});
ava_1["default"]("circle segment (segments[0])", function (t) {
    var b = new ss.Circle(20, 20, 10);
    t.deepEqual(b.segments[0], [0, 1]);
});
ava_1["default"]("circle.faces", function (t) {
    var b = new ss.Circle(20, 20, 10);
    t.deepEqual(b.faces, [[0]]);
});
ava_1["default"]("The result of good collisionWith (circle,square)", function (t) {
    var a = new ss.Square(10, 10, 10), b = new ss.Circle(20, 20, 10);
    t.deepEqual(a.collisionWith(b), [[[10, 20], [10, 10]], [10, [20, 20]]]);
});
ava_1["default"]("The result of failed collisionWith (circle,square)", function (t) {
    var a = new ss.Square(10, 10, 10), b = new ss.Circle(30, 30, 10);
    t.deepEqual([a.collisionWith(b)], [[]]);
});
ava_1["default"]("The result of identical collisionWith (circle,circle)", function (t) {
    var a = new ss.Circle(30, 30, 10), b = new ss.Circle(30, 30, 10);
    t.deepEqual(a.collisionWith(b), [[10, [30, 30]], [10, [30, 30]]]);
});
ava_1["default"]("The result of good collisionWith (circle,circle)", function (t) {
    var a = new ss.Circle(30, 30, 10), b = new ss.Circle(35, 35, 10);
    t.deepEqual(a.collisionWith(b), [[10, [30, 30]], [10, [35, 35]]]);
});
ava_1["default"]("The result of failed collisionWith (circle,circle)", function (t) {
    var a = new ss.Circle(30, 30, 10), b = new ss.Circle(45, 135, 10);
    t.deepEqual([a.collisionWith(b)], [[]]);
}); //*/
