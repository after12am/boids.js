/*
 * boids.js
 * https://github.com/after12am/boids.js
 *
 * Copyright 2012 Satoshi Okami
 * Released under the MIT license
 */
var BOIDS = (function() {
var exports = {};

// src/core/math/Vector3.js
// from https://github.com/mrdoob/three.js/

/**
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

exports.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};


exports.Vector3.prototype = {

	constructor: exports.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	clone: function () {

		return new exports.Vector3( this.x, this.y, this.z );

	},


	add: function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub: function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( -1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	lengthManhattan: function () {

		// correct version
		// return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		return this.x + this.y + this.z;

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},


	cross: function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf: function ( v ) {

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},


	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		return new exports.Vector3().sub( this, v ).lengthSq();

	},


	setPositionFromMatrix: function ( m ) {

		this.x = m.n14;
		this.y = m.n24;
		this.z = m.n34;

	},

	setRotationFromMatrix: function ( m ) {

		var cosY = Math.cos( this.y );

		this.y = Math.asin( m.n13 );

		if ( Math.abs( cosY ) > 0.00001 ) {

			this.x = Math.atan2( - m.n23 / cosY, m.n33 / cosY );
			this.z = Math.atan2( - m.n12 / cosY, m.n11 / cosY );

		} else {

			this.x = 0;
			this.z = Math.atan2( m.n21, m.n22 );

		}

	},

	isZero: function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	}

};

/* EXTEND THREE.Vector3() */
exports.Vector3.prototype.limitScalar = function( s ) {
	
	var lengthSquared = this.lengthSq();
	
	if( lengthSquared > s * s && lengthSquared > 0 ) {
		
		var ratio = s / Math.sqrt( lengthSquared );
		this.x *= ratio;
		this.y *= ratio;
		this.z *= ratio;
	}
	return this;
};
// src/boids.js
/********************************************************************************** 
 
 Copyright (C) 2012 satoshi okami
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 
 **********************************************************************************/

/* EXTEND THREE.Vector3 */
try {	
	THREE.Vector3.prototype.limitScalar = function( s ) {

		var lengthSquared = this.lengthSq();

		if( lengthSquared > s * s && lengthSquared > 0 ) {

			var ratio = s / Math.sqrt( lengthSquared );
			this.x *= ratio;
			this.y *= ratio;
			this.z *= ratio;
		}
		return this;
	};
} catch (e) {};



/* BOIDS LIBRARY */

exports.nextVehicleId = function() {
	
	var vid = 0;
	
	return function() { return vid++; };
}();

exports.getRandVec = function() {

	var vec = new exports.Vector3();
	var a1 = (Math.random() * 360 * Math.PI / 180);
	var a2 = (Math.random() * 2 * Math.PI);

	vec.x = (Math.sin(a1) * Math.cos(a2));
	vec.y = (Math.sin(a1) * Math.sin(a2));
	vec.z = (Math.cos(a1));

	return vec;
};
// src/core/Vehicle.js
/********************************************************************************** 
 
 Copyright (C) 2012 satoshi okami
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 
 **********************************************************************************/

exports.Vehicle = function( x, y, z ) {
	
	this.id = exports.nextVehicleId();
	this.mass = 1.0;
	this.maxSpeed = 4.0;
	this.maxTrailSize = 10;
	this.position = new exports.Vector3( x, y, z );
	this.velocity = new exports.Vector3();
	this.trails = [];
};

exports.Vehicle.prototype.update = function() {
	
	this.velocity.limitScalar(this.maxSpeed);
	this.position.addSelf(this.velocity);
	this.trails.push(this.position.clone());
	
	if (this.trails.length >= this.maxTrailSize) this.trails.shift();
};

exports.Vehicle.prototype.bounce = function(w, h, d) {
	
	if (this.position.x > w * .5)
	{
		this.position.x = w * .5;
		this.velocity.x *= -1;
	}
	else if (this.position.x < - w * .5)
	{
		this.position.x = - w * .5;
		this.velocity.x *= -1;
	}
	
	if (this.position.y > h * .5)
	{
		this.position.y = h * .5;
		this.velocity.y *= -1;
	}
	else if (this.position.y < - h * .5)
	{
		this.position.y = - h * .5;
		this.velocity.y *= -1;
	}
	
	if (this.position.z > d * .5)
	{
		this.position.z = d * .5;
		this.velocity.z *= -1;
	}
	else if (this.position.z < - d * .5)
	{
		this.position.z = - d * .5;
		this.velocity.z *= -1;
	}
};

exports.Vehicle.prototype.wrap = function(w, h, d) {
	
	if (this.position.x > w * .5)
	{
		this.position.x = - w * .5;
	}
	else if (this.position.x < - w * .5)
	{
		this.position.x = w * .5;
	}
	
	if (this.position.y > h * .5)
	{
		this.position.y = - h * .5;
	}
	else if (this.position.y < - h * .5)
	{
		this.position.y = h * .5;
	}
	
	if (this.position.z > d * .5)
	{
		this.position.z = - d * .5;
	}
	else if (this.position.z < - d * .5)
	{
		this.position.z = d * .5;
	}
};
// src/core/SteeredVehicle.js
/********************************************************************************** 
 
 Copyright (C) 2012 satoshi okami
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 
 **********************************************************************************/

exports.SteeredVehicle = function(x, y, z) {
	
	/* private */
	var that = this;
	var wanderAngle1 = Math.random() * 360.0;
	var wanderAngle2 = Math.random() * 360.0;
	
	this.steeringForce = new exports.Vector3();
	this.maxForce = 1.0;
	this.wanderDistance = 10.0;
	this.wanderRadius = 5.0;
	this.wanderRange = 10.0;
	this.pathIndex = 0;
	this.pathThreshold = 20.0;
	this.pathLoop = false;
	this.inSightDist = 120.0;
	this.tooCloseDist = 20.0;
	
	this.wander = function() {
		
		function getOffset(r, angle1, angle2) {
			
			var a1 = (angle1 * Math.PI / 180);
			var a2 = (angle2 * Math.PI / 180);
			
			var offset = new exports.Vector3();
			offset.x = (r * Math.sin(a1) * Math.cos(a2));
			offset.y = (r * Math.sin(a1) * Math.sin(a2));
			offset.z = (r * Math.cos(a1));
			
			return offset;
		};
		
		var center = new exports.Vector3();
		var offset = new exports.Vector3();
		
		center.set(that.velocity);
		center.normalize();
		center.multiplyScalar( that.wanderDistance );
		offset = getOffset(that.wanderRadius, wanderAngle1, wanderAngle2);
		wanderAngle1 += (Math.random() * that.wanderRange - that.wanderRange * .5);
		wanderAngle2 += (Math.random() * that.wanderRange - that.wanderRange * .5);
		that.steeringForce.addSelf( center.addSelf( offset ) );
	};
	
	exports.Vehicle.call(this, x, y, z);
};

exports.SteeredVehicle.prototype = new exports.Vehicle();

exports.SteeredVehicle.prototype.addForce = function(/* BOIDS.Vector3 */force) {
	
	if ( typeof force == "object" ) {
		this.steeringForce.addSelf( force );
	} else if (typeof force == "number") {
		this.steeringForce.addScalar( force );
	}
};

exports.SteeredVehicle.prototype.Vehicle_update = exports.SteeredVehicle.prototype.update;
exports.SteeredVehicle.prototype.update = function() {
	
	this.steeringForce.limitScalar( this.maxForce );
	this.steeringForce.multiplyScalar( 1.0 / this.mass );
	this.velocity.addSelf( this.steeringForce );
	this.Vehicle_update();
	this.steeringForce.set(0, 0, 0);
};

exports.SteeredVehicle.prototype.seek = function(/* BOIDS.Vector3 */target)
{
	var desiredVelocity = new exports.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
};

exports.SteeredVehicle.prototype.flee = function(/* BOIDS.Vector3 */target)
{
	var desiredVelocity = new exports.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.subSelf( desiredVelocity.subSelf(this.velocity) );
};

exports.SteeredVehicle.prototype.arrive = function(/* BOIDS.Vector3 */target) {
	
	var arrivalThreshold = this.maxSpeed * 10;
	var desiredVelocity = new exports.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	
	var dist = this.position.distanceTo( target );
	if (dist > arrivalThreshold) desiredVelocity.multiplyScalar( this.maxSpeed );
	else desiredVelocity.multiplyScalar( this.maxSpeed * dist / arrivalThreshold );
	
	this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
};

// stalk target vehicle
exports.SteeredVehicle.prototype.pursue = function(/* BOIDS.Vehicle */target)
{
	var lookAheadTime = this.position.distanceTo(target.position) / this.maxSpeed;
	
	var targetVelocity = new exports.Vector3();
	targetVelocity.set(target.velocity.x, target.velocity.y, target.velocity.z);
	targetVelocity.multiplyScalar( lookAheadTime );
	
	var predictedTarget = new exports.Vector3();
	predictedTarget.set(target.position.x, target.position.y, target.position.z);
	predictedTarget.addSelf(targetVelocity);
	
	this.seek(predictedTarget);
};

exports.SteeredVehicle.prototype.evade = function(/* BOIDS.Vehicle */target)
{
	var lookAheadTime = this.position.distanceTo(target.position) / this.maxSpeed;
	
	var targetVelocity = new exports.Vector3();
	targetVelocity.set(target.velocity.x, target.velocity.y, target.velocity.z);
	targetVelocity.multiplyScalar( lookAheadTime );
	
	var predictedTarget = new exports.Vector3();
	predictedTarget.set(target.position.x, target.position.y, target.position.z);
	predictedTarget.subSelf( targetVelocity );
	
	this.flee(predictedTarget);
};

exports.SteeredVehicle.prototype.patrol = function(/* Array */paths) {
	
	var isLast = this.pathIndex >= paths.length - 1;
	
	if (this.position.distanceTo(paths[this.pathIndex]) < this.pathThreshold)
	{
		if (isLast && this.pathLoop) this.pathIndex = 0;
		else if (!isLast) this.pathIndex++;
	}
	
	if (isLast && !this.pathLoop) this.arrive(paths[this.pathIndex]);
	else this.seek(paths[this.pathIndex]);
};

exports.SteeredVehicle.prototype.flock = function(/* Array */vehicles) {
	
	var averageVelocity = new exports.Vector3();;
	var averagePosition = new exports.Vector3();;
	var inSightCnt = 0;
	
	averageVelocity.set(this.velocity.x, this.velocity.y, this.velocity.z);
	
	for (var i = 0; i < vehicles.length; i++)
	{
		if (vehicles[i].id == this.id) continue;
		if (!this.inSight(vehicles[i].position)) continue;
		
		averageVelocity.addSelf( vehicles[i].velocity );
		averagePosition.addSelf( vehicles[i].position );
		inSightCnt++;
		
		if (this.tooClose(vehicles[i].position))
		{
			this.flee(vehicles[i].position);
		}
	}
	
	if (inSightCnt > 0)
	{
		averagePosition.multiplyScalar( 1.0 / inSightCnt );
		this.seek(averagePosition);
		averageVelocity.multiplyScalar( 1.0 / inSightCnt );
		
		this.steeringForce.addSelf( averageVelocity.subSelf(this.velocity) );
	}
};

exports.SteeredVehicle.prototype.randomWalk = function() {

	var desiredVelocity = exports.getRandVec();
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.addSelf( desiredVelocity.subSelf( this.velocity ) );
};

exports.SteeredVehicle.prototype.inSight = function(/* BOIDS.Vector3 */target)
{
	if (this.position.distanceTo(target) > this.inSightDist) return false;
	
	var heading = new exports.Vector3();
	heading.set(this.velocity.x, this.velocity.y, this.velocity.z);
	heading.normalize();
	
	var difference = new exports.Vector3();
	difference.set( target );
	difference.subSelf( this.position );
	
	if (difference.dot(heading) < 0) return false;
	else return true;
};

exports.SteeredVehicle.prototype.tooClose = function(/* BOIDS.Vector3 */target) {
	
	return this.position.distanceTo(target) < this.tooCloseDist;
};
// src/core/BiologicalVehicle.js
/********************************************************************************** 
 
 Copyright (C) 2012 satoshi okami
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 
 **********************************************************************************/

exports.BiologicalVehicle = function( x, y, z ) {
	
	var age = 0.0;
	
	function aging( inc ) {
		
		age += inc;
		
		var per = (this.lifeSpan - age) / this.lifeSpan;
		
		this.remainingLifePer = Math.max( 0.0, Math.min( 1.0, per ) );
	};
	
	function isDead() {
		
		return age > this.lifeSpan;
	};
	
	this.lifeSpan = 1.0;
	this.remainingLifePer = 1.0;
	this.aging = aging;
	this.isDead = isDead;
	
	exports.SteeredVehicle.call( this, x, y, z );
};

exports.BiologicalVehicle.prototype = new exports.SteeredVehicle();

return exports;
})();
