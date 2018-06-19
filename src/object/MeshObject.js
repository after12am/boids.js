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
exports.THREE.MeshObject = function (geometry, material)
{
  THREE.Mesh.call(this, geometry, material);
}

exports.THREE.MeshObject.prototype = Object.create(THREE.Mesh.prototype);

exports.THREE.MeshObject.prototype.v = function(x, y, z)
{
  // geometry.vertices.push(new THREE.Vector3(x, y, z));
}

exports.THREE.MeshObject.prototype.f3 = function(a, b, c)
{
  // geometry.faces.push( new THREE.Face3( a, b, c ) );
}
