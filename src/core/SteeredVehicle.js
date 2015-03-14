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
    
    var arrivalThreshold = this.maxSpeed * 25;
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

exports.SteeredVehicle.prototype.patrol = function(/* Array */paths, loop) {
    
    loop = loop || false;
    
    var isLast = this.pathIndex >= paths.length - 1;
    
    if (this.position.distanceTo(paths[this.pathIndex]) < this.pathThreshold)
    {
        if (isLast && loop) this.pathIndex = 0;
        else if (!isLast) this.pathIndex++;
    }
    
    if (isLast && !loop) this.arrive(paths[this.pathIndex]);
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