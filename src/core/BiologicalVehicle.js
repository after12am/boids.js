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

BOIDS.BiologicalVehicle = function( x, y, z ) {
	
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
	
	BOIDS.SteeredVehicle.call( this, x, y, z );
};

BOIDS.BiologicalVehicle.prototype = new BOIDS.SteeredVehicle();
