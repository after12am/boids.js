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