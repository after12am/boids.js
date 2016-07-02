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
 * @augments THREE.Mesh
 * @param {Object} options
 */
 exports.THREE.Bird = function (options)
 {
  function v(x, y, z)
  {
    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }

  function f3(a, b, c)
  {
    geometry.faces.push( new THREE.Face3( a, b, c ) );
  }

  options = options || {};
  options.color = (options.color == undefined) ? 0x646464 : options.color;
  options.position = (options.position == undefined) ? new exports.Vector3( 0, 0, 0 ) : options.position;

  var geometry = new THREE.Geometry();
  var material = new THREE.MeshBasicMaterial({
    color: new THREE.Color( options.color ),
    side: THREE.DoubleSide
  });

  v(   5,   0,   0 );
  v( - 5, - 2,   1 );
  v( - 5,   0,   0 );
  v( - 5, - 2, - 1 );

  v(   0,   2, - 6 );
  v(   0,   2,   6 );
  v(   2,   0,   0 );
  v( - 3,   0,   0 );

  f3( 0, 2, 1 ); // body
  f3( 0, 3, 2 );

  f3( 4, 7, 6 ); // right wing
  f3( 5, 6, 7 ); //　left wing

  THREE.Mesh.call(this, geometry, material);

  this.phase = Math.floor(Math.random() * 62.83);

  this.behavior = new exports.SteeredVehicle(
    options.position.x,
    options.position.y,
    options.position.z
  );

  this.behavior.maxForce = .15;
}

exports.THREE.Bird.prototype = Object.create(THREE.Mesh.prototype);

/**
 * @access public
 * @param {Vector3} target position that you want to approach to
 * @see {@link SteeredVehicle#seek}
 */
exports.THREE.Bird.prototype.seek = function(target)
{
  this.behavior.seek(target);
}

/**
 * @access public
 * @param {Vector3} target position that you want to move away
 * @see {@link SteeredVehicle#flee}
 */
exports.THREE.Bird.prototype.flee = function(target)
{
  this.behavior.flee(target);
}

/**
 * @access public
 * @param {Vector3} target position that you want to arrive
 * @see {@link SteeredVehicle#arrive}
 */
exports.THREE.Bird.prototype.arrive = function(target)
{
  this.behavior.arrive(target);
}

/**
 * @access public
 * @param {Array} paths array of Vector3. position list that you want to approach to
 * @see {@link SteeredVehicle#patrol}
 */
exports.THREE.Bird.prototype.patrol = function(paths, loop)
{
  this.behavior.patrol(paths, loop);
}

/**
 * @access public
 * @param {Array} vehicles vehicle array list
 * @see {@link SteeredVehicle#flock}
 */
exports.THREE.Bird.prototype.flock = function(vehicles)
{
  this.behavior.flock(boids);
}

/**
 * @access public
 * @param {Vector3} target
 * @see {@link SteeredVehicle#tooClose}
 */
exports.THREE.Bird.prototype.tooClose = function(target)
{
  this.behavior.tooClose(target);
}

/**
 * @access public
 * @param {int} width
 * @param {int} height
 * @param {int} depth
 */
exports.THREE.Bird.prototype.wrap = function(width, height, depth)
{
  this.behavior.wrap(width, height, depth);
}

/**
 * @access public
 * @param {int} width
 * @param {int} height
 * @param {int} depth
 */
exports.THREE.Bird.prototype.bounce = function(width, height, depth)
{
  this.behavior.bounce(width, height, depth);
}

/**
 * @access public
 */
exports.THREE.Bird.prototype.wander = function()
{
  this.behavior.wander();
}

/**
 * @access public
 * @param {Vector3} target
 * @see {@link SteeredVehicle#inSight}
 */
exports.THREE.Bird.prototype.inSight = function(target)
{
  return this.behavior.inSight(target);
}

/**
 * @access public
 * @param {Object} options
 */
exports.THREE.Bird.prototype.update = function(options)
{
  options = options || {};

  this.behavior.update();
  // this.behavior.wrap(500, 500, 400);
  this.flap();

  this.position.x = this.behavior.position.x;
  this.position.y = this.behavior.position.y;
  this.position.z = this.behavior.position.z;

  if (options.color != undefined) {
    this.material.color = new THREE.Color(options.color);
  }
}

/**
 * @access private
 */
exports.THREE.Bird.prototype.flap = function()
{
  this.rotation.y = Math.atan2(-this.behavior.velocity.z, this.behavior.velocity.x);
  this.rotation.z = Math.asin(this.behavior.velocity.y / this.behavior.velocity.length());

  this.phase = (this.phase + (Math.max(0, this.rotation.z) + 0.1)) % 62.83;
  this.geometry.verticesNeedUpdate = true;

  this.geometry.vertices[5].y =
  this.geometry.vertices[4].y = Math.sin(this.phase) * 5;
}
