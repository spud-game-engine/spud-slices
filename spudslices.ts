export function distance(x:number,y:number) {
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
};
export function findRot(x:number,y:number) {
	var dist=distance(x,y),
		pos=[x/dist,
			y/dist];
	if(pos[1]<0) return(2*Math.PI)-Math.acos(pos[0]);//if it is > pi radians
	return Math.acos(pos[0]);
};
export function rawRotate(x:number,y:number,rad:number) {
	var dist=distance(x,y);
	return [
		dist*(Math.cos(rad)),
		dist*(Math.sin(rad)),
	];
};
export function rotate (x: number,y: number,rad: number) {
	return rawRotate(x,y,rad+findRot(x,y));
};
export function Shape() {
	this.category="shape";//used for collisions
	this.dimensions=2;
	this.points=[];
	this.pointColor="#ff0000";
	this.pointColors=[];
	this.pointSize=5;
	this.segments=[];//points to points
	this.segmentColor="#00ff00";
	this.segmentColors=[];
	this.segmentSize=3;
	this.faces=[];//points to segments
	this.faceColor="#0000ff";
	this.faceColors=[];
};
Shape.prototype.constructor=Shape;
Shape.prototype.drawOn=function(ctx: {
	fillStyle: string;
	beginPath: () => void;
	arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void;
	fill: () => void;
}) {
	this.drawFacesOn(ctx);
	this.drawSegmentsOn(ctx);
	this.drawPointsOn(ctx);
	return this;
};
Shape.prototype.drawPointsOn=function(ctx: {
	fillStyle: string;
	beginPath: () => void;
	arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void;
	fill: () => void;
}) {
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
Shape.prototype.drawSegmentsOn=function(ctx: {
	strokeStyle: string;
	lineWidth: number;
	beginPath: () => void;
	arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void;
	moveTo: { apply: (arg0: any, arg1: number) => void; };
	lineTo: { apply: (arg0: any, arg1: number) => void; };
	stroke: () => void;
}) {
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
Shape.prototype.drawFacesOn=function(ctx: {
	fillStyle: string;
	beginPath: () => void;
	arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void;
	moveTo: { apply: (arg0: any, arg1: any) => void; };
	lineTo: { apply: (arg0: any, arg1: any) => void; };
	fill: () => void;
}) {
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
Shape.prototype.transpose=function(x: number,y: number) {
	for (var i=0; i<this.points.length; i++) {
		if (typeof this.points[i]=="number") continue;
		this.points[i][0]+=x;
		this.points[i][1]+=y;
	}
	return this;
};
Shape.prototype.scale=function(x: number,y: number) {
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
Shape.prototype.rotate=function(x: number,y: number,rad: number) {
	this.transpose(-x,-y);//to Center
	for (var i=0;i<this.points.length;i++) {
		if (typeof this.points[i]=="number") continue;
		this.points[i]=rotate(this.points[i][0],this.points[i][1],rad);
	}
	this.transpose(x,y);//from Center
	return this;
};
Shape.prototype.roundPoints=function(otherF: {(x: number): number}) {
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
Shape.prototype.rotCenter=function(rad: number) {
	var pos=this.findCenter();
	return this.rotate(pos[0],pos[1],rad);
};
Shape.prototype.makeDup=function() {
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
		if (typeof this.segments[iterator]=="number") s.segments[iterator]=this.segments[iterator];
		else {
			s.segments.push([]);
			for (ii=0;ii< this.segments[iterator].length; ii++) {
				s.segments[iterator][ii]=this.segments[iterator][ii];
			}
		}
	}
	s.segmentColor=this.segmentColor+"";
	s.segmentColors=[];
	for (iterator=0; iterator<this.segmentColors.length;iterator++) {
		if (typeof this.segmentColors[iterator]=="number") s.segmentColors[iterator]=this.segmentColors[iterator];
		else {
			s.segmentColors.push([]);
			for (ii=0;ii< this.segmentColors[iterator].length; ii++) {
				s.segmentColors[iterator][ii]=this.segmentColors[iterator][ii];
			}
		}
	}
	s.faces=[];
	for (iterator=0; iterator<this.faces.length;iterator++) {
		if (typeof this.faces[iterator]=="number") s.faces[iterator]=this.faces[iterator];
		else{
			s.faces.push([]);
			for (ii=0;ii< this.faces[iterator].length; ii++) {
				s.faces[iterator][ii]=this.faces[iterator][ii];
			}
		}
	}
	s.faceColor=this.faceColor+"";
	s.faceColors=[];
	for (iterator=0; iterator<this.faceColors.length;iterator++) {
		if (typeof this.faceColors[iterator]=="number") s.faceColors[iterator]=this.faceColors[iterator];
		else {
			s.faceColors.push([]);
			for (ii=0;ii< this.faceColors[iterator].length; ii++) {
				s.faceColors[iterator][ii]=this.faceColors[iterator][ii];
			}
		}
	}
	return s;
};
//An object that follows the template below in structure. Handles all cases.
export var collisionDetectors = {
	/*"shape name":{
		/*A function that returns [] on no collision, or the information for
			the line segments, this one in [0] and the other in [1]* /
		"shape name":function() { ... },
		"a different shape name":function() { ... }
	},
	"a different shape name":{
		"a different shape name":function() { ... }
	}
	*/
};
Shape.prototype.collisionWith=function(sh: { category: string; }) {
	/*
	 * Search for the shape category `Shape.category` of both, then run the
	 * other's function if it can be found. If not, run this one's.
	 *
	 * Why? Because I want it to be possible to override one if you really
	 * wanted to. This should make it easier.  -- NOTE: NOT ACTUALY HAPPENING RN!
	 */
	//input: another Shape instance
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
export function Circle(x: number,y: number,r: number) {
	var s=new Shape();
	s.category="circle";
	s.points[0]=r;
	s.points[1]=[x,y];
	s.segments[0]=[0,1];
	s.faces[0]=[0];
	s.findCenter=function() {
		return this.points[1];
	};
	return s;
};
collisionDetectors["circle"]={};
collisionDetectors["circle"].circle=function(sh: { makeDup: () => void; points: { [x: string]: any; }; }) {
	let ths=this.makeDup(),//make sure that the original ones aren't altered
	sha:any=sh.makeDup();
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
export function Polygon(...args: any[]) {
	var s=new Shape();
	s.category="polygon";
	s.faces[0]=[];
	for (var i=0; i<arguments.length; i++) {
		s.points.push(arguments[i]);
		if (i>0) {
			s.segments.push([i-1,i]);
		}else s.segments.push([arguments.length-1,i]);
		s.faces[0].push(i);
	}
	s.__proto__.constructor=Polygon;
	s.__proto__.convertToTriangles=function() {
		//throw "Doesn't work in typescript.";
		if (this.points.length==3) {//Don't you just love it when your code is a readable sentence?
			console.warn(this,"is already a triangle!");
			//return [this];//you can do this with any polygon
		}
		var out=[],
			center=this.findCenter();
		for (var i=0; i<this.segments.length; i++) {
			out[i]=Polygon(this.points[this.segments[i][0]],
				this.points[this.segments[i][1]],center);
		}
		return out;
	};
	s.__proto__.joinSegments=function(segA: number,segB: number) {//lol sega
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
	s.__proto__.splitSegment=function(
			segNum: number,//Index of segment to be replaced
			sugP: { length: number; },//(optional) location of new point
			color: boolean) {
		var npoint=(typeof sugP!="undefined"&&typeof sugP.length=="number")?
				sugP:
				Polygon(
					this.points[this.segments[segNum][0]],
					this.points[this.segments[segNum][1]]
				).findCenter(),
			pointL=this.segments[segNum][0]+1;
		this.points.splice(pointL,0,npoint);
		if (typeof color !="undefined") {
			console.warn("Color feature may not be implemented");
			if (color===true) {
				
			}
		}
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
	s.__proto__.findCenter=function() {
		var center=new Array(this.dimensions);
		for (var dem=0;dem<this.dimensions;dem++) {
			for (var pointi=0,avrge=0;pointi<this.points.length;pointi++) {
				avrge+=this.points[pointi][dem];
			}
			center[dem]=avrge/this.points.length;
		}
		return center;
	};
	return s;
};
collisionDetectors["polygon"]={};
collisionDetectors["polygon"].polygon=function(sh: {makeDup: () => void; points: { [x: string]: any; }; }) {
	var ths=this.makeDup(),//make sure that the original ones aren't altered
	sha:any=sh.makeDup();
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
collisionDetectors["polygon"].circle=function(sh: { makeDup: () => void; points: { [x: string]: any; }; }) {
	//input: another Shape instance
	var ths=this.makeDup(),//make sure that the original ones aren't altered
		sha:any=sh.makeDup();
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
export function RightTriangle(x: number,y: number,w: number,h:number) {
	var p=Polygon([x,y],[x+w,y],[x,y+h]);
	p.__proto__.constructor=RightTriangle;
	return p;
};
export function IsosolesRightTriangle(x: number,y: number,w: number) {
	var r=RightTriangle(x,y,w,w);
	r.__proto__.constructor=IsosolesRightTriangle;
	return r;
};
export function Rectagle(x:number,y:number,w:number,h:number) {
	var p=Polygon([x,y],[x+w,y],[x+w,y+h],[x,y+h]);
	p.__proto__.constructor=Rectagle;
	return p;
};
export function Square(x: number,y: number,w: number) {
	var r=Rectagle(x,y,w,w);
	r.__proto__.constructor=Square;
	return r;
};
export function EqualDistShape(x: number,y: number,sideCount: number,radius: number) {
	var points=[],
		amountPer=(Math.PI*2)/sideCount,
		thusFar=0;
	while (thusFar<sideCount) {
		points.push(rotate(radius,0,thusFar*amountPer));
		thusFar++;
	}
	return Polygon.apply(this,points).transpose(x,y);
};
