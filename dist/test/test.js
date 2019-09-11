"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
/// <reference types="intern"/>
const { suite, test } = intern.getPlugin('interface.tdd');
const { assert } = intern.getPlugin('chai');
const spudslices_1 = require("../lib/spudslices");
function passiveDeepEqual() {
    return function re(a, b, ranAlready, deepness) {
        var ne = { message: "Not equal (type conflict, depth " + deepness + ")" };
        if (typeof deepness === "undefined")
            deepness = 0;
        for (let i in a) {
            var toA = typeof a[i];
            if (toA !== typeof b[i])
                throw ne;
            if (toA === "function")
                continue;
            if (toA === "object")
                re(a[i], b[i], false, deepness + 1);
            else
                assert.equal(a[i], b[i]);
        }
        if (!ranAlready)
            re(b, a, true, deepness);
    };
}
;
//TODO: USE `assert.changes` for scaling, other effects, etc.
//(see also changesBy doesNotChange changesButNotBy increases increacesBy
//doesNotIncrease increacesButNotBy decreaces [apply same iterations], )
suite("library config", () => {
    test("`spudslices` is equal to ss", () => assert.equal(spudslices_1.ss, spudslices_1.spudslices));
});
suite("math section", () => {
    test("The distance of (0,1) from the origin", () => {
        assert.equal(spudslices_1.ss.distance(0, 1), 1);
    });
    test("The distance of (10000,1) from the origin", () => {
        assert.equal(spudslices_1.ss.distance(10000, 1), Math.sqrt(100000001));
    });
    test("The distance of (1,10000) from the origin", () => {
        assert.equal(spudslices_1.ss.distance(1, 10000), Math.sqrt(100000001));
    });
    test("The radian rotation of (0,1) from (1,0)", () => {
        assert.equal(spudslices_1.ss.findRot(0, 1), Math.PI / 2);
    });
    test("The radian rotation of (1,1) from (1,0)", () => {
        assert.approximately(spudslices_1.ss.findRot(1, 1), Math.PI / 4, 0.000000000000001);
    });
    test("The radian rotation of (0,-1) from (1,0)", () => {
        assert.equal(spudslices_1.ss.findRot(0, -1), 3 * Math.PI / 2);
    });
    test("The x-position of the raw rotation of the point (0,1) pi radians", () => {
        assert.equal(spudslices_1.ss.rawRotate(-1, 0, Math.PI)[0], -1);
    });
    test("The x-position of .rotate on the point (0,1) pi radians", () => {
        assert.equal(spudslices_1.ss.rotate(-1, 0, Math.PI)[0], 1);
    });
});
suite("shape root class", () => {
    test("The type of newShape.dimensions", () => {
        assert.isNumber(new spudslices_1.ss.Shape().dimensions);
    });
    test("The type of newShape.category", () => {
        assert.isString(new spudslices_1.ss.Shape().category);
    });
    test("The type of newShape.points", () => {
        assert.isArray(new spudslices_1.ss.Shape().points);
    });
    test("The type of newShape.pointColor", () => {
        assert.isString(new spudslices_1.ss.Shape().pointColor);
    });
    test("The type of newShape.pointColors", () => {
        assert.isArray(new spudslices_1.ss.Shape().pointColors);
    });
    test("The type of newShape.pointSize", () => {
        assert.isNumber(new spudslices_1.ss.Shape().pointSize);
    });
    test("The type of newShape.segments", () => {
        assert.isArray(new spudslices_1.ss.Shape().segments);
    });
    test("The type of newShape.segmentColor", () => {
        assert.isString(new spudslices_1.ss.Shape().segmentColor);
    });
    test("The type of newShape.segmentColors", () => {
        assert.isArray(new spudslices_1.ss.Shape().segmentColors);
    });
    test("The type of newShape.segmentSize", () => {
        assert.isNumber(new spudslices_1.ss.Shape().segmentSize);
    });
    test("The type of newShape.faces", () => {
        assert.isArray(new spudslices_1.ss.Shape().faces);
    });
    test("The type of newShape.faceColor", () => {
        assert.isString(new spudslices_1.ss.Shape().faceColor);
    });
    test("The type of newShape.faceColors", () => {
        assert.isArray(new spudslices_1.ss.Shape().faceColors);
    });
    //Both of these skipped tests relate to how `__proto__` and `prototype` work. It's really a hassle.
    test("The constructor for shape", () => {
        if (typeof spudslices_1.ss.Shape.prototype !== "undefined") {
            assert.equal(spudslices_1.ss.Shape, spudslices_1.ss.Shape.prototype.constructor);
        }
        else
            assert.equal(spudslices_1.ss.Shape, spudslices_1.ss.Shape.constructor);
    });
    test("The return of makeDup", () => {
        var a = new spudslices_1.ss.Polygon([10, 20], [93, 23], [23, 93]), b = a.makeDup();
        passiveDeepEqual()(b, a);
        assert.instanceOf(b, spudslices_1.ss.Polygon);
        assert.instanceOf(b, spudslices_1.ss.Shape);
        assert.notInstanceOf(b, spudslices_1.ss.Circle);
    });
    test("The return of makeDup on a Circle", () => {
        var a = new spudslices_1.ss.Circle(100, 40, 30), b = a.makeDup();
        passiveDeepEqual()(b, a);
        assert.instanceOf(b, spudslices_1.ss.Circle);
        assert.instanceOf(b, spudslices_1.ss.Shape);
        assert.notInstanceOf(b, spudslices_1.ss.Polygon);
    });
});
suite("polygon class", () => {
    test("polygon.category", () => {
        var a = new spudslices_1.ss.Polygon(10, 20, 93);
        assert.equal(a.category, "polygon");
    });
    test("polygon.faces", () => {
        var a = new spudslices_1.ss.Polygon(10, 20, 93);
        assert.deepEqual(a.faces, [[0, 1, 2]]);
    });
    test("polygon.segments", () => {
        var a = new spudslices_1.ss.Polygon(10, 20, 93);
        assert.deepEqual(a.segments, [[2, 0], [0, 1], [1, 2]]);
    });
    test("polygon.points", () => {
        var a = new spudslices_1.ss.Polygon(10, 20, 93);
        assert.deepEqual(a.points, [10, 20, 93]);
    });
    test("(more) polygon.faces", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
        assert.deepEqual(a.faces, [[0, 1, 2, 3]]);
    });
    test("(more) polygon.segments", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
        assert.deepEqual(a.segments, [[3, 0], [0, 1], [1, 2], [2, 3]]);
    });
    test("(more) polygon.points", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
        assert.deepEqual(a.points, [[0, 0], [0, 10], [10, 10], [10, 0]]);
    });
    test("The return of polygon.convertToTriangles", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
        passiveDeepEqual()(a.convertToTriangles(), [
            new spudslices_1.ss.Polygon([10, 0], [0, 0], [5, 5]),
            new spudslices_1.ss.Polygon([0, 0], [0, 10], [5, 5]),
            new spudslices_1.ss.Polygon([0, 10], [10, 10], [5, 5]),
            new spudslices_1.ss.Polygon([10, 10], [10, 0], [5, 5]),
        ]);
    });
    test("polygon.joinSegments", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [0, 10], [10, 10], [10, 0]);
        assert.equal(a.joinSegments(1, 2), a);
        passiveDeepEqual()(a, new spudslices_1.ss.Polygon([0, 0], [10, 10], [10, 0]));
    });
    test("The return of polygon.findCenter", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [10, 10], [10, 0]);
        assert.deepEqual(a.makeDup().scale(3 / 10).findCenter(), [2, 1]);
    });
    test("The return of polygon.splitSegment", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [10, 10], [10, 0]);
        assert.equal(a.splitSegment(1), a);
        passiveDeepEqual()(a, new spudslices_1.ss.Polygon([0, 0], [5, 5], [10, 10], [10, 0]));
    });
    test("The result of polygon.splitSegment (manual point)", () => {
        var a = new spudslices_1.ss.Polygon([0, 0], [5, 5], [10, 10], [10, 0]);
        passiveDeepEqual()(a.splitSegment(1, [0, 10]), new spudslices_1.ss.Polygon([0, 0], [0, 10], [5, 5], [10, 10], [10, 0]));
    });
});
suite("Polygon dirivitiaves", () => {
    test("The result of righttriangle", () => {
        passiveDeepEqual()(new spudslices_1.ss.RightTriangle(1, 2, 3, 4), new spudslices_1.ss.Polygon([1, 2], [4, 2], [1, 6]));
    });
    test("The result of IsosolesRightTriangle", () => {
        passiveDeepEqual()(new spudslices_1.ss.IsosolesRightTriangle(2, 3, 4), new spudslices_1.ss.Polygon([2, 3], [6, 3], [2, 7]));
    });
    test("The result of Rectagle", () => {
        passiveDeepEqual()(new spudslices_1.ss.Rectagle(1, 2, 3, 4), new spudslices_1.ss.Polygon([1, 2], [4, 2], [4, 6], [1, 6]));
    });
    test("The result of Square", () => {
        passiveDeepEqual()(new spudslices_1.ss.Square(2, 3, 4), new spudslices_1.ss.Polygon([2, 3], [6, 3], [6, 7], [2, 7]));
    });
});
suite("core functionality", () => {
    test("The return of transpose", () => {
        var a = new spudslices_1.ss.Square(0, 10, 10);
        assert.equal(a.transpose(10, 0), a);
        assert.deepEqual(a.points[0], [10, 10]);
    });
    //Rotate it around itself
    test("rotate shape", () => {
        var a = new spudslices_1.ss.Square(0, 10, 10).transpose(10, 0);
        assert.equal(a.rotate(15, 15, Math.PI), a);
        a.roundPoints();
        assert.deepEqual(a.points[1], [10, 20]);
    }); //round the points
    test("The return of roundpoints", () => {
        var a = new spudslices_1.ss.Square(0, 10, 10).transpose(10, 0)
            .rotate(15, 15, Math.PI);
        assert.equal(a.roundPoints(), a);
    }); //round the points
    test("The result of EqualDistShape", () => {
        passiveDeepEqual()(new spudslices_1.ss.EqualDistShape(0, 0, 4, 1).roundPoints(), new spudslices_1.ss.Polygon([1, 0], [0, 1], [-1, 0], [-0, -1]));
    });
    test("The return of rotCenter", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10).rotate(15, 15, Math.PI).roundPoints();
        assert.equal(a.rotCenter(-Math.PI), a);
        a.roundPoints();
        assert.deepEqual(a.points[0], [10, 10]);
    });
    test("The return of scale (one argument)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10);
        assert.equal(a.scale(4), a);
        a.roundPoints();
        assert.deepEqual(a.points[1], [80, 40]);
    });
    test("The return of scale (two arguments)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10).scale(4);
        assert.equal(a.scale(1 / 2, 1 / 2), a);
        assert.deepEqual(a.points[1], [40, 20]);
    });
    //claimT("The return of drawPointsOn",[a.drawPointsOn(ctx),a]);
    //test.todo("The return of drawPointsOn"/*,() => {
    //	var a=Square(0,0,10,10);
    //	tesassert.equal(a.drawPointsOn(window.))
    //}*/);
    //a.transpose(40,0);
    //claimT("The return of drawSegmentsOn",[a.drawSegmentsOn(ctx),a]);
    //test.todo("The return of drawSegmentsOn");
    //a.transpose(40,0);
    //claimT("The return of drawFacesOn",[a.drawFacesOn(ctx),a]);
    //test.todo("The return of drawFacesOn");
    //a.transpose(40,0);
    //claimT("The return of drawOn",[a.drawOn(ctx),a]);
    //a.transpose(-40*3,0).scale(1/2);
    //var b=a.makeDup();
    test("The type of the value of collisionDetecors", () => {
        assert.isObject(spudslices_1.ss.collisionDetectors);
    });
    test("The type of the value of collisionDetecors.circle", () => {
        assert.isObject(spudslices_1.ss.collisionDetectors["circle"]);
    });
    test("The type of the value of collisionDetecors.circle.circle", () => {
        assert.isFunction(spudslices_1.ss.collisionDetectors["circle"].circle);
    });
    test("The type of the value of collisionDetecors.circle.polygon", () => {
        assert.isUndefined(spudslices_1.ss.collisionDetectors["circle"].polygon);
    });
    test("The type of the value of collisionDetecors.polygon", () => {
        assert.isObject(spudslices_1.ss.collisionDetectors["polygon"]);
    });
    test("The type of the value of collisionDetecors.polygon.circle", () => {
        assert.isFunction(spudslices_1.ss.collisionDetectors["polygon"].circle);
    });
    test("The type of the value of collisionDetecors.polygon.polygon", () => {
        assert.isFunction(spudslices_1.ss.collisionDetectors["polygon"].polygon);
    });
    test("The result of identical collisionWith (square,square)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10), b = new spudslices_1.ss.Square(10, 10, 10);
        assert.deepEqual(a.collisionWith(b), [[[10, 20], [10, 10]], [[10, 20], [10, 10]]]);
    });
    test("The result of good collisionWith (square,square)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10), b = new spudslices_1.ss.Square(15, 15, 10);
        assert.deepEqual(a.collisionWith(b), [[[20, 10], [20, 20]], [[15, 15], [25, 15]]]);
    });
    test("The result of failed collisionWith (square,square)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10), b = new spudslices_1.ss.Square(25, 25, 10);
        assert.deepEqual([a.collisionWith(b)], [[]]);
    });
    test("The result of good collisionWith (circle,square)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10), b = new spudslices_1.ss.Circle(20, 20, 10);
        assert.deepEqual(a.collisionWith(b), [[[10, 20], [10, 10]], [10, [20, 20]]]);
    });
    test("The result of failed collisionWith (circle,square)", () => {
        var a = new spudslices_1.ss.Square(10, 10, 10), b = new spudslices_1.ss.Circle(30, 30, 10);
        assert.deepEqual([a.collisionWith(b)], [[]]);
    });
    test("The result of identical collisionWith (circle,circle)", () => {
        var a = new spudslices_1.ss.Circle(30, 30, 10), b = new spudslices_1.ss.Circle(30, 30, 10);
        assert.deepEqual(a.collisionWith(b), [[10, [30, 30]], [10, [30, 30]]]);
    });
    test("The result of good collisionWith (circle,circle)", () => {
        var a = new spudslices_1.ss.Circle(30, 30, 10), b = new spudslices_1.ss.Circle(35, 35, 10);
        assert.deepEqual(a.collisionWith(b), [[10, [30, 30]], [10, [35, 35]]]);
    });
    test("The result of failed collisionWith (circle,circle)", () => {
        var a = new spudslices_1.ss.Circle(30, 30, 10), b = new spudslices_1.ss.Circle(45, 135, 10);
        assert.deepEqual([a.collisionWith(b)], [[]]);
    }); //*/
});
suite("circle class", () => {
    test("circle.category", () => {
        var b = new spudslices_1.ss.Circle(20, 20, 10);
        assert.equal(b.category, "circle");
    });
    test("circle radius (points[0])", () => {
        var b = new spudslices_1.ss.Circle(20, 20, 10);
        assert.equal(b.points[0], 10);
    });
    test("circle center (points[1])", () => {
        var b = new spudslices_1.ss.Circle(20, 20, 10);
        assert.deepEqual(b.points[1], [20, 20]);
    });
    test("circle segment (segments[0])", () => {
        var b = new spudslices_1.ss.Circle(20, 20, 10);
        assert.deepEqual(b.segments[0], [0, 1]);
    });
    test("circle.faces", () => {
        var b = new spudslices_1.ss.Circle(20, 20, 10);
        assert.deepEqual(b.faces, [[0]]);
    });
});
