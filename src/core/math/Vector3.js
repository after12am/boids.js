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
exports.Vector3 = class Vector3 {

  /**
   * @param {float} x X-axis position
   * @param {float} y Y-axis position
   * @param {float} z Z-axis position
   */
  constructor( x, y, z ) {
    /** @access public */
    this.x = x || 0;
    /** @access public */
    this.y = y || 0;
    /** @access public */
    this.z = z || 0;
  }

  /**
   * @access public
   * @param {float} x
   * @param {float} y
   * @param {float} z
   */
  set( x, y, z ) {

    this.x = x;
    this.y = y;
    this.z = z;

    return this;

  }

  /**
   * @access public
   * @param {float} x
   */
  setX( x ) {

    this.x = x;

    return this;

  }

  /**
   * @access public
   * @param {float} y
   */
  setY( y ) {

    this.y = y;

    return this;

  }

  /**
   * @access public
   * @param {float} z
   */
  setZ( z ) {

    this.z = z;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  copy( v ) {

    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;

  }

  /**
   * @access public
   */
  clone() {

    return new exports.Vector3( this.x, this.y, this.z );

  }

  /**
   * @access public
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  add( v1, v2 ) {

    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  addSelf( v ) {

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;

  }

  /**
   * @access public
   * @param {float} s
   */
  addScalar( s ) {

    this.x += s;
    this.y += s;
    this.z += s;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  sub( v1, v2 ) {

    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  subSelf( v ) {

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} a
   * @param {Vector3} b
   */
  multiply( a, b ) {

    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  multiplySelf( v ) {

    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;

  }

  /**
   * @access public
   * @param {float} s
   */
  multiplyScalar( s ) {

    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  divideSelf( v ) {

    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;

  }

  /**
   * @access public
   * @param {float} s
   */
  divideScalar( s ) {

    if ( s ) {

      this.x /= s;
      this.y /= s;
      this.z /= s;

    } else {

      this.x = 0;
      this.y = 0;
      this.z = 0;

    }

    return this;

  }

  /**
   * @access public
   */
  negate() {

    return this.multiplyScalar( -1 );

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  dot( v ) {

    return this.x * v.x + this.y * v.y + this.z * v.z;

  }

  /**
   * @access public
   */
  lengthSq() {

    return this.x * this.x + this.y * this.y + this.z * this.z;

  }

  /**
   * @access public
   */
  length() {

    return Math.sqrt( this.lengthSq() );

  }

  /**
   * @access public
   */
  lengthManhattan() {

    // correct version
    // return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

    return this.x + this.y + this.z;

  }

  /**
   * @access public
   */
  normalize() {

    return this.divideScalar( this.length() );

  }

  /**
   * @access public
   * @param {float} l
   */
  setLength( l ) {

    return this.normalize().multiplyScalar( l );

  }

  /**
   * @access public
   * @param {Vector3} a
   * @param {Vector3} b
   */
  cross( a, b ) {

    this.x = a.y * b.z - a.z * b.y;
    this.y = a.z * b.x - a.x * b.z;
    this.z = a.x * b.y - a.y * b.x;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  crossSelf( v ) {

    var x = this.x, y = this.y, z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  distanceTo( v ) {

    return Math.sqrt( this.distanceToSquared( v ) );

  }

  /**
   * @access public
   * @param {Vector3} v
   */
  distanceToSquared( v ) {

    return new exports.Vector3().sub( this, v ).lengthSq();

  }

  /**
   * @access private
   */
  // setPositionFromMatrix( m ) {
  //
  //   this.x = m.n14;
  //   this.y = m.n24;
  //   this.z = m.n34;
  //
  // }

  /**
   * @access private
   */
  // setRotationFromMatrix( m ) {
  //
  //   var cosY = Math.cos( this.y );
  //
  //   this.y = Math.asin( m.n13 );
  //
  //   if ( Math.abs( cosY ) > 0.00001 ) {
  //
  //     this.x = Math.atan2( - m.n23 / cosY, m.n33 / cosY );
  //     this.z = Math.atan2( - m.n12 / cosY, m.n11 / cosY );
  //
  //   } else {
  //
  //     this.x = 0;
  //     this.z = Math.atan2( m.n21, m.n22 );
  //
  //   }
  //
  // }

  /**
   * @access public
   */
  isZero() {

    return ( this.lengthSq() < 0.0001 /* almostZero */ );

  }

  /**
   * @access public
   * @param {float} s
   */
  limitScalar( s ) {
    var lengthSquared = this.lengthSq();
    if( lengthSquared > s * s && lengthSquared > 0 ) {
      var ratio = s / Math.sqrt( lengthSquared );
      this.x *= ratio;
      this.y *= ratio;
      this.z *= ratio;
    }
    return this;
  }
}
