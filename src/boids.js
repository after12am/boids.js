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

/* EXTEND THREE.JS LIBRARY */
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


/* BOIDS LIBRARY */
var boids = { VERSION: '1.0.1' };

boids.nextVehicleId = function() {
	
	var vid = 0;
	
	return function() { return vid++; };
}();


