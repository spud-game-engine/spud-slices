/**
* This is the main source file for spudslices, the library that lets you make
* shapes.
*/
/**
* The main namespace for spudslices, the library that lets you make shapes.
*/
namespace spudslices{
	/**
	* A string that identifies the version number.
	*/
	export const version:string="1.3.2";//should be identical to that of this repo's package.json
	/**
	* Find the distance of (x,y) from the origin (0,0)
	*/
	export const distance = (x:number,y:number) => Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	/**
	* Find the rotation (in radians) of (x,y) from (0,1) around the origin
	* (0,0)
	*/
	export function findRot(x:number,y:number):number {
		const dist=distance(x,y),
			pos=[x/dist,
				y/dist];
		if(pos[1]<0) return(2*Math.PI)-Math.acos(pos[0]);//if it is > pi radians
		return Math.acos(pos[0]);
	};
	/**
	* Rotate a point (x,y) around (0,0)
	* @param rad The rotation to offset the new rotation from (0,distance),
	* where distance is the distance of (x,y) from (0,0)
	*/
	export function rawRotate(x:number,y:number,rad:number):[number,number] {
		const dist=distance(x,y);
		return [
			dist*(Math.cos(rad)),
			dist*(Math.sin(rad)),
		];
	};
	/**
	* Get the location of where a point will be rotated (given `rad`) from it's
	* current location (x,y)
	*/
	export const rotate=(x: number,y: number,rad: number)=>rawRotate(x,y,rad+findRot(x,y));
	/**
	* A database of the functions that get called when checking to see if any
	* two shapes are touching.
	*
	* @see [[Shape.collisionWith]] for more info.
	*/
	export let collisionDetectors:{
		[index:string]:{//Shape name
			[index:string]://Another shape name
				(sh:Shape) => any[]
		}
	} = {
		circle:{
			/** Collision of two circles. */
			circle(sh: Circle|Shape) {//change to two args in v2?
				const ths:Circle=this.makeDup(),//make sure that the original ones aren't altered
					sha:Circle=sh.makeDup();
				//iterate through each segment on ths
				for (let thsPt=0;thsPt<ths.segments.length;thsPt++) {
					//variables must be declared here so they are properly global
					const seg=ths.segments[thsPt],//ths's current segment
						thsRadius=ths.points[seg[0]],//will be different in vv22
						thsX=ths.points[seg[1]][0],
						thsY=ths.points[seg[1]][1];
					//iterate through each segment on sha
					for (let shaPt=0;shaPt<sha.segments.length;shaPt++) {
						const segS=sha.segments[shaPt],/*sha's current segment */
							shaRadius=sha.points[segS[0]],//will be different in v2
							shaX=sha.points[segS[1]][0],
							shaY=sha.points[segS[1]][1];
						if ((   (   distance(
										thsX-shaX,
										thsY-shaY
									)-Math.abs(shaRadius)
								)-Math.abs(thsRadius)
							)<=0) return [
								[this.points[seg [0]],this.points[seg [1]]],
								[  sh.points[segS[0]],  sh.points[segS[1]]]];
					}
				}
				return [];
			}
		},
		polygon:{
			/** Collision of two polygons */
			polygon:function(sh: Polygon|Shape) {//change to two args in v2?
				const ths:Polygon=this.makeDup(),//make sure that the original ones aren't altered
					sha:Polygon=sh.makeDup();
				//iterate through each segment on ths
				for (let thsPt=0;thsPt<ths.segments.length;thsPt++) {
					//variables must be declared here so they are properly global
					const seg=ths.segments[thsPt],//ths's current segment
						thsRX=ths.points[seg[0]][0],
						thsLX=ths.points[seg[1]][0],
						thsRY=ths.points[seg[0]][1],
						thsLY=ths.points[seg[1]][1];
					let innerR=false;//See usage below for a better comment description

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
					for (let shaPt=0;shaPt<sha.segments.length;shaPt++) {
						const segS=sha.segments[shaPt],/*sha's current segment */
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
						if (!((
							(thsRX>=shaRX&&thsRX<=shaLX)|| //(shaRX > thsRX > shaLX or
							(thsRX>=shaLX&&thsRX<=shaRX)|| // shaLX > thsRX > shaRX or
							(thsLX>=shaRX&&thsLX<=shaLX)|| // shaRX > thsLX > shaLX or
							(thsLX>=shaLX&&thsLX<=shaRX)|| // shaLX > thsLX > shaRX or
							(shaRX>=thsRX&&shaRX<=thsLX)|| // thsLX > shaLX > thsRX or
							(shaRX>=thsLX&&shaRX<=thsRX)|| // thsRX > shaLX > thsLX or
							(shaLX>=thsRX&&shaLX<=thsLX)|| // thsLX > shaRX > thsRX or
							(shaLX>=thsLX&&shaLX<=thsRX)   // thsRX > shaRX > thsLX) and
						)&&(
							(thsRY>=shaRY&&thsRY<=shaLY)|| //(shaRY > thsRY > shaLY or
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

						const thsM=(thsRY-thsLY)/(thsRX-thsLX),//find slope of thsSegment
							thsB=thsRY-(thsM*thsRX),//find y intercept of thsSegment
							//find slope of shaSegment //sham mate
							shaM=(shaRY-shaLY)/(shaRX-shaLX),
							shaB=shaRY-(shaM*shaRX);//find y intercept of shaSegment

						/*check for lines that share the same equation,
							but have different bounds*/
						if (thsB==shaB&&thsM==shaM) return retVal;
						if (thsM==shaM) continue;//lines are paralell (never touch)
						const x=(shaB-thsB)/(thsM-shaM);
							//get the x position of the x,y intercept
						if (!(((x>=shaRX && x<=shaLX)|| //(shaRX > x > shaLX or
							(x>=shaLX && x<=shaRX))&&// shaLX > x > shaRX) and
							((x>=thsRX && x<=thsLX)|| //(thsRX > x > thsLX or
							(x>=thsLX && x<=thsRX))  // thsLX > x > thsRX)
								)) continue;
						//if it is outside of bounds, it's not a collision

						//const y=(thsM*x)+thsB;
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
			},
			/** Collision of a polygon with a circle, or a circle with a polygon */
			circle:function(sh: Circle|Shape) {//change to two args in v2?
				//input: another Shape instance
				const ths:Polygon=this.makeDup(),//make sure that the original ones aren't altered
					sha:Circle=sh.makeDup();
				//Sha is Circle, ths is Line
				//iterate through each segment on ths
				let innerR=false;//See usage below for a better comment description
				for (let thsPt=0;thsPt<ths.segments.length;thsPt++) {
					const seg=ths.segments[thsPt],//ths's current segment
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

					for (let shaPt=0;shaPt<sha.segments.length;shaPt++) {
						const segS=sha.segments[shaPt],/*sha's current segment */
							shaX=sha.points[segS[1]][0],
							shaY=sha.points[segS[1]][1];

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
						const d_x=thsLX-thsRX,
							d_y=thsLY-thsRY,
							D=(thsRX*thsLY)-(thsLX*thsRY),
							d_r=distance(d_x,d_y),
							radius=sha.points[segS[0]];//will be different in v2

						if ((Math.pow(radius,2)*Math.pow(d_r,2))<
							Math.pow(D,2)) break;//line doesn't collide.

						const x_p =(((D*d_y)+
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

						const y_p =((-D*d_x)+
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

						if (!(
							(thsRY <= y_p && y_p <= thsLY)||
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
			}
		}
	};
	/**
	* The base class for all shapes.
	*/
	export class Shape {
		[x: string]: any;//Allows __proto__ to work.
		/**
		* This string is what identifies to [[Shape.collisionWith]] which of the
		* [[spudslices.collisionDetectors]] to use.
		*/
		category:string="shape";//used for collisions
		/**
		* This identifies to internal mechanisims that this is a 2d object.
		*
		* These internal mechanisims will expect the length of each
		* array inside of `[[Shape.points]] to equal this value.
		*
		* Sometime in the future, if 3D support is ever added, this will be
		* used to have any-dimention shapes, but it will require a few more
		* base shapes, and much, much more complicated collisions.
		*/
		dimensions=2;
		/**
		* Even though (at time of writing) this is type `any[]` it is one of
		*  two things:
		*
		*  * `number[][]`, given that it is an ordinary point.
		*     (See [[dimensions]]) for more info.
		*  * `number[]`, given that it is the first point, and the class type
		*    is `Circle` (or one of it's children). In this case, this point is
		*    the radius, and the next point is the center of the circle.
		*
		* This will be changed in v2
		*/
		points:any[]=[];
		/**
		* The color that points are rendered when calling either [[drawOn]] or
		* [[drawPointsOn]]. Overrided by [[pointColors]].
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
		* length of the innermost array should always be `2` as segments are
		* comprised of exactly two points.
		*/
		segments:[number,number][]=[];
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
		* Draws this [[Shape]] instance on this CanvasRenderingContext2D
		* instance.
		*/
		drawOn(ctx: CanvasRenderingContext2D):Shape {
			this.drawFacesOn(ctx);
			this.drawSegmentsOn(ctx);
			this.drawPointsOn(ctx);
			return this;
		};
		/**
		* Draws the points of this [[Shape]] instance on this
		* CanvasRenderingContext2D instance.
		*/
		drawPointsOn(ctx: CanvasRenderingContext2D):Shape {
			ctx.fillStyle=this.pointColor;
			ctx.beginPath();
			for (let i=0; i<this.points.length; i++) {
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
		* Draws the segments of this [[Shape]] instance on this
		* CanvasRenderingContext2D instance.
		*/
		drawSegmentsOn(ctx: CanvasRenderingContext2D):Shape {
			ctx.strokeStyle=this.segmentColor;
			ctx.lineWidth=this.segmentSize;
			ctx.beginPath();
			for (let i=0; i<this.segments.length; i++) {
				const seg=this.segments[i];
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
			ctx.stroke();
			//ctx.closePath();
			return this;
		};
		/**
		* Draws the faces of this [[Shape]] instance on this
		* CanvasRenderingContext2D instance.
		*/
		drawFacesOn(ctx: CanvasRenderingContext2D):Shape {
			ctx.fillStyle=this.faceColor;
			ctx.beginPath();
			for (let fac=0; fac<this.faces.length; fac++) {
				for (let i=0; i<this.faces[fac].length; i++) {
					if (typeof this.faceColors[fac]=="string")
						ctx.fillStyle=this.faceColors[i];
					const seg=this.segments[this.faces[fac][i]];
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
		transpose(x: number,y: number):Shape {
			for (let i=0; i<this.points.length; i++) {
				if (typeof this.points[i]=="number") continue;//will be removed in v2
				this.points[i][0]+=x;
				this.points[i][1]+=y;
			}
			return this;
		};
		/**
		* A basic scale function.
		*
		* > NOTE: Doesnt morph the shape of [[Circle]] elements, but it does
		* > scale its position, and will take the average of x and y to figure
		* > out how much to scale the radius.
		* >
		* > TL;DR: Circles scaled with this function still are circles, never
		* > ovals.
		*
		* @param x How much the shape is scaled along the x-position
		* @param y Inferred to be `x` if missing. If not missing, how
		*   much the shape is scaled along the y-position.
		*/
		scale(x: number,y?: number):Shape {
			if(typeof y==="undefined") y=x;
			for (let i=0;i<this.points.length;i++) {
				if (typeof this.points[i]=="number") {//remove in v2
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
		rotate(x: number,y: number,rad: number):Shape {
			this.transpose(-x,-y);//to Center
			for (let i=0;i<this.points.length;i++) {
				if (typeof this.points[i]=="number") continue;//will be removed in v2
				this.points[i]=rotate(this.points[i][0],this.points[i][1],rad);
			}
			this.transpose(x,y);//from Center
			return this;
		};
		/**
		* Round all points in the function. (Will also round the radius of a circle)
		* @param otherF Optional function to use instead of `Math.round`
		*/
		roundPoints(otherF?: {(x: number): number}):Shape {
			if (typeof otherF==="undefined") {
				otherF=Math.round;
			}
			for (let i=0;i<this.points.length;i++) {
				if (typeof this.points[i]=="number") {//remove in v2
					this.points[i]=otherF(this.points[i]);
					continue;
				}
				for (let ii=0;ii<this.points[i].length;ii++)
					this.points[i][ii]=otherF(this.points[i][ii]);
			}
			return this;
		};
		/**
		* Rotate the shape around its own center.
		* @param rad How far to rotate.
		*/
		rotCenter(rad: number):Shape {
			const pos=this.findCenter();
			return this.rotate(pos[0],pos[1],rad);
		};
		/**
		* Return a duplicate of this object, removing all pointers to the
		* original.
		*/
		makeDup() {
			let s=new this.__proto__.constructor();
			for (let i in this) {
				s[i]=this[i];
			}
			s.category=this.category;
			s.points=[];
			for (let i=0; i<this.points.length;i++) {
				if (typeof this.points[i]=="number") s.points[i]=this.points[i];//will be removed in v2
				else {
					s.points.push([]);
					for (let ii=0; ii<this.points[i].length; ii++) {
						s.points[i][ii]=this.points[i][ii];
					}
				}
			}
			s.pointColor=this.pointColor+"";
			s.pointColors=[];
			for (let i=0; i<this.pointColors.length;i++) {
				s.pointColors.push([]);
				for (let ii=0;ii< this.pointColors[i].length; ii++) {
					s.pointColors[i][ii]=this.pointColors[i][ii];
				}
			}
			s.segments=[];
			for (let i=0; i<this.segments.length;i++) {
				s.segments.push([]);
				for (let ii=0;ii< this.segments[i].length; ii++) {
					s.segments[i][ii]=this.segments[i][ii];
				}
			}
			s.segmentColor=this.segmentColor+"";
			s.segmentColors=[];
			for (let i=0; i<this.segmentColors.length;i++) {
				s.segmentColors.push([]);
				for (let ii=0;ii< this.segmentColors[i].length; ii++) {
					s.segmentColors[i][ii]=this.segmentColors[i][ii];
				}
			}
			s.faces=[];
			for (let i=0; i<this.faces.length;i++) {
				s.faces.push([]);
				for (let ii=0;ii< this.faces[i].length; ii++) {
					s.faces[i][ii]=this.faces[i][ii];
				}
			}
			s.faceColor=this.faceColor+"";
			s.faceColors=[];
			for (let i=0; i<this.faceColors.length;i++) {
				s.faceColors.push([]);
				for (let ii=0;ii< this.faceColors[i].length; ii++) {
					s.faceColors[i][ii]=this.faceColors[i][ii];
				}
			}
			return s;
		};
		/*makeDup() {
			const s=new this.__proto__.constructor();
			for (let i in this) {
				if (s[i]==this[i]) continue;
				Object.assign(this[i],s[i]);
			}
			return s;
		};*/
		/**
		* Search for the [[Shape.category]] of both, then run the
		* this one's function if it can be found. If not, run this the other
		* ones function.
		*
		* > NOTE: I plan on having it call the other ones first, but there is
		* > a deep-rooted bug that doesn't properly call the other's.
		* >
		* > The
		* > reasoning behind having the other's called first is the fact that
		* > it allows for someone to create their own collisionDetector &/or
		* > type of shape in a better way.
		*/
		collisionWith(sh:Shape) {
			if (typeof  collisionDetectors[this.category]!=="undefined"&&
				typeof  collisionDetectors[this.category][  sh.category]!=="undefined") {

				return  collisionDetectors[this.category][  sh.category].call(this,sh);
			}else if (
				typeof  collisionDetectors[  sh.category]!=="undefined"&&
				typeof  collisionDetectors[  sh.category][this.category]!=="undefined") {

				const tmp=collisionDetectors[  sh.category][this.category].call(sh,this);
				if (tmp.length===0) return [];
				else return [tmp[1],tmp[0]];
			}else throw "Could not find shape collision detector for a \""+
				this.category+"\"-\""+sh.category+"\" collision.";
		};
		/**
		* Find the center of any shape, relative to the points.
		*/
		findCenter() {
			const center=new Array(this.dimensions);
			for (let dem=0,avrge:number;dem<this.dimensions;dem++) {
				avrge=0;
				for (let pointi=0;pointi<this.points.length;pointi++) {
					avrge+=this.points[pointi][dem];
				}
				center[dem]=avrge/this.points.length;
			}
			return center;
		};
	};
	/**
	* The base class for circle- like shapes.
	*
	* > Note: Causes minor conflict as [[Shape.points]] [0] is the radius,
	* > whereas the rest of the library expects the type of [[Shape.points]] to
	* > be `number[][]`. This may be redesigned in a future major release.
	* >
	* > (remove in v2)
	*/
	export class Circle extends Shape{
		/**
		* Constuctor for [[Circle]]
		* @param x X-location of Circle
		* @param y Y-location of Circle
		* @param r Radius of [[Circle]]
		*/
		constructor(x:number,y:number,r:number) {//make r public in v2 (rename it to radius as well)
			super();
			this.category="circle";
			this.points[0]=r;//remove in v2
			this.points[1]=[x,y];
			this.segments[0]=[0,1];
			this.faces[0]=[0];
		}
		/**
		* Find the center of a [[Circle]].
		*/
		findCenter=():[number,number]=>this.points[1];//won't be needed in v2
	}
	export class Polygon extends Shape {
		/**
		* @param args Each point of the polygon. Points are pre-connected with
		* segments, and the last point is automatically connected to the first
		* point.
		*/
		constructor(...args: number[][]|number[]) {
			super();
			this.category="polygon";
			this.faces[0]=[];
			for (let i=0; i<args.length; i++) {
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
		* > NOTE: Assumes the shape to have 1 face.
		*/
		convertToTriangles() {
			let out:Polygon[]=[],
				center=this.findCenter();
			for (let i=0; i<this.segments.length; i++) {
				out[i]=new Polygon(this.points[this.segments[i][0]],
					this.points[this.segments[i][1]],center);
			}
			return out;
		};
		/**
		* Removes the segments' shared point, then replaces them with a single
		* segment.
		* @param segA Index of the first segment
		* @param segB Index of the second segement
		*/
		joinSegments(segA: number,segB: number):Shape {//lol sega
			if (typeof this.segments[segA]==="undefined"||
				typeof this.segments[segB]==="undefined") {
				console.warn("Segments not found!");
				return this;
			}
			const a=this.segments[segA],
				b=this.segments[segB];
			if (a[1]!==b[0]) {
				if (a[0]!==b[1]) throw "Segments not joinable! They need to share a pointer to the same point.";
				else return this.joinSegments(segB,segA);
			}
			this.points=this.points.slice(0,a[1]).concat(this.points.slice(a[1]+1));
			for (let i=0;i<this.segments.length;i++) {
				if(i===segA) this.segments[i]=[a[0],b[1]];
				if(this.segments[i][0]>a[1]) this.segments[i][0]--;
				if(this.segments[i][1]>a[1]) this.segments[i][1]--;
			}
			this.segments=this.segments.slice(0,segB).concat(this.segments.slice(segB+1));
			for (let i=0,rm=-1;i<this.faces.length;i++) {
				for (let ii=0;ii<this.faces[i].length;ii++) {
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
		splitSegment(
			segNum: number,
			sugP?: number[]/*,
			color?: boolean*/):Shape {
			const npoint=(typeof sugP!="undefined"&&typeof sugP.length=="number")?
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
			for (let i=0;i<this.segments.length;i++) {//increase the reference indexes for those that are now off by one because of the point spliced in the middle
				if (this.segments[i][0]>=pointL) this.segments[i][0]++;
				if (this.segments[i][1]>=pointL) this.segments[i][1]++;
			}
			this.segments.splice(segNum+1,0,[pointL,this.segments[segNum][1]]);
			this.segments[segNum]=[this.segments[segNum][0],pointL];
			/*for(i=0;i<this.faces.length;i++) {
				for (let ii=0;ii<this.faces[i].length;ii++) {
					if (this.faces[i][ii]>=segNum) this.faces[i][ii]++;
				}
			}
			this.faces.splice(segNum+1,0,segNum);*/
			this.faces[0].push(this.faces[0].length);
			return this;
		};
	}
	/**
	* A right triangle.
	*
	* The 90 degree angle is at (x,y).
	* Next point is at (x+w,y), then (x,y+h)
	*/
	export class RightTriangle extends Polygon {
		constructor(x: number,y: number,w: number,h:number) {
			super([x,y],[x+w,y],[x,y+h]);
		}
	}
	/**
	* A 45,45,90 triangle.
	*/
	export class IsosolesRightTriangle extends RightTriangle{
		/**
		* @param w Both the width and height of the Right triangle.
		*/
		constructor(x: number,y: number,w: number) {
			super(x,y,w,w);
		}
	};
	//TODO: add 30,60,90 triangle?
	export class Rectagle extends Polygon {
		constructor(x:number,y:number,w:number,h:number) {
			super([x,y],[x+w,y],[x+w,y+h],[x,y+h]);
		}
	};
	export class Square extends Rectagle {
		/**
		* @param w Both the width and height of the square.
		*/
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
		* @param radius Distance of all points from (x,y)
		*/
		constructor(x: number,y: number,sideCount: number,radius: number) {
			let points:[number,number][]=[];
			for (let amountPer=(Math.PI*2)/sideCount,
				thusFar=0; thusFar<sideCount; ++thusFar) {
				points.push(rotate(radius,0,thusFar*amountPer));
			}
			super(...points);
			this.transpose(x,y);
		}
	};
	/**
	* > **Will be DEPRECATED in v2**
	*
	* Include ss and spudslices in the main export
	*
	* Put here for compatibility with v1.2.3. Please don't use in new code.
	* (If you would like me to keep these redundant exports, tell me, and I
	* will consider canceling their deprecation)
	*
	* If you are using `import {ss} from 'spudslices'` or
	* `import {spudslices} from 'spudslices'` use `import ss from 'spudslices`
	* or `import spudslices from 'spudslices'` instead.
	*/
	export let ss:any,spudslices:any;
}
(function(){
	let __warnedAboutv1_2_3ExportDep=false;
	function get() {
		if (!__warnedAboutv1_2_3ExportDep){
			__warnedAboutv1_2_3ExportDep=true;
			const __useInstead__="\n\nIf you are using `import {ss} from 'spudslices'` or `import {spudslices} from 'spudslices'` use `import ss from 'spudslices` or `import spudslices from 'spudslices'`\n";
			console.warn("DEPRECATION WARNING: Using this style of import is going to be deprecated in v2 of spud-slices."+__useInstead__);//remove this line, uncomment next line on v2
			//console.error("DEPRECATION WARNING: Using this style of import has been deprecated as of v2 of spud-slices. This will be thrown in v2.1 (or later)"+__useInstead__);//remove this line, uncomment next line on v2.1
			//throw new Error("DEPRECATION WARNING: Using this style of import has been deprecated as of v2 of spud-slices. This feature will be wiped in v2.2 (or later)"+__useInstead__);//remove, along with other simmalar code in v2.2
		}
		return spudslices;
	}
	Object.defineProperty(spudslices,"spudslices",{get});
	Object.defineProperty(spudslices,"ss",{get});
})()
//export spudslices as the only thing exported
export = spudslices;
