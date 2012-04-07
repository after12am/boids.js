// original by https://github.com/mohayonao


Bvh.Joint = function(name) {
	
	this.name = name;
	this.position = new THREE.Vector3();
};


Bvh.Motion = function() {
	
	this.bvh = null;
	this.joints = [];
};

Bvh.Motion.prototype.load = function(url, callback) {
	
	callback = callback || function(){};
	
	function onload() {
		
		that.bvh = new Bvh.Parser(xhr.response);
		that.bvh.isLoop = true;
		that.compile();
		callback();
		
	};
	
	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = onload;
	xhr.send();
};

Bvh.Motion.prototype.compile = function() {
	
	var name, o;
	var objectm = {};
	var bones = this.bvh.bones;

	for (var i = 0; i < bones.length; i++) {
		
		var bone = bones[i];
		var name = bone.name;
		
		this.joints.push( new Bvh.Joint(name) );
		
		if (bone.isEnd) {
			
			name = "*" + bone.name;
			this.joints.push( new Bvh.Joint(name) );
		}
	}
};

Bvh.Motion.prototype.update = function(time) {
	
	function calcBonePosition(bone, matrix) {

		while ( bone ) {
			
			matrix.appendRotation(+bone.Zrotation, THREE.Z_AXIS);
			matrix.appendRotation(-bone.Xrotation, THREE.X_AXIS);
			matrix.appendRotation(-bone.Yrotation, THREE.Y_AXIS);
			matrix.appendTranslation(
				 (bone.Xposition + bone.offsetX),
				 (bone.Yposition + bone.offsetY),
				-(bone.Zposition + bone.offsetZ)
			);
			bone = bone.parent;
		};
	};
	
	if (this.bvh === null) return;
	
	// frame of BVH
	this.bvh.gotoFrame(time / (this.bvh.frameTime * 1000));

	// calculate joint's position
	var a = new Float32Array(this.joints.length * 3);
	var j = 0;
	
	for (var i = 0; i < this.bvh.bones.length; i++) {
		
		var bone = this.bvh.bones[i];
		var matrix = new THREE.Matrix4();
		calcBonePosition(bone, matrix);
		var position = matrix.getPosition();
		
		a[j++] = position.x;
		a[j++] = position.y;
		a[j++] = -position.z;
		
		if (bone.isEnd) {
			
			matrix.identity();
			matrix.appendTranslation(bone.endOffsetX, bone.endOffsetY, -bone.endOffsetZ);
			calcBonePosition(bone, matrix);
			position = matrix.getPosition();
			a[j++] = position.x;
			a[j++] = position.y;
			a[j++] = -position.z;
		}
	}
	
	for (var i = 0; i < this.joints.length; i++) {
		
		this.joints[i].position.set( a[i * 3 + 0], a[i * 3 + 1] * 2, a[i * 3 + 2] * 2 );
	}
};
