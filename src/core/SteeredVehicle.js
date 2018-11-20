/**********************************************************************************

 Copyright (C) 2012 - 2016 satoshi okami

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

/**
 * @class
 * @classdesc
 */
exports.SteeredVehicle = class SteeredVehicle extends exports.Vehicle {

  /**
   * @class
   * @classdesc
   * @augments Vehicle
   * @param {float} x X-axis position
   * @param {float} y Y-axis position
   * @param {float} z Z-axis position
   */
  constructor(x, y, z) {
    super(x, y, z);

    var that = this;
    var wanderAngle1 = Math.random() * 360.0;
    var wanderAngle2 = Math.random() * 360.0;

    /** @access public */
    this.steeringForce = new exports.Vector3();
    /** @access public */
    this.maxForce = 1.0;
    /** @access public */
    this.wanderDistance = 10.0;
    /** @access public */
    this.wanderRadius = 5.0;
    /** @access public */
    this.wanderRange = 10.0;
    /** @access public */
    this.pathIndex = 0;
    /** @access public */
    this.pathThreshold = 20.0;
    /** @access public */
    this.inSightDist = 120.0;
    /** @access public */
    this.tooCloseDist = 20.0;

    /**
     * @access public
     * @function
     */
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
  }

  /**
   * @access private
   * @param {Vector3} force
   */
  addForce(force) {
    if ( typeof force == "object" ) {
      this.steeringForce.addSelf( force );
    } else if (typeof force == "number") {
      this.steeringForce.addScalar( force );
    }
  }

  /**
   * @access public
   */
  update() {
    this.steeringForce.limitScalar( this.maxForce );
    this.steeringForce.multiplyScalar( 1.0 / this.mass );
    this.velocity.addSelf( this.steeringForce );
    super.update();
    this.steeringForce.set(0, 0, 0);
  }

  /**
   * @access public
   * @param {Vector3} target position that you want to approach to
   * @description Seek to specific position. This always pass the position. This works like a pendulum.
   */
  seek(/* BOIDS.Vector3 */target) {
    var desiredVelocity = new exports.Vector3();
    desiredVelocity.set( target.x, target.y, target.z );
    desiredVelocity.subSelf( this.position );
    desiredVelocity.normalize();
    desiredVelocity.multiplyScalar( this.maxSpeed );
    this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
  }

  /**
   * @access public
   * @param {Vector3} target position that you want to move away
   * @description Move away from the specific position.
   */
  flee(/* BOIDS.Vector3 */target) {
    var desiredVelocity = new exports.Vector3();
    desiredVelocity.set( target.x, target.y, target.z );
    desiredVelocity.subSelf( this.position );
    desiredVelocity.normalize();
    desiredVelocity.multiplyScalar( this.maxSpeed );
    this.steeringForce.subSelf( desiredVelocity.subSelf(this.velocity) );
  }

  /**
   * @access public
   * @param {Vector3} target position that you want to arrive
   * @description Arrive to specific position. Not pass the position.
   */
  arrive(/* BOIDS.Vector3 */target) {

    var arrivalThreshold = this.maxSpeed * 25;
    var desiredVelocity = new exports.Vector3();
    desiredVelocity.set( target.x, target.y, target.z );
    desiredVelocity.subSelf( this.position );
    desiredVelocity.normalize();

    var dist = this.position.distanceTo( target );
    if (dist > arrivalThreshold) desiredVelocity.multiplyScalar( this.maxSpeed );
    else desiredVelocity.multiplyScalar( this.maxSpeed * dist / arrivalThreshold );

    this.steeringForce.addSelf( desiredVelocity.subSelf(this.velocity) );
  }

  /**
   * @access public
   * @param {Vehicle} target
   * @description stalk target vehicle
   */
  pursue(target) {
    var lookAheadTime = this.position.distanceTo(target.position) / this.maxSpeed;

    var targetVelocity = new exports.Vector3();
    targetVelocity.set(target.velocity.x, target.velocity.y, target.velocity.z);
    targetVelocity.multiplyScalar( lookAheadTime );

    var predictedTarget = new exports.Vector3();
    predictedTarget.set(target.position.x, target.position.y, target.position.z);
    predictedTarget.addSelf(targetVelocity);

    this.seek(predictedTarget);
  }

  /**
   * @access public
   * @param {Vehicle} target
   */
  evade(target) {
    var lookAheadTime = this.position.distanceTo(target.position) / this.maxSpeed;

    var targetVelocity = new exports.Vector3();
    targetVelocity.set(target.velocity.x, target.velocity.y, target.velocity.z);
    targetVelocity.multiplyScalar( lookAheadTime );

    var predictedTarget = new exports.Vector3();
    predictedTarget.set(target.position.x, target.position.y, target.position.z);
    predictedTarget.subSelf( targetVelocity );

    this.flee(predictedTarget);
  }

  /**
   * @access public
   * @param {Array} paths array of Vector3. position list that you want to approach to
   * @param {Boolean} loop position that you want to approach to
   */
  patrol(paths, loop) {
    loop = loop || false;

    var isLast = this.pathIndex >= paths.length - 1;

    if (this.position.distanceTo(paths[this.pathIndex]) < this.pathThreshold)
    {
      if (isLast && loop) this.pathIndex = 0;
      else if (!isLast) this.pathIndex++;
    }

    if (isLast && !loop) this.arrive(paths[this.pathIndex]);
    else this.seek(paths[this.pathIndex]);
  }

  /**
   * @access public
   * @param {Array} vehicles
   */
  flock(vehicles) {
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

      if (this.tooClose(vehicles[i].position)) {
        this.flee(vehicles[i].position);
      }
    }

    if (inSightCnt > 0) {
      averagePosition.multiplyScalar( 1.0 / inSightCnt );
      this.seek(averagePosition);
      averageVelocity.multiplyScalar( 1.0 / inSightCnt );
      this.steeringForce.addSelf( averageVelocity.subSelf(this.velocity) );
    }
  }

  /**
   * @access public
   */
  randomWalk() {
    var desiredVelocity = exports.getRandVec();
    desiredVelocity.normalize();
    desiredVelocity.multiplyScalar( this.maxSpeed );
    this.steeringForce.addSelf( desiredVelocity.subSelf( this.velocity ) );
  }

  /**
   * @access public
   * @param {Vector3} target
   */
  inSight(target) {
    if (this.position.distanceTo(target) > this.inSightDist) return false;

    var heading = new exports.Vector3();
    heading.set(this.velocity.x, this.velocity.y, this.velocity.z);
    heading.normalize();

    var difference = new exports.Vector3();
    difference.set( target );
    difference.subSelf( this.position );

    if (difference.dot(heading) < 0) return false;
    else return true;
  }

  /**
   * @access public
   * @param {Vector3} target
   */
  tooClose(target) {
    return this.position.distanceTo(target) < this.tooCloseDist;
  }
}
