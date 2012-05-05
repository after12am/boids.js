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