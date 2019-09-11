/**
 * The main namespace for spudslices.
 * @alias [[ss]]
 */
export declare namespace spudslices {
    /**
     * A string that should be identical to that of this repo's package.json
     */
    export const version: string;
    /**
     * Find the distance of (x,y) from the origin (0,0)
     */
    export function distance(x: number, y: number): number;
    /**
     * Find the rotation (in radians) of (x,y) from (0,1)
     */
    export function findRot(x: number, y: number): number;
    /**
     * Get the location of the point, given that the distance is (x,y) and the
     * rotation to offset it by is `rad`
     */
    export function rawRotate(x: number, y: number, rad: number): number[];
    /**
     * Get the location of where a point will be rotated (given `rad`) from it's
     * current location (x,y)
     */
    export function rotate(x: number, y: number, rad: number): number[];
    /**
     * A private interface that represents a 2d canvas instance
     */
    interface ctx {
        fillStyle: string;
        beginPath: () => void;
        arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void;
        fill: () => void;
        strokeStyle: string;
        lineWidth: number;
        moveTo: {
            apply: (arg0: any, arg1: any) => void;
        };
        lineTo: {
            apply: (arg0: any, arg1: any) => void;
        };
        stroke: () => void;
    }
    /**
     * An object that follows the template below in structure.
     * See [[Shape.collisionWith]] for more info
    */
    export var collisionDetectors: {
        [index: string]: {
            [index: string]: (sh: Shape) => any[];
        };
    };
    /**
     * The base class for all shapes.
     */
    export class Shape {
        /**
         * This string is what identifies to `collisionWith` which of the
         * `collisionDetectors` to use.
         */
        category: string;
        /**
         * This identifies to internal mechanisims that this is a 2d object.
         *
         * These internal mechanisims will expect the length of each
         * array inside of `points` to equal this value.
         */
        dimensions: number;
        /**
         * Even though (at time of writing) this is type `any[]` it is one of
         *  two things:
         *
         *  * `number[][]`, given that it is an ordinary point.
         *     (See `dimensions`) for more info.
         *  * `number[]`, given that it is the first point, and the class type
         *    is `Circle` (or one of it's children). In this case, this point is
         *    the radius, and the next point is the center of the circle.
         */
        points: any[];
        /**
         * The color that points are rendered when calling either [[drawOn]] or
         * `drawPointsOn`. Overrided by [[pointColors]].
         */
        pointColor: string;
        /**
         * The color that each point is rendered when calling either [[drawOn]] or
         * [[drawPointsOn]]. Defaults to [[pointColor]].
         */
        pointColors: string[];
        /**
         * The radius that points are rendered when calling either [[drawOn]] or
         * [[drawPointsOn]].
         */
        pointSize: number;
        /**
         * Each item in the array symbolises a segment, where each item within
         * is a number referring to the index of its respective point. The
         * length of the innermost array should always be `2`.
         */
        segments: number[][];
        /**
         * The color that segments are rendered when calling either [[drawOn]] or
         * [[drawSegmentsOn]]. Overrided by [[segmentColors]].
         */
        segmentColor: string;
        /**
         * The color that each segment is rendered when calling either [[drawOn]] or
         * [[drawSegmentsOn]]. Defaults to [[segmentColor]].
         */
        segmentColors: string[];
        /**
         * The with that segments are rendered when calling either [[drawOn]] or
         * [[drawPointsOn]].
         */
        segmentSize: number;
        /**
         * Each item in the array symbolises a face, where each item within is a
         * number referring to the index of its respective segment.
         */
        faces: number[][];
        /**
         * The color that faces are rendered when calling either [[drawOn]] or
         * [[drawFacesOn]]. Overrided by [[faceColors]].
         */
        faceColor: string;
        /**
         * The color that each face is rendered when calling either [[drawOn]] or
         * [[drawFacesOn]]. Defaults to [[faceColor]].
         */
        faceColors: string[];
        /**
         * Draws this [[Shape]] instance on this [[ctx]] instance.
         * @param ctx see the [[ctx]] interface
         */
        drawOn(ctx: ctx): this;
        /**
         * Draws the points of this [[Shape]] instance on this [[ctx]] instance.
         * @param ctx see the [[ctx]] interface
         */
        drawPointsOn(ctx: ctx): this;
        /**
         * Draws the segments of this [[Shape]] instance on this [[ctx]] instance.
         * @param ctx see the [[ctx]] interface
         */
        drawSegmentsOn(ctx: ctx): this;
        /**
         * Draws the faces of this [[Shape]] instance on this [[ctx]] instance.
         * @param ctx see the [[ctx]] interface
         */
        drawFacesOn(ctx: ctx): this;
        /**
         * Transposes the shape by (x,y)
         */
        transpose(x: number, y: number): this;
        /**
         * A basic scale function. (NOTE: Doesn't morph the shape of [[Circle]]
         * elements)
         * @param x How much the shape is scaled along the x-position
         * @param y Inferred to be `x` if missing. If not missing, how
         *   much the shape is scaled along the y-position.
         */
        scale(x: number, y?: number): this;
        /**
         * Rotate the shape around (x,y)
         * @param rad How many radians to rotate it by.
         */
        rotate(x: number, y: number, rad: number): this;
        /**
         * Round all points in the function. (Will also round the radius of a circle)
         * @param otherF Optional function to use instead of `Math.round`
         */
        roundPoints(otherF?: {
            (x: number): number;
        }): this;
        /**
         * Rotate the shape around it's own center.
         * @param rad How far to rotate.
         */
        rotCenter(rad: number): this;
        /**
         * Return a duplicate of this object, removing all pointers to the
         * original.
         */
        makeDup: () => any;
        /**
         * Search for the [[Shape.category]] of both, then run the
         * other's function if it can be found. If not, run this one's.
         *
         * Why? Because I want it to be possible to override one if you really
         * wanted to. This should make it easier.  -- NOTE: NOT ACTUALY HAPPENING RN!
         */
        collisionWith(sh: Shape): any[];
        /**
         * Find the center of (almost) any shape, relative to the points.
         */
        findCenter(): any[];
    }
    /**
     * > Causes minor conflict as [[Shape.points]] [0] is the radius, whereas the
     * > rest of the library expects the type of [[Shape.points]] to be
     * > `number[][]`
     */
    export class Circle extends Shape {
        /**
         * Constuctor for [[Circle]], with circle placed at (x,y)
         * @param r Radius of [[Circle]]
         */
        constructor(x: number, y: number, r: number);
        /**
         * Find the center of a [[Circle]].
         */
        findCenter(): any;
    }
    export class Polygon extends Shape {
        /**
         * @param args Each point of the polygon. Points are pre-connected with
         * segments, and the last point is automatically connected to the first
         * point.
         */
        constructor(...args: any[]);
        /**
         * Makes a point at the center, draws lines from that point to every
         * other point, and ends up cutting up the shape like a pizza.
         *
         * > Requires the shape to have 1 face.
         */
        convertToTriangles: () => Polygon[];
        /**
         * Removes the segments' shared point, then replaces them with a single
         * segment.
         * @param segA: Index of the first segment
         * @param segB: Index of the second segement
         */
        joinSegments: (segA: number, segB: number) => any;
        /**
         * Replaces this segment with two segments, placing a point in the
         * middle, unless overridden.
         * @param segNum Index of segment to be replaced
         * @param sugP Optional location of new point.
         * @param color Not implemented yet, possible way to define the color of
         * the new point, and the colors of the new segments.
         */
        splitSegment: (segNum: number, sugP?: number[] | undefined) => any;
    }
    export class RightTriangle extends Polygon {
        constructor(x: number, y: number, w: number, h: number);
    }
    export class IsosolesRightTriangle extends RightTriangle {
        constructor(x: number, y: number, w: number);
    }
    export class Rectagle extends Polygon {
        constructor(x: number, y: number, w: number, h: number);
    }
    export class Square extends Rectagle {
        constructor(x: number, y: number, w: number);
    }
    /**
     * A way of defining a shape, such as an Octogon.
     *
     * > I don't plan on adding Octogon, Pentagon..., as this is so easy to use.
     */
    export class EqualDistShape extends Polygon {
        /**
         * Make an [[EqualDistShape]], with one point on the right side, due to
         * the way that [[spudslices.rawRotate]] works.
         * @param sideCount Number of sides.
         * @param radius Distance of any point from (x,y)
         */
        constructor(x: number, y: number, sideCount: number, radius: number);
    }
    export {};
}
/**
 * A shorthand alias for your convenience
 * @alias [[spudslices]]
 */
export declare var ss: typeof spudslices;
