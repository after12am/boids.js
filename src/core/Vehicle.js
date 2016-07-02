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
 * @param {float} x X-axis position
 * @param {float} y Y-axis position
 * @param {float} z Z-axis position
 */
 exports.Vehicle = function( x, y, z )
 {
  this.id = exports.nextVehicleId();
  /** @access private */
  this.mass = 1.0;
  /** @access private */
  this.maxSpeed = 4.0;
  /** @access private */
  this.maxTrailSize = 10;
  /** @access private */
  this.position = new exports.Vector3( x, y, z );
  /** @access private */
  this.velocity = new exports.Vector3();
  /** @access private */
  this.trails = [];
};

/**
 * @access public
 */
exports.Vehicle.prototype.update = function()
{
  this.velocity.limitScalar(this.maxSpeed);
  this.position.addSelf(this.velocity);
  this.trails.push(this.position.clone());

  if (this.trails.length >= this.maxTrailSize) {
    this.trails.shift();
  }
};

/**
 * @access public
 * @param {int} w width
 * @param {int} h height
 * @param {int} d depth
 */
exports.Vehicle.prototype.bounce = function(w, h, d)
{
  if (this.position.x > w * .5) {
    this.position.x = w * .5;
    this.velocity.x *= -1;
  } else if (this.position.x < - w * .5) {
    this.position.x = - w * .5;
    this.velocity.x *= -1;
  }

  if (this.position.y > h * .5) {
    this.position.y = h * .5;
    this.velocity.y *= -1;
  } else if (this.position.y < - h * .5) {
    this.position.y = - h * .5;
    this.velocity.y *= -1;
  }

  if (this.position.z > d * .5) {
    this.position.z = d * .5;
    this.velocity.z *= -1;
  } else if (this.position.z < - d * .5) {
    this.position.z = - d * .5;
    this.velocity.z *= -1;
  }
};

/**
 * @access public
 * @param {int} w width
 * @param {int} h height
 * @param {int} d depth
 */
exports.Vehicle.prototype.wrap = function(w, h, d)
{
  if (this.position.x > w * .5) {
    this.position.x = - w * .5;
  } else if (this.position.x < - w * .5) {
    this.position.x = w * .5;
  }

  if (this.position.y > h * .5) {
    this.position.y = - h * .5;
  } else if (this.position.y < - h * .5) {
    this.position.y = h * .5;
  }

  if (this.position.z > d * .5) {
    this.position.z = - d * .5;
  } else if (this.position.z < - d * .5) {
    this.position.z = d * .5;
  }
};
