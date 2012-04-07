// original by https://github.com/mohayonao

/**
 *  Add Flash-like functions
 */
(function() {
    "use strict";
    
    THREE.X_AXIS = new THREE.Vector3(1, 0, 0);
    THREE.Y_AXIS = new THREE.Vector3(0, 1, 0);
    THREE.Z_AXIS = new THREE.Vector3(0, 0, 1);
    
    THREE.Matrix4.prototype.appendRotation = function(deg, axis) {
        var degPIper360 = deg / 360 * Math.PI;
        var w = Math.cos(degPIper360);
        var x = Math.sin(degPIper360) * axis.x;
        var y = Math.sin(degPIper360) * axis.y;
        var z = Math.sin(degPIper360) * axis.z;
        
	    var n11 = this.n11, n12 = this.n12, n13 = this.n13, n14 = this.n14,
	    n21 = this.n21, n22 = this.n22, n23 = this.n23, n24 = this.n24,
	    n31 = this.n31, n32 = this.n32, n33 = this.n33, n34 = this.n34,
	    n41 = this.n41, n42 = this.n42, n43 = this.n43, n44 = this.n44;
        
        var m11 = (w * w + x * x - y * y - z * z),
        m12 = 2 * (y * x - w * z),
        m13 = 2 * (z * x + w * y),
        m14 = 0,
        m21 = 2 * (y * x + w * z),
        m22 = (w * w - x * x + y * y - z * z),
        m23 = 2 * (z * y - w * x),
        m24 = 0,
        m31 = 2 * (z * x - w * y),
        m32 = 2 * (w * x + z * y),
        m33 = (w * w - x * x - y * y + z * z),
        m34 = 0,
        m41 = 0,
        m42 = 0,
        m43 = 0,
        m44 = 1;
        
        this.n11 = m11 * n11 + m12 * n21 + m13 * n31 + m14 * n41;
        this.n12 = m11 * n12 + m12 * n22 + m13 * n32 + m14 * n42;
        this.n13 = m11 * n13 + m12 * n23 + m13 * n33 + m14 * n43;
        this.n14 = m11 * n14 + m12 * n24 + m13 * n34 + m14 * n44;
        this.n21 = m21 * n11 + m22 * n21 + m23 * n31 + m24 * n41;
        this.n22 = m21 * n12 + m22 * n22 + m23 * n32 + m24 * n42;
        this.n23 = m21 * n13 + m22 * n23 + m23 * n33 + m24 * n43;
        this.n24 = m21 * n14 + m22 * n24 + m23 * n34 + m24 * n44;
        this.n31 = m31 * n11 + m32 * n21 + m33 * n31 + m34 * n41;
        this.n32 = m31 * n12 + m32 * n22 + m33 * n32 + m34 * n42;
        this.n33 = m31 * n13 + m32 * n23 + m33 * n33 + m34 * n43;
        this.n34 = m31 * n14 + m32 * n24 + m33 * n34 + m34 * n44;
        this.n41 = m41 * n11 + m42 * n21 + m43 * n31 + m44 * n41;
        this.n42 = m41 * n12 + m42 * n22 + m43 * n32 + m44 * n42;
        this.n43 = m41 * n13 + m42 * n23 + m43 * n33 + m44 * n43;
        this.n44 = m41 * n14 + m42 * n24 + m43 * n34 + m44 * n44;
    };
    THREE.Matrix4.prototype.appendTranslation = function(x, y, z) {
        this.n14 += x;
        this.n24 += y;
        this.n34 += z;
    };
}());


/*---------------------------------
	BVH PARSER
 ---------------------------------*/
var Bvh = {};