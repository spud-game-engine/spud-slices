(function () {
	var out={};
	out.distance=function(x,y) {
		return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	}
	out.findRot=function(x,y) {
		var dist=out.distance(x,y),
			pos=[x/dist,
				y/dist];
		if(pos[1]<0) return(2*Math.PI)-Math.acos(pos[0]);//if it is > pi radians
		return Math.acos(pos[0]);
	}
	out.rawRotate=function(x,y,rad) {
		var dist=out.distance(x,y);
		return [
			dist*(Math.cos(rad)),
			dist*(Math.sin(rad)),
		];
	}
	out.rotate=function(x,y,rad) {
		return out.rawRotate(x,y,rad+out.findRot(x,y));
	}
	out.Shape=function() {
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
	out.Shape.prototype.constructor=out.Shape;
	out.Shape.prototype.drawOn=function(ctx) {
		this.drawFacesOn(ctx);
		this.drawSegmentsOn(ctx);
		this.drawPointsOn(ctx);
		return this;
	}
	out.Shape.prototype.drawPointsOn=function(ctx) {
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
	}
	out.Shape.prototype.drawSegmentsOn=function(ctx) {
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
	}
	out.Shape.prototype.drawFacesOn=function(ctx) {
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
	}
	out.Shape.prototype.transpose=function(x,y) {
		for (var i=0; i<this.points.length; i++) {
			if (typeof this.points[i]=="number") continue;
			this.points[i][0]+=x;
			this.points[i][1]+=y;
		}
		return this;
	}
	out.Shape.prototype.scale=function(x,y) {
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
	}
	out.Shape.prototype.rotate=function(x,y,rad) {
		this.transpose(-x,-y);//to Center
		for (var i=0;i<this.points.length;i++) {
			if (typeof this.points[i]=="number") continue;
			this.points[i]=out.rotate(this.points[i][0],this.points[i][1],rad);
		}
		this.transpose(x,y);//from Center
		return this;
	}
	out.Shape.prototype.roundPoints=function(otherF) {
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
	}
	out.Shape.prototype.rotCenter=function(rad) {
		var pos=this.findCenter();
		return this.rotate(pos[0],pos[1],rad);
	}
	out.Shape.prototype.makeDup=function() {
		var s=new out.Shape();
		for (var i in this) {
			s[i]=this[i];
		}
		s.points=[];
		for (i=0; i<this.points.length;i++) {
			if (typeof this.points[i]=="number") s.points[i]=this.points[i];
			else {
				s.points.push([]);
				for (var ii=0; ii<this.points[i].length; ii++) {
					s.points[i][ii]=this.points[i][ii];
				}
			}
		}
		s.pointColor=this.pointColor+"";
		s.pointColors=[];
		for (i=0; i<this.pointColors.length;i++) {
			if (typeof this.pointColors[i]=="number") s.pointColors[i]=this.pointColors[i];
			else {
				s.pointColors.push([]);
				for (var ii=0;ii< this.pointColors[i].length; ii++) {
					s.pointColors[i][ii]=this.pointColors[i][ii];
				}
			}
		}
		s.segments=[];
		for (i=0; i<this.segments.length;i++) {
			if (typeof this.segments[i]=="number") s.segments[i]=this.segments[i];
			else {
				s.segments.push([]);
				for (var ii=0;ii< this.segments[i].length; ii++) {
					s.segments[i][ii]=this.segments[i][ii];
				}
			}
		}
		s.segmentColor=this.segmentColor+"";
		s.segmentColors=[];
		for (i=0; i<this.segmentColors.length;i++) {
			if (typeof this.segmentColors[i]=="number") s.segmentColors[i]=this.segmentColors[i];
			else {
				s.segmentColors.push([]);
				for (var ii=0;ii< this.segmentColors[i].length; ii++) {
					s.segmentColors[i][ii]=this.segmentColors[i][ii];
				}
			}
		}
		s.faces=[];
		for (i=0; i<this.faces.length;i++) {
			if (typeof this.faces[i]=="number") s.faces[i]=this.faces[i];
			else{
				s.faces.push([]);
				for (var ii=0;ii< this.faces[i].length; ii++) {
					s.faces[i][ii]=this.faces[i][ii];
				}
			}
		}
		s.faceColor=this.faceColor+"";
		s.faceColors=[];
		for (i=0; i<this.faceColors.length;i++) {
			if (typeof this.faceColors[i]=="number") s.faceColors[i]=this.faceColors[i];
			else {
				s.faceColors.push([]);
				for (var ii=0;ii< this.faceColors[i].length; ii++) {
					s.faceColors[i][ii]=this.faceColors[i][ii];
				}
			}
		}
		return s;
	}
	out.Shape.prototype.collisionWith=function(sh) {
		//input: another Shape instance
		var ths=this.makeDup(),//make sure that the original ones aren't altered
			sha=sh.makeDup(),countOfRotateTimes=0;

		/* TODO:
		 * if all of ths's points are within the bounds for sha's points (or
		 * visa-versa) return true;
		 *
		 * no idea how to do this...
		 */

		/* TODO:
		 * make return actualy return the original data
		 */

		//iterate through each segment on ths
		for (var thsPt=0;thsPt<ths.segments.length;thsPt++) {
			//variables must be declared here so they are properly global
			var seg=ths.segments[thsPt],//ths's current segment
				thsPts=[ths.points[seg[0]],ths.points[seg[1]]],/*ths's current
					points as defined by `seg`*/
				thsM,//Slope of ths's segment
				thsB,//Y-intercept of ths's segment
				innerR=false,//See usage below for a better comment description
				thsType;//The type of shape that ths is.
				//thsL="";//I don't know what this is.
			if (typeof thsPts[0]=="number") {
				thsType="s";/*indicate to later part of script that the first
					shape is a circle*/
			}else{
				thsType="l";/*indicate to later part of script that the first
				shape is a line*/
				//find slope of thsSegment
				thsM=(thsPts[0][1]-thsPts[1][1])/(thsPts[0][0]-thsPts[1][0]);
				if (thsPts[0][0]==thsPts[1][0]||innerR) {//for a vertical line |
					ths.rotate(0,0,.01);
					sha.rotate(0,0,.01);
					countOfRotateTimes++;

					/*this is so it tries this line (and all after it) again
					 * without any lines with an infinite slope*/
					thsPt--;//decrement thsPt

					//see vertical line check inside of the below for loop
					innerR=false;
					//console.info("Outer Vertical!");
					continue;
				}
				//find y intercept of thsSegment
				thsB=thsPts[0][1]-(thsM*thsPts[0][0]);
			}
			//iterate through each segment on sha
			for (var shaPt=0;shaPt<sha.segments.length;shaPt++) {
				var segS=sha.segments[shaPt],/*sha's current segment */
					shaPts=[sha.points[segS[0]],sha.points[segS[1]]],/* sha's
						current points as determined by `segS`*/
					shaM,//Slope of sha's segment
					shaB;//Y-intercept of sha's segment
				if (typeof shaPts[0]=="number") {
					if (thsType=="l") {//Sha is Circle, ths is Line
						if(shaPts[1][0]!=0||shaPts[1][1]!=0) {
							/*Transpose the circle to center (this causes some
								data curruption later, as this is lossy)*/
							ths.transpose(-shaPts[1][0],-shaPts[1][1]);
							sha.transpose(-shaPts[1][0],-shaPts[1][1]);
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
						var d_x=thsPts[1][0]-thsPts[0][0],
							d_y=thsPts[1][1]-thsPts[0][1],
							D=(thsPts[0][0]*thsPts[1][1])-
								(thsPts[1][0]*thsPts[0][1]),
							d_r=Math.sqrt(Math.pow(d_x,2)+Math.pow(d_y,2));

						if (((Math.pow(shaPts[0],2)*Math.pow(d_r,2))-
							Math.pow(D,2))<0) break;//line doesn't collide.

						var x_p =(((D*d_y)+
								(Math.sign(d_y)*d_x*Math.sqrt(
									(Math.pow(shaPts[0],2)*Math.pow(d_r,2))
										-Math.pow(D,2)
								)))/(Math.pow(d_r,2))),
							x_p2=(((D*d_y)-
								(Math.sign(d_y)*d_x*Math.sqrt(
									(Math.pow(shaPts[0],2)*Math.pow(d_r,2))
										-Math.pow(D,2)
								)))/(Math.pow(d_r,2)));

						if (!((x_p>=thsPts[0][0]&&x_p<=thsPts[1][0])||
								//(shaRX > x > shaLX or
							  (x_p>=thsPts[1][0]&&x_p<=thsPts[0][0])||
									//or
							  (x_p2>=thsPts[0][0]&&x_p2<=thsPts[1][0])||
								//(shaRX > x > shaLX or
							  (x_p2>=thsPts[1][0]&&x_p2<=thsPts[0][0])))
							continue; //If outside of bounds, continue

						var y_p =((-D*d_x)+
									(Math.abs(d_y)*
										Math.sqrt(
											(Math.pow(shaPts[0],2)
												*Math.pow(d_r,2))-
											Math.pow(D,2)
										)
									)
								)/(Math.pow(d_r,2)),
							y_p2=((-D*d_x)-
									(Math.abs(d_y)*
										Math.sqrt(
											(Math.pow(shaPts[0],2)
												*Math.pow(d_r,2))-
											Math.pow(D,2)
										)
									)
								)/(Math.pow(d_r,2));
						if (!((y_p>=thsPts[0][1]&&y_p<=thsPts[1][1])||
							  (y_p>=thsPts[1][1]&&y_p<=thsPts[0][1])||
									//or
							  (y_p2>=thsPts[0][1]&&y_p2<=thsPts[1][1])||
							  (y_p2>=thsPts[1][1]&&y_p2<=thsPts[0][1])))
							continue; //If outside of bounds, continue
						return [thsPts,shaPts];
					}else if (thsType=="s"
						&&((out.distance(
								thsPts[1][0]-shaPts[1][0],
								thsPts[1][1]-shaPts[1][1]
							)-Math.abs(thsPts[0]) /* Circle-Circle */
							)-Math.abs(shaPts[0]<=0))) return [thsPts,shaPts];
				}else{

					//avoid circle line, only do line circle
					if (typeof thsM=="undefined"){
						var a=sha.collisionWith(ths);
						if (a.length>0) return [a[1],a[0]];
						return [];
					}//also preserves any rotation involving verticall lines

					/* Line-Line */

					if   (shaPts[0][0]==thsPts[0][0]
						&&shaPts[0][1]==thsPts[0][1]
						&&shaPts[1][0]==thsPts[1][0]
						&&shaPts[1][1]==thsPts[1][1])
							return [thsPts,shaPts];//lines are identical

					//find slope of shaSegment //sham mate
					shaM=(shaPts[0][1]-shaPts[1][1])/
						 (shaPts[0][0]-shaPts[1][0]);

					if (shaPts[0][0]==shaPts[1][0]) {//for a vertical line |
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

					//find y intercept of shaSegment
					shaB=shaPts[0][1]-(shaM*shaPts[0][0]);
					
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
					if (!(((thsPts[0][0]>=shaPts[0][0]&&thsPts[0][0]<=shaPts[1][0])|| //(shaRX > thsLX > shaLX or
						   (thsPts[0][0]>=shaPts[1][0]&&thsPts[0][0]<=shaPts[0][0])|| // shaLX > thsLX > shaRX or
						   (thsPts[1][0]>=shaPts[0][0]&&thsPts[1][0]<=shaPts[1][0])|| // shaRX > thsRX > shaLX or
						   (thsPts[1][0]>=shaPts[1][0]&&thsPts[1][0]<=shaPts[0][0])|| // shaLX > thsRX > shaRX or
						   (shaPts[0][0]>=thsPts[0][0]&&shaPts[0][0]<=thsPts[1][0])|| // thsRX > shaLX > thsLX or
						   (shaPts[0][0]>=thsPts[1][0]&&shaPts[0][0]<=thsPts[0][0])|| // thsLX > shaLX > thsRX or
						   (shaPts[1][0]>=thsPts[0][0]&&shaPts[1][0]<=thsPts[1][0])|| // thsRX > shaRX > thsLX or
						   (shaPts[1][0]>=thsPts[1][0]&&shaPts[1][0]<=thsPts[0][0]))&&// thsLX > shaRX > thsRX) and
						  ((thsPts[0][1]>=shaPts[0][1]&&thsPts[0][1]<=shaPts[1][1])|| //(shaRY > thsLY > shaLY or
						   (thsPts[0][1]>=shaPts[1][1]&&thsPts[0][1]<=shaPts[0][1])|| // shaLY > thsLY > shaRY or
						   (thsPts[1][1]>=shaPts[0][1]&&thsPts[1][1]<=shaPts[1][1])|| // shaRY > thsRY > shaLY or
						   (thsPts[1][1]>=shaPts[1][1]&&thsPts[1][1]<=shaPts[0][1])|| // shaLY > thsRY > shaRY or
						   (shaPts[0][1]>=thsPts[0][1]&&shaPts[0][1]<=thsPts[1][1])|| // thsRY > shaLY > thsLY or
						   (shaPts[0][1]>=thsPts[1][1]&&shaPts[0][1]<=thsPts[0][1])|| // thsLY > shaLY > thsRY or
						   (shaPts[1][1]>=thsPts[0][1]&&shaPts[1][1]<=thsPts[1][1])|| // thsRY > shaRY > thsLY or
						   (shaPts[1][1]>=thsPts[1][1]&&shaPts[1][1]<=thsPts[0][1]))  // thsLY > shaRY > thsRY)
						  )) continue;
					// the outlines of these two lines do not overlap (or touch)

					/*check for lines that share the same equation,
						but have different bounds*/
					if (thsB==shaB&&thsM==shaM)
						return [thsPts,shaPts];
					if (thsM==shaM)
						continue;//lines are either paralell or identical
					var x=(shaB-thsB)/(thsM-shaM);
						//get the x position of the x,y intercept
					if (!(((x>=shaPts[0][0]&&x<=shaPts[1][0])|| //(shaRX > x > shaLX or
						   (x>=shaPts[1][0]&&x<=shaPts[0][0]))&&// shaLX > x > shaRX) and
						  ((x>=thsPts[0][0]&&x<=thsPts[1][0])|| //(thsRX > x > thsLX or
						   (x>=thsPts[1][0]&&x<=thsPts[0][0]))  // thsLX > x > thsRX)
							   )) continue;
					//if it is outside of bounds, it's not a collision
					
					//var y=(thsM*x)+thsB;
					//if (!(((y>=shaPts[0][1]&&y<=shaPts[1][1])|| //(shaRY > y > shaLY or
					//	   (y>=shaPts[1][1]&&y<=shaPts[0][1]))&&// shaLY > y > shaRY) and
					//	  ((y>=thsPts[0][1]&&y<=thsPts[1][1])|| //(thsRY > y > thsLY or
					//	   (y>=thsPts[1][1]&&y<=thsPts[0][1]))  // thsLY > y > thsRY)
					//	 )) continue;//if it is outside of bounds, it's not a collision
					
					return [thsPts,shaPts];//it's a collision
					/* mathematically found calculation using
					 * https://www.desmos.com/calculator/pkdnismmhs algorithm
					 * (made by myself, but followed a few different tutorials)
					 */
				}
			}
		}
		return [];
	}
	out.Circle=function(x,y,r) {
		var s=new out.Shape()
		s.points[0]=r;
		s.points[1]=[x,y];
		s.segments[0]=[0,1];
		s.faces[0]=[0];
		s.findCenter=function() {
			return this.points[1];
		}
		return s;
	}
	out.Polygon=function() {
		var s=new out.Shape()
		s.faces[0]=[];
		for (var i=0; i<arguments.length; i++) {
			s.points.push(arguments[i]);
			if (i>0) {
				s.segments.push([i-1,i]);
			}else s.segments.push([arguments.length-1,i]);
			s.faces[0].push(i);
		}
		s.__proto__.constructor=out.Polygon;
		s.__proto__.convertToTriangles=function() {
			if (this.points.length==3) {//Don't you just love it when your code is a readable sentence?
				console.warn(this,"is already a triangle!");
				//return [this];//you can do this with any polygon
			}
			var out=[],
				center=this.findCenter();
			for (var i=0; i<this.segments.length; i++) {
				out[i]=new out.Polygon(this.points[this.segments[i][0]],
					this.points[this.segments[i][1]],
					center);
			}
			return out;
		};
		s.__proto__.joinSegments=function(sega,segb) {//lol sega

		};
		s.__proto__.splitSegment=function(segNum,sugP,color) {
			var npoint=(typeof sugP!="undefined"&&typeof sugP.length=="number")?sugP:new out.Polygon(this.points[this.segments[segNum][0]],this.points[this.segments[segNum][1]]).findCenter(),
				pointL=Math.floor((this.segments[segNum][0]+this.segments[segNum][1])/2);
			this.points.splice(pointL,0,npoint);
			if (typeof color !="undefined") {
				if (color===true) {

				}
			}
			for (var i=0;i<this.segments.length;i++) {//increase the reference indexes for those that are now off by one because of the point spliced in the middle
				if (this.segments[i][0]>=pointL) this.segments[i][0]++;
				if (this.segments[i][1]>=pointL) this.segments[i][1]++;
			}
			this.segments.splice(segNum+1,0,[pointL,this.segments[segNum][1]]);
			this.segments[segNum]=[this.segments[segNum][0],pointL];
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
	out.RightTriangle=function(x,y,w,h) {
		console.log(arguments)
		var p=new out.Polygon([x,y],[x+w,y],[x,y+h]);
		p.__proto__.constructor=out.RightTriangle;
		return p;
	}
	out.IsosolesRightTriangle=function(x,y,w) {
		var r=new out.RightTriangle(x,y,w,w);
		r.__proto__.constructor=out.IsosolesRightTriangle;
		return r;
	}
	out.Rectagle=function(x,y,w,h) {
		var p=new out.Polygon([x,y],[x+w,y],[x+w,y+h],[x,y+h])
		p.__proto__.constructor=out.Rectagle;
		return p;
	};
	out.Square=function(x,y,w) {
		var r=new out.Rectagle(x,y,w,w)
		r.__proto__.constructor=out.Square;
		return r;
	};
	out.EqualDistShape=function(x,y,sideCount,radius) {
		var points=[],
			amountPer=(Math.PI*2)/sideCount,
			thusFar=0;
		while (thusFar<sideCount) {
			points.push(out.rotate(radius,0,thusFar*amountPer));
			thusFar++;
		}
		return out.Polygon.apply(this,points).transpose(x,y);
	}
	if (typeof window.ss=="undefined") window.ss=out;
	if (typeof window.spudslices=="undefined") window.spudslices=out;
})()