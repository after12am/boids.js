// github -> https://github.com/after12am/boids.js

/* summarized content */


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



var boids = { VERSION: 0.1 };

boids.nextVehicleId = function() {
	
	var vid = 0;
	
	return function() { return vid++; };
}();





boids.Vehicle = function( x, y, z ) {
	
	this.id = boids.nextVehicleId();
	this.mass = 1.0;
	this.maxSpeed = 4.0;
	this.maxTrailSize = 10;
	this.position = new THREE.Vector3( x, y, z );
	this.velocity = new THREE.Vector3();
	this.trails = [];
};

boids.Vehicle.prototype.update = function() {
	
	this.velocity.limitScalar(this.maxSpeed);
	this.position.addSelf(this.velocity);
	this.trails.push(this.position.clone());
	
	if (this.trails.length >= this.maxTrailSize) this.trails.shift();
};

boids.Vehicle.prototype.bounce = function(w, h, d) {
	
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

boids.Vehicle.prototype.wrap = function(w, h, d) {
	
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


boids.SteeredVehicle = function(x, y, z) {
	
	
	var that = this;
	var wanderAngle1 = Math.random() * 360.0;
	var wanderAngle2 = Math.random() * 360.0;
	
	this.steeringForce = new THREE.Vector3();
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
			
			var offset = new THREE.Vector3();
			offset.x = (r * Math.sin(a1) * Math.cos(a2));
			offset.y = (r * Math.sin(a1) * Math.sin(a2));
			offset.z = (r * Math.cos(a1));
			
			return offset;
		};
		
		var center = new THREE.Vector3();
		var offset = new THREE.Vector3();
		
		center.set(that.velocity);
		center.normalize();
		center.multiplyScalar( that.wanderDistance );
		offset = getOffset(that.wanderRadius, wanderAngle1, wanderAngle2);
		wanderAngle1 += (Math.random() * that.wanderRange - that.wanderRange * .5);
		wanderAngle2 += (Math.random() * that.wanderRange - that.wanderRange * .5);
		that.steeringForce.addSelf( center.addSelf( offset ) );
	};
	
	this.randomWalk = function() {
		
		function getRandVec() {

			var vec = new THREE.Vector3();
			var a1 = (Math.random() * 360 * Math.PI / 180);
			var a2 = (Math.random() * 2 * Math.PI);

			vec.x = (Math.sin(a1) * Math.cos(a2));
			vec.y = (Math.sin(a1) * Math.sin(a2));
			vec.z = (Math.cos(a1));
			return vec;
		};
		
		var a1 = (Math.random() * 360 * PI / 180);
		var a2 = (Math.random() * 2 * PI);

		var desiredVelocity = new THREE.Vector3();
		desiredVelocity.x = (Math.sin(a1) * Math.cos(a2));
		desiredVelocity.y = (Math.sin(a1) * Math.sin(a2));
		desiredVelocity.z = (Math.cos(a1));
		desiredVelocity.normalize();
		desiredVelocity.multiplyScalar( maxSpeed );
		steeringForce.addSelf( desiredVelocity.subSelf( velocity ) );
	};
	
	boids.Vehicle.call(this, x, y, z);
};

boids.SteeredVehicle.prototype = new boids.Vehicle();

boids.SteeredVehicle.prototype.addForce = function(vec) {
	
	this.steeringForce.addScalar( vec );
};

boids.SteeredVehicle.prototype.Vehicle_update = boids.SteeredVehicle.prototype.update;
boids.SteeredVehicle.prototype.update = function() {
	
	this.steeringForce.limitScalar( this.maxForce );
	this.steeringForce.multiplyScalar( 1.0 / this.mass );
	this.velocity.addSelf( this.steeringForce );
	this.Vehicle_update();
	this.steeringForce.set(0, 0, 0);
};

boids.SteeredVehicle.prototype.seek = function(target)
{
	var desiredVelocity = new THREE.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
};

boids.SteeredVehicle.prototype.flee = function(target)
{
	var desiredVelocity = new THREE.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.subSelf( desiredVelocity.subSelf(this.velocity) );
};

boids.SteeredVehicle.prototype.arrive = function(target) {
	
	var arrivalThreshold = this.maxSpeed * 10;
	var desiredVelocity = new THREE.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	
	var dist = this.position.distanceTo( target );
	if (dist > arrivalThreshold) desiredVelocity.multiplyScalar( this.maxSpeed );
	else desiredVelocity.multiplyScalar( this.maxSpeed * dist / arrivalThreshold );
	
	this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
};

// stalk target vehicle
boids.SteeredVehicle.prototype.pursue = function(target)
{
	var lookAheadTime = this.position.distanceTo(target.position) / this.maxSpeed;
	
	var targetVelocity = new THREE.Vector3();
	targetVelocity.set(target.velocity.x, target.velocity.y, target.velocity.z);
	targetVelocity.multiplyScalar( lookAheadTime );
	
	var predictedTarget = new THREE.Vector3();
	predictedTarget.set(target.position.x, target.position.y, target.position.z);
	predictedTarget.addSelf(targetVelocity);
	
	this.seek(predictedTarget);
};

boids.SteeredVehicle.prototype.evade = function(target)
{
	var lookAheadTime = this.position.distanceTo(target.position) / this.maxSpeed;
	
	var targetVelocity = new THREE.Vector3();
	targetVelocity.set(target.velocity.x, target.velocity.y, target.velocity.z);
	targetVelocity.multiplyScalar( lookAheadTime );
	
	var predictedTarget = new THREE.Vector3();
	predictedTarget.set(target.position.x, target.position.y, target.position.z);
	predictedTarget.subSelf( targetVelocity );
	
	this.flee(predictedTarget);
};

boids.SteeredVehicle.prototype.patrol = function(paths) {
	
	var isLast = this.pathIndex >= paths.length - 1;
	
	if (this.position.distanceTo(paths[this.pathIndex]) < this.pathThreshold)
	{
		if (isLast && this.pathLoop) this.pathIndex = 0;
		else if (!isLast) this.pathIndex++;
	}
	
	if (isLast && !this.pathLoop) this.arrive(paths[this.pathIndex]);
	else this.seek(paths[this.pathIndex]);
};

boids.SteeredVehicle.prototype.flock = function(vehicles) {
	
	var averageVelocity = new THREE.Vector3();;
	var averagePosition = new THREE.Vector3();;
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

boids.SteeredVehicle.prototype.inSight = function(target)
{
	if (this.position.distanceTo(target) > this.inSightDist) return false;
	
	var heading = new THREE.Vector3();
	heading.set(this.velocity.x, this.velocity.y, this.velocity.z);
	heading.normalize();
	
	var difference = new THREE.Vector3();
	difference.set( target );
	difference.subSelf( this.position );
	
	if (difference.dot(heading) < 0) return false;
	else return true;
};

boids.SteeredVehicle.prototype.tooClose = function(target) {
	
	return this.position.distanceTo(target) < this.tooCloseDist;
};
