/**
 * The main namespace for spudslices.
 */
export namespace spudslices{
	export const version:string="1.2.3";
	/**
	 * Find the distance of (x,y) from the origin (0,0)
	 */
	export function distance(x:number,y:number) {
		return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	};
	/**
	 * Find the rotation (in radians) of (x,y) from (0,1)
	 */
	export function findRot(x:number,y:number) {
		var dist=distance(x,y),
			pos=[x/dist,
				y/dist];
		if(pos[1]<0) return(2*Math.PI)-Math.acos(pos[0]);//if it is > pi radians
		return Math.acos(pos[0]);
	};
	/**
	 * Get the location of the point, given that the distance is (x,y) and the
	 * rotation to offset it by is `rad`
	 */
	export function rawRotate(x:number,y:number,rad:number) {
		var dist=distance(x,y);
		return [
			dist*(Math.cos(rad)),
			dist*(Math.sin(rad)),
		];
	};
	/**
	 * Get the location of where a point will be rotated (given `rad`) from it's
	 * current location (x,y)
	 */
	export function rotate (x: number,y: number,rad: number) {
		return rawRotate(x,y,rad+findRot(x,y));
	};
	/**
	 * A private interface that represents a 2d canvas instance
	 */
	interface ctx{
		fillStyle: string;
		beginPath: () => void;
		arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void;
		fill: () => void;
		strokeStyle: string;
		lineWidth: number;
		moveTo: { apply: (arg0: any, arg1: any) => void; };
		lineTo: { apply: (arg0: any, arg1: any) => void; };
		stroke: () => void;
	};
	/**
	 * An object that follows the template below in structure.
	 * See [[Shape.collisionWith]] for more info
	*/
	export var collisionDetectors:{
		[index:string]:{//Shape name
			[index:string]://Another shape name
				(sh:Shape) => any[]
		}
	} = {};
	/**
	 * The base class for all shapes.
	 */
	export class Shape {
		/**
		 * This string is what identifies to `collisionWith` which of the
		 * `collisionDetectors` to use.
		 */
		category:string="shape";//used for collisions
		/**
		 * This identifies to internal mechanisims that this is a 2d object.
		 * 
		 * These internal mechanisims will expect the length of each
		 * array inside of `points` to equal this value.
		 */
		dimensions=2;
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
		points:any[]=[];
		/**
		 * The color that points are rendered when calling either [[drawOn]] or 
		 * `drawPointsOn`. Overrided by [[pointColors]].
		 */
		pointColor="#ff0000";
		/**
		 * The color that each point is rendered when calling either [[drawOn]] or 
		 * [[drawPointsOn]]. Defaults to [[pointColor]].
		 */
		pointColors:string[]=[];
		/**
		 * The radius that points are rendered when calling either [[drawOn]] or 
		 * [[drawPointsOn]].
		 */
		pointSize=5;
		/**
		 * Each item in the array symbolises a segment, where each item within
		 * is a number referring to the index of its respective point. The
		 * length of the innermost array should always be `2`.
		 */
		segments:number[][]=[];
		/**
		 * The color that segments are rendered when calling either [[drawOn]] or 
		 * [[drawSegmentsOn]]. Overrided by [[segmentColors]].
		 */
		segmentColor="#00ff00";
		/**
		 * The color that each segment is rendered when calling either [[drawOn]] or 
		 * [[drawSegmentsOn]]. Defaults to [[segmentColor]].
		 */
		segmentColors:string[]=[];
		/**
		 * The with that segments are rendered when calling either [[drawOn]] or 
		 * [[drawPointsOn]].
		 */
		segmentSize=3;
		/**
		 * Each item in the array symbolises a face, where each item within is a
		 * number referring to the index of its respective segment.
		 */
		faces:number[][]=[];//points to segments
		/**
		 * The color that faces are rendered when calling either [[drawOn]] or 
		 * [[drawFacesOn]]. Overrided by [[faceColors]].
		 */
		faceColor="#0000ff";
		/**
		 * The color that each face is rendered when calling either [[drawOn]] or 
		 * [[drawFacesOn]]. Defaults to [[faceColor]].
		 */
		faceColors:string[]=[];
		/**
		 * Draws this [[Shape]] instance on this [[ctx]] instance.
		 * @param ctx see the [[ctx]] interface
		 */
		drawOn(ctx: ctx) {
			this.drawFacesOn(ctx);
			this.drawSegmentsOn(ctx);
			this.drawPointsOn(ctx);
			return this;
		};
		/**
		 * Draws the points of this [[Shape]] instance on this [[ctx]] instance.
		 * @param ctx see the [[ctx]] interface
		 */
		drawPointsOn(ctx: ctx) {
			ctx.fillStyle=this.pointColor;
			ctx.beginPath();
			for (var i=0; i<this.points.length; i++) {
				if (typeof this.pointColors[i]=="string")
					ctx.fillStyle=this.pointColors[i];
				ctx.beginPath();
				ctx.arc(this.points[i][0], this.points[i][1],
					this.pointSize, 0, 2 * Math.PI);
				ctx.fill();
			}
			//ctx.closePath();
			return this;
		};
		/**
		 * Draws the segments of this [[Shape]] instance on this [[ctx]] instance.
		 * @param ctx see the [[ctx]] interface
		 */
		drawSegmentsOn(ctx: ctx) {
			ctx.strokeStyle=this.segmentColor;
			ctx.lineWidth=this.segmentSize;
			ctx.beginPath();
			for (var i=0; i<this.segments.length; i++) {
				var seg=this.segments[i];
				if (typeof this.segmentColors[i]=="string")
					ctx.strokeStyle=this.segmentColors[i];
				if (typeof this.points[seg[0]]=="number") {
					ctx.arc(this.points[seg[1]][0], this.points[seg[1]][1],
						this.points[seg[0]], 0, 2 * Math.PI);
				}else{
					ctx.moveTo.apply(ctx,this.points[seg[0]]);
					ctx.lineTo.apply(ctx,this.points[seg[1]]);
				}
			}
			//ctx.lineTo.apply(ctx,this.points[this.segments[0][1]]);
			ctx.stroke();
			//ctx.closePath();
			return this;
		};
		/**
		 * Draws the faces of this [[Shape]] instance on this [[ctx]] instance.
		 * @param ctx see the [[ctx]] interface
		 */
		drawFacesOn(ctx: ctx) {
			ctx.fillStyle=this.faceColor;
			ctx.beginPath();
			for (var fac=0; fac<this.faces.length; fac++) {
				for (var i=0; i<this.faces[fac].length; i++) {
					if (typeof this.faceColors[fac]=="string")
						ctx.fillStyle=this.faceColors[i];
					var seg=this.segments[this.faces[fac][i]];
					if (typeof this.points[seg[0]]=="number") {
						ctx.arc(this.points[seg[1]][0], this.points[seg[1]][1],
							this.points[seg[0]], 0, 2 * Math.PI);
					}else{
						if (i===0) ctx.moveTo.apply(ctx,this.points[seg[0]]);
						ctx.lineTo.apply(ctx,this.points[seg[1]]);
					}
				}
			}
			ctx.fill();
			//ctx.closePath();
			return this;
		};
		/**
		 * Transposes the shape by (x,y)
		 */
		transpose(x: number,y: number) {
			for (var i=0; i<this.points.length; i++) {
				if (typeof this.points[i]=="number") continue;
				this.points[i][0]+=x;
				this.points[i][1]+=y;
			}
			return this;
		};
		/**
		 * A basic scale function. (NOTE: Doesn't morph the shape of [[Circle]]
		 * elements)
		 * @param x How much the shape is scaled along the x-position
		 * @param y Inferred to be `x` if missing. If not missing, how
		 *   much the shape is scaled along the y-position.
		 */
		scale(x: number,y?: number) {
			if(typeof y==="undefined") y=x;
			for(var i=0;i<this.points.length;i++) {
				if (typeof this.points[i]=="number") {
					this.points[i]*=((x+y)/2);
					continue;
				}
				this.points[i][0]*=x;
				this.points[i][1]*=y;
			}
			return this;
		};
		/**
		 * Rotate the shape around (x,y)
		 * @param rad How many radians to rotate it by.
		 */
		rotate(x: number,y: number,rad: number) {
			this.transpose(-x,-y);//to Center
			for (var i=0;i<this.points.length;i++) {
				if (typeof this.points[i]=="number") continue;
				this.points[i]=rotate(this.points[i][0],this.points[i][1],rad);
			}
			this.transpose(x,y);//from Center
			return this;
		};
		/**
		 * Round all points in the function. (Will also round the radius of a circle)
		 * @param otherF Optional function to use instead of `Math.round`
		 */
		roundPoints(otherF?: {(x: number): number}) {
			if (typeof otherF==="undefined") {
				otherF=Math.round;
			}
			for (var i=0;i<this.points.length;i++) {
				if (typeof this.points[i]=="number")
					this.points[i]=otherF(this.points[i]);
				for (var ii=0;ii<this.points[i].length;ii++)
					this.points[i][ii]=otherF(this.points[i][ii]);
			}
			return this;
		};
		/**
		 * Rotate the shape around it's own center.
		 * @param rad How far to rotate.
		 */
		rotCenter(rad: number) {
			var pos=this.findCenter();
			return this.rotate(pos[0],pos[1],rad);
		};
		/**
		 * Return a duplicate of this object, removing all pointers to the original..
		 */
		makeDup=function() {
			var s=new this.__proto__.constructor();
			for (var i in this) {
				s[i]=this[i];
			}
			s.category=this.category;
			s.points=[];
			for (var iterator=0,ii: number; iterator<this.points.length;iterator++) {
				if (typeof this.points[iterator]=="number") s.points[iterator]=this.points[iterator];
				else {
					s.points.push([]);
					for (ii=0; ii<this.points[iterator].length; ii++) {
						s.points[iterator][ii]=this.points[iterator][ii];
					}
				}
			}
			s.pointColor=this.pointColor+"";
			s.pointColors=[];
			for (iterator=0; iterator<this.pointColors.length;iterator++) {
				if (typeof this.pointColors[iterator]=="number") s.pointColors[iterator]=this.pointColors[iterator];
				else {
					s.pointColors.push([]);
					for (ii=0;ii< this.pointColors[iterator].length; ii++) {
						s.pointColors[iterator][ii]=this.pointColors[iterator][ii];
					}
				}
			}
			s.segments=[];
			for (iterator=0; iterator<this.segments.length;iterator++) {
				s.segments.push([]);
				for (ii=0;ii< this.segments[iterator].length; ii++) {
					s.segments[iterator][ii]=this.segments[iterator][ii];
				}
			}
			s.segmentColor=this.segmentColor+"";
			s.segmentColors=[];
			for (iterator=0; iterator<this.segmentColors.length;iterator++) {
				s.segmentColors.push([]);
				for (ii=0;ii< this.segmentColors[iterator].length; ii++) {
					s.segmentColors[iterator][ii]=this.segmentColors[iterator][ii];
				}
			}
			s.faces=[];
			for (iterator=0; iterator<this.faces.length;iterator++) {
				s.faces.push([]);
				for (ii=0;ii< this.faces[iterator].length; ii++) {
					s.faces[iterator][ii]=this.faces[iterator][ii];
				}
			}
			s.faceColor=this.faceColor+"";
			s.faceColors=[];
			for (iterator=0; iterator<this.faceColors.length;iterator++) {
				s.faceColors.push([]);
				for (ii=0;ii< this.faceColors[iterator].length; ii++) {
					s.faceColors[iterator][ii]=this.faceColors[iterator][ii];
				}
			}
			return s;
		};
		/**
		 * Search for the [[Shape.category]] of both, then run the
		 * other's function if it can be found. If not, run this one's.
		 *
		 * Why? Because I want it to be possible to override one if you really
		 * wanted to. This should make it easier.  -- NOTE: NOT ACTUALY HAPPENING RN!
		 */
		collisionWith(sh:Shape) {
			if (typeof collisionDetectors[this.category]!=="undefined"&&
				typeof collisionDetectors[this.category][sh.category]!==
					"undefined") {
				return collisionDetectors[this.category]
					[sh.category].call(this,sh);
			}else if (typeof collisionDetectors[sh.category]!=="undefined"&&
				typeof collisionDetectors[sh.category][this.category]!==
					"undefined") {
				var tmp=collisionDetectors[sh.category]
					[this.category].call(sh,this);
				if (tmp.length===0) return [];
				else return [tmp[1],tmp[0]];
			}else throw "Could not find shape collision detector for a \""+
				this.category+"\"-\""+sh.category+"\" collision.";
		};
		/**
		 * Find the center of (almost) any shape, relative to the points.
		 */
		findCenter() {
			var center=new Array(this.dimensions);
			for (var dem=0;dem<this.dimensions;dem++) {
				for (var pointi=0,avrge=0;pointi<this.points.length;pointi++) {
					avrge+=this.points[pointi][dem];
				}
				center[dem]=avrge/this.points.length;
			}
			return center;
		};
	};
	/**
	 * > Causes minor conflict as [[Shape.points]] [0] is the radius, whereas the
	 * > rest of the library expects the type of [[Shape.points]] to be
	 * > `number[][]`
	 */
	export class Circle extends Shape{
		/**
		 * Constuctor for [[Circle]], with circle placed at (x,y)
		 * @param r Radius of [[Circle]]
		 */
		constructor(x:number,y:number,r:number) {
			super();
			this.category="circle";
			this.points[0]=r;
			this.points[1]=[x,y];
			this.segments[0]=[0,1];
			this.faces[0]=[0];
		}
		/**
		 * Find the center of a [[Circle]].
		 */
		findCenter() {
			return this.points[1];
		};
	}
	collisionDetectors["circle"]={};
	collisionDetectors["circle"].circle=function(sh: Circle|Shape) {
		let ths:Circle=this.makeDup(),//make sure that the original ones aren't altered
			sha:Circle=sh.makeDup();
		//iterate through each segment on ths
		for (var thsPt=0;thsPt<ths.segments.length;thsPt++) {
			//variables must be declared here so they are properly global
			var seg=ths.segments[thsPt],//ths's current segment
				thsRadius=ths.points[seg[0]],
				thsX=ths.points[seg[1]][0],
				thsY=ths.points[seg[1]][1];
			//iterate through each segment on sha
			for (var shaPt=0;shaPt<sha.segments.length;shaPt++) {
				var segS=sha.segments[shaPt],/*sha's current segment */
					shaRadius=sha.points[segS[0]],
					shaX=sha.points[segS[1]][0],
					shaY=sha.points[segS[1]][1];
				if ((   (   distance(
								thsX-shaX,
								thsY-shaY
							)-Math.abs(shaRadius)
						)-Math.abs(thsRadius)
					)<=0) return [[this.points[seg [0]],this.points[seg [1]]],
								[  sh.points[segS[0]],  sh.points[segS[1]]]];
			}
		}
		return [];
	};
	export class Polygon extends Shape {
		/**
		 * @param args Each point of the polygon. Points are pre-connected with
		 * segments, and the last point is automatically connected to the first
		 * point.
		 */
		constructor(...args: any[]) {
			super();
			this.category="polygon";
			this.faces[0]=[];
			for (var i=0; i<args.length; i++) {
				this.points.push(args[i]);
				if (i>0) {
					this.segments.push([i-1,i]);
				}else this.segments.push([args.length-1,i]);
				this.faces[0].push(i);
			}
		}
		/**
		 * Makes a point at the center, draws lines from that point to every
		 * other point, and ends up cutting up the shape like a pizza.
		 * 
		 * > Requires the shape to have 1 face.
		 */
		convertToTriangles=function() {
			if (this.points.length==3) {//Don't you just love it when your code is a readable sentence?
				console.warn(this,"is already a triangle!");
				//return [this];//you can do this with any polygon
			}
			var out:Polygon[]=[],
				center=this.findCenter();
			for (var i=0; i<this.segments.length; i++) {
				out[i]=new Polygon(this.points[this.segments[i][0]],
					this.points[this.segments[i][1]],center);
			}
			return out;
		};
		/**
		 * Removes the segments' shared point, then replaces them with a single
		 * segment.
		 * @param segA: Index of the first segment
		 * @param segB: Index of the second segement
		 */
		joinSegments=function(segA: number,segB: number) {//lol sega
			if (typeof this.segments[segA]==="undefined"||
				typeof this.segments[segB]==="undefined") {
				console.warn("Segments not found!");
				return this;
			}
			var a=this.segments[segA],
				b=this.segments[segB];
			if (a[1]!==b[0]) {
				console.log("Segments not joinable! (or at least not with the current algorithim.)");
			}
			this.points=this.points.slice(0,a[1]).concat(this.points.slice(a[1]+1));
			for(var i=0;i<this.segments.length;i++) {
				if(i===segA) this.segments[i]=[a[0],b[1]];
				if(this.segments[i][0]>a[1]) this.segments[i][0]--;
				if(this.segments[i][1]>a[1]) this.segments[i][1]--;
			}
			this.segments=this.segments.slice(0,segB).concat(this.segments.slice(segB+1));
			var rm=-1;
			for(i=0;i<this.faces.length;i++) {
				for (var ii=0;ii<this.faces[i].length;ii++) {
					if (this.faces[i][ii]===segB) rm=ii;
					else if (this.faces[i][ii]>segB) this.faces[i][ii]--;
				}
				if (rm>=0) {
					this.faces[i]=this.faces[i].slice(0,rm).concat(this.faces[i].slice(rm+1));
					rm=-1;
				}
				//if (this.faces[i].length===0) rm=i;
				//else rm=-1;
			}
			//if (rm>=0) this.faces=this.faces.slice(0,rm).concat(this.faces.slice(rm+1));
			return this;
		};
		/**
		 * Replaces this segment with two segments, placing a point in the
		 * middle, unless overridden.
		 * @param segNum Index of segment to be replaced
		 * @param sugP Optional location of new point.
		 * @param color Not implemented yet, possible way to define the color of
		 * the new point, and the colors of the new segments.
		 */
		splitSegment=function(
			segNum: number,
			sugP?: number[]/*,
			color?: boolean*/) {
			var npoint=(typeof sugP!="undefined"&&typeof sugP.length=="number")?
					sugP:
					new Polygon(
						this.points[this.segments[segNum][0]],
						this.points[this.segments[segNum][1]]
					).findCenter(),
				pointL=this.segments[segNum][0]+1;
			this.points.splice(pointL,0,npoint);
			/*if (typeof color !="undefined") {
				throw("Color feature may not be implemented");
				//if (color===true) {
					
				//}
			}*/
			for (var i=0;i<this.segments.length;i++) {//increase the reference indexes for those that are now off by one because of the point spliced in the middle
				if (this.segments[i][0]>=pointL) this.segments[i][0]++;
				if (this.segments[i][1]>=pointL) this.segments[i][1]++;
			}
			this.segments.splice(segNum+1,0,[pointL,this.segments[segNum][1]]);
			this.segments[segNum]=[this.segments[segNum][0],pointL];
			/*for(i=0;i<this.faces.length;i++) {
				for (var ii=0;ii<this.faces[i].length;ii++) {
					if (this.faces[i][ii]>=segNum) this.faces[i][ii]++;
				}
			}
			this.faces.splice(segNum+1,0,segNum);*/
			this.faces[0].push(this.faces[0].length);
			return this;
		};
	}
	collisionDetectors["polygon"]={};
	collisionDetectors["polygon"].polygon=function(sh: Polygon|Shape) {
		var ths:Polygon=this.makeDup(),//make sure that the original ones aren't altered
			sha:Polygon=sh.makeDup();
		//iterate through each segment on ths
		for (var thsPt=0;thsPt<ths.segments.length;thsPt++) {
			//variables must be declared here so they are properly global
			var seg=ths.segments[thsPt],//ths's current segment
				innerR=false,//See usage below for a better comment description
				thsRX=ths.points[seg[0]][0],
				thsLX=ths.points[seg[1]][0],
				thsRY=ths.points[seg[0]][1],
				thsLY=ths.points[seg[1]][1];

			if (thsRX==thsLX||innerR) {//for a vertical line |

				ths.rotate(0,0,0.01);
				sha.rotate(0,0,0.01);

				/*this is so it tries this line (and all after it) again
				* without any lines with an infinite slope*/
				thsPt--;//decrement thsPt

				//see vertical line check inside of the below for loop
				innerR=false;
				//console.info("Outer Vertical!");
				continue;
			}
			//iterate through each segment on sha
			for (var shaPt=0;shaPt<sha.segments.length;shaPt++) {
				var segS=sha.segments[shaPt],/*sha's current segment */
					//The value we return
					retVal=[[this.points[seg [0]],this.points[seg [1]]],
							[  sh.points[segS[0]],  sh.points[segS[1]]]],
					shaRX=sha.points[segS[0]][0],
					shaLX=sha.points[segS[1]][0],
					shaRY=sha.points[segS[0]][1],
					shaLY=sha.points[segS[1]][1];

				if (shaRX==thsRX&&
					shaRY==thsRY&&
					shaLX==thsLX&&
					shaLY==thsLY)//lines are identical
						return retVal;

				/* Below in this very hard to read code, I compare each end
				* of ths to see if it is in both bounds of sha.
				*
				* I then swap their roles and repeat everything.
				*
				* _then_, I swap x for y, and repeat everying (including
				* repeats) thus handling for all 64 combinations (8^2)
				*
				* (note that the outlines for the lines must overlap in
				* both x and y)
				*
				* (also, I didn't handle for both borders of one being
				* inside of both of the other, but according to testing,
				* this situation would be handled for elsewere)
				*/
				if (!(((thsRX>=shaRX&&thsRX<=shaLX)|| //(shaRX > thsRX > shaLX or
					(thsRX>=shaLX&&thsRX<=shaRX)|| // shaLX > thsRX > shaRX or
					(thsLX>=shaRX&&thsLX<=shaLX)|| // shaRX > thsLX > shaLX or
					(thsLX>=shaLX&&thsLX<=shaRX)|| // shaLX > thsLX > shaRX or
					(shaRX>=thsRX&&shaRX<=thsLX)|| // thsLX > shaLX > thsRX or
					(shaRX>=thsLX&&shaRX<=thsRX)|| // thsRX > shaLX > thsLX or
					(shaLX>=thsRX&&shaLX<=thsLX)|| // thsLX > shaRX > thsRX or
					(shaLX>=thsLX&&shaLX<=thsRX))&&// thsRX > shaRX > thsLX) and
					((thsRY>=shaRY&&thsRY<=shaLY)|| //(shaRY > thsRY > shaLY or
					(thsRY>=shaLY&&thsRY<=shaRY)|| // shaLY > thsRY > shaRY or
					(thsLY>=shaRY&&thsLY<=shaLY)|| // shaRY > thsLY > shaLY or
					(thsLY>=shaLY&&thsLY<=shaRY)|| // shaLY > thsLY > shaRY or
					(shaRY>=thsRY&&shaRY<=thsLY)|| // thsLY > shaLY > thsRY or
					(shaRY>=thsLY&&shaRY<=thsRY)|| // thsRY > shaLY > thsLY or
					(shaLY>=thsRY&&shaLY<=thsLY)|| // thsLY > shaRY > thsRY or
					(shaLY>=thsLY&&shaLY<=thsRY))  // thsRY > shaRY > thsLY)
					)) continue; // the outlines of these two lines do not overlap (or touch)

				if (shaRX==shaLX) {//for a vertical line |
					/* all info for sha is reset, and tell the earlier
					* vertical line catcher to fix both, then try both
					* again.
					* (this is _really_ hard to test, but it basically acts
					* like a goto)
					*/
					//console.info("Inner Vertical!");
					innerR=true;
					break;
				}

				var thsM=(thsRY-thsLY)/(thsRX-thsLX),//find slope of thsSegment
					thsB=thsRY-(thsM*thsRX),//find y intercept of thsSegment
					//find slope of shaSegment //sham mate
					shaM=(shaRY-shaLY)/(shaRX-shaLX),
					shaB=shaRY-(shaM*shaRX);//find y intercept of shaSegment

				/*check for lines that share the same equation,
					but have different bounds*/
				if (thsB==shaB&&thsM==shaM)
					return retVal;
				if (thsM==shaM)
					continue;//lines are paralell (never touch)
				var x=(shaB-thsB)/(thsM-shaM);
					//get the x position of the x,y intercept
				if (!(((x>=shaRX && x<=shaLX)|| //(shaRX > x > shaLX or
					(x>=shaLX && x<=shaRX))&&// shaLX > x > shaRX) and
					((x>=thsRX && x<=thsLX)|| //(thsRX > x > thsLX or
					(x>=thsLX && x<=thsRX))  // thsLX > x > thsRX)
						)) continue;
				//if it is outside of bounds, it's not a collision

				//var y=(thsM*x)+thsB;
				//if (!(((y>=shaRY&&y<=shaLY)|| //(shaRY > y > shaLY or
				//	   (y>=shaLY&&y<=shaRY))&&// shaLY > y > shaRY) and
				//	  ((y>=thsRY&&y<=thsLY)|| //(thsRY > y > thsLY or
				//	   (y>=thsLY&&y<=thsRY))  // thsLY > y > thsRY)
				//	 )) continue;//if it is outside of bounds, it's not a collision

				//it's a collision
				return retVal;

				/* mathematically found calculation using
				* https://www.desmos.com/calculator/pkdnismmhs algorithm
				* (made by myself, but followed a few different tutorials)
				*/
			}
		}
		return [];
	};
	collisionDetectors["polygon"].circle=function(sh: Circle|Shape) {
		//input: another Shape instance
		var ths:Polygon=this.makeDup(),//make sure that the original ones aren't altered
			sha:Circle=sh.makeDup();
		//Sha is Circle, ths is Line
		//iterate through each segment on ths
		for (var thsPt=0;thsPt<ths.segments.length;thsPt++) {
			var seg=ths.segments[thsPt],//ths's current segment
				innerR=false,//See usage below for a better comment description
				thsRX=ths.points[seg[0]][0],
				thsLX=ths.points[seg[1]][0],
				thsRY=ths.points[seg[0]][1],
				thsLY=ths.points[seg[1]][1];

			if (thsRX==thsLX||innerR) {//for a vertical line |

				ths.rotate(0,0,0.01);
				sha.rotate(0,0,0.01);

				/*this is so it tries this line (and all after it) again
					* without any lines with an infinite slope*/
				thsPt--;//decrement thsPt

				//see vertical line check inside of the below for loop
				innerR=false;
				//console.info("Outer Vertical!");
				continue;
			}

			for (var shaPt=0;shaPt<sha.segments.length;shaPt++) {
				var segS=sha.segments[shaPt],/*sha's current segment */
					shaX=sha.points[segS[1]][0],
					shaY=sha.points[segS[1]][1],
					radius=sha.points[segS[0]];

				if(shaX!=0||shaY!=0) {
					/*Transpose the circle to center (this causes some
						data curruption later, as this is lossy)*/
					ths.transpose(-shaX,-shaY);
					sha.transpose(-shaX,-shaY);
					thsPt--;
					break;
				}
				/* Below is a complicated equation for circle-line
					* collsision.
					*
					* Quite frankly, I don't think that this is easy to
					* understand, but good luck.
					*
					* (I don't remember exactly, but I got the mathmatical
					* representation of this off of the internet, then I
					* adapted their tutorial into the below code)
					*
					* Much of this code was cleanly formatted only after
					* making the unit tests.
					*/
				var d_x=thsLX-thsRX,
					d_y=thsLY-thsRY,
					D=(thsRX*thsLY)-(thsLX*thsRY),
					d_r=distance(d_x,d_y);

				if ((Math.pow(radius,2)*Math.pow(d_r,2))<
					Math.pow(D,2)) break;//line doesn't collide.

				var x_p =(((D*d_y)+
						(Math.sign(d_y)*d_x*Math.sqrt(
							(Math.pow(radius,2)*Math.pow(d_r,2))-
								Math.pow(D,2)
						)))/(Math.pow(d_r,2))),
					x_p2=(((D*d_y)-
						(Math.sign(d_y)*d_x*Math.sqrt(
							(Math.pow(radius,2)*Math.pow(d_r,2))-
								Math.pow(D,2)
						)))/(Math.pow(d_r,2)));

				if (!((thsRX <= x_p && x_p <= thsLX)||
					(thsLX <= x_p && x_p <= thsRX)||

					(thsRX <=x_p2 && x_p2<= thsLX)||
					(thsLX <=x_p2 && x_p2<= thsRX)))
					continue; //If outside of bounds, continue

				var y_p =((-D*d_x)+
							(Math.abs(d_y)*
								Math.sqrt(
									(Math.pow(radius,2)*
										Math.pow(d_r,2))-
									Math.pow(D,2)
								)
							)
						)/(Math.pow(d_r,2)),
					y_p2=((-D*d_x)-
							(Math.abs(d_y)*
								Math.sqrt(
									(Math.pow(radius,2)*
										Math.pow(d_r,2))-
									Math.pow(D,2)
								)
							)
						)/(Math.pow(d_r,2));

				if (!((thsRY <= y_p && y_p <= thsLY)||
					(thsLY <= y_p && y_p <= thsRY)||
							//or
					(thsRY <=y_p2 && y_p2<= thsLY)||
					(thsLY <=y_p2 && y_p2<= thsRY)))
					continue; //If outside of bounds, continue

				return [[this.points[seg [0]],this.points[seg [1]]],
						[  sh.points[segS[0]],  sh.points[segS[1]]]];
			}
		}
		return [];
	};
	export class RightTriangle extends Polygon {
		constructor(x: number,y: number,w: number,h:number) {
			super([x,y],[x+w,y],[x,y+h]);
		}
	}
	export class IsosolesRightTriangle extends RightTriangle{
		constructor(x: number,y: number,w: number) {
			super(x,y,w,w);
		}
	};
	export class Rectagle extends Polygon {
		constructor(x:number,y:number,w:number,h:number) {
			super([x,y],[x+w,y],[x+w,y+h],[x,y+h]);
		}
	};
	export class Square extends Rectagle {
		constructor(x: number,y: number,w: number) {
			super(x,y,w,w);
		}
	};
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
		constructor(x: number,y: number,sideCount: number,radius: number) {
			var points:number[][]=[],
				amountPer=(Math.PI*2)/sideCount,
				thusFar=0;
			while (thusFar<sideCount) {
				points.push(rotate(radius,0,thusFar*amountPer));
				thusFar++;
			}
			super(...points);
			this.transpose(x,y);
		}
	};
}
/**
 * A shorthand alias for your convenience
 */
export var ss=spudslices;
