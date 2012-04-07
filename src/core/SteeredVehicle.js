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

BOIDS.SteeredVehicle = function(x, y, z) {
	
	/* private */
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
	
	BOIDS.Vehicle.call(this, x, y, z);
};

BOIDS.SteeredVehicle.prototype = new BOIDS.Vehicle();

BOIDS.SteeredVehicle.prototype.addForce = function(/* THREE.Vector3 */force) {
	
	if ( typeof force == "object" ) {
		this.steeringForce.addSelf( force );
	} else if (typeof force == "number") {
		this.steeringForce.addScalar( force );
	}
};

BOIDS.SteeredVehicle.prototype.Vehicle_update = BOIDS.SteeredVehicle.prototype.update;
BOIDS.SteeredVehicle.prototype.update = function() {
	
	this.steeringForce.limitScalar( this.maxForce );
	this.steeringForce.multiplyScalar( 1.0 / this.mass );
	this.velocity.addSelf( this.steeringForce );
	this.Vehicle_update();
	this.steeringForce.set(0, 0, 0);
};

BOIDS.SteeredVehicle.prototype.seek = function(/* THREE.Vector3 */target)
{
	var desiredVelocity = new THREE.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
};

BOIDS.SteeredVehicle.prototype.flee = function(/* THREE.Vector3 */target)
{
	var desiredVelocity = new THREE.Vector3();
	desiredVelocity.set( target.x, target.y, target.z );
	desiredVelocity.subSelf( this.position );
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.subSelf( desiredVelocity.subSelf(this.velocity) );
};

BOIDS.SteeredVehicle.prototype.arrive = function(/* THREE.Vector3 */target) {
	
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
BOIDS.SteeredVehicle.prototype.pursue = function(/* Vehicle */target)
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

BOIDS.SteeredVehicle.prototype.evade = function(/* Vehicle */target)
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

BOIDS.SteeredVehicle.prototype.patrol = function(/* Array */paths) {
	
	var isLast = this.pathIndex >= paths.length - 1;
	
	if (this.position.distanceTo(paths[this.pathIndex]) < this.pathThreshold)
	{
		if (isLast && this.pathLoop) this.pathIndex = 0;
		else if (!isLast) this.pathIndex++;
	}
	
	if (isLast && !this.pathLoop) this.arrive(paths[this.pathIndex]);
	else this.seek(paths[this.pathIndex]);
};

BOIDS.SteeredVehicle.prototype.flock = function(/* Array */vehicles) {
	
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

BOIDS.SteeredVehicle.prototype.randomWalk = function() {

	var desiredVelocity = this.getRandVec();
	desiredVelocity.normalize();
	desiredVelocity.multiplyScalar( this.maxSpeed );
	this.steeringForce.addSelf( desiredVelocity.subSelf( this.velocity ) );
};

BOIDS.SteeredVehicle.prototype.getRandVec = function() {

	var vec = new THREE.Vector3();
	var a1 = (Math.random() * 360 * Math.PI / 180);
	var a2 = (Math.random() * 2 * Math.PI);

	vec.x = (Math.sin(a1) * Math.cos(a2));
	vec.y = (Math.sin(a1) * Math.sin(a2));
	vec.z = (Math.cos(a1));

	return vec;
};

BOIDS.SteeredVehicle.prototype.inSight = function(/* THREE.Vector3 */target)
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

BOIDS.SteeredVehicle.prototype.tooClose = function(/* THREE.Vector3 */target) {
	
	return this.position.distanceTo(target) < this.tooCloseDist;
};