// original by https://github.com/mohayonao


Bvh.Joint = function(name) {
	
	this.name = name;
	this.position = new THREE.Vector3();
};


Bvh.Motion = function(target) {
	
	this.bvh = null;
	this.joints = [];
	
	
	this.target = target;
	this.group = new THREE.Object3D();
	this.target.add(this.group);
};

Bvh.Motion.prototype.load = function(url, callback) {
	
	function onload() {
		
		that.bvh = new Bvh.Parser(xhr.response);
		that.bvh.isLoop = true;
		that.compile();
		
		if (callback) callback();
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
	var group   = this.group;
	var bones = this.bvh.bones;

	for (var i = 0; i < bones.length; i++) {
		
		var bone = bones[i];
		var name = bone.name;
		
		this.joints.push( new Bvh.Joint(name) );
		
		
		o = this.createObject({name:name});
		objectm[o.name] = o;
		o.position.x = bone.offsetX;
		o.position.y = bone.offsetY;
		o.position.z = bone.offsetZ;
		group.add(o);
		
		
		if (bone.isEnd) {
			
			name = "*" + bone.name;
			this.joints.push( new Bvh.Joint(name) );
			
			
			o = this.createObject({name:name});
			objectm[o.name] = o;
			o.position.x = bone.endOffsetX;
			o.position.y = bone.endOffsetY;
			o.position.z = bone.endOffsetZ;
			group.add(o);
		}
	}
};

Bvh.Motion.prototype.createObject = function(options) {
	
	function ovalProgram(context) {
		
		context.beginPath();
		context.arc(0, 0, 1, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	};

	var o, size, color;
	var DATATABLE = {
		"Hips"  : {size: 8, color:0x00ffff},
		"Chest" : {size: 4, color:0xffffff},
		"Chest2": {size: 4, color:0xffffff},
		"Chest3": {size: 4, color:0xffffff},
		"Chest4": {size: 8, color:0x00ff00},
		"Neck"  : {size: 4, color:0xffffff},
		"Head"  : {size: 4, color:0xffffff},
		"*Head" : {size: 8, color:0xffff00},
		"RightCollar"  : {size: 4, color:0xffffff},
		"RightShoulder": {size: 4, color:0xffffff},
		"RightElbow"   : {size: 4, color:0xffffff},
		"RightWrist"   : {size: 6, color:0xffffff},
		"*RightWrist"  : {size: 8, color:0xffff00},
		"LeftCollar"   : {size: 4, color:0xffffff},
		"LeftShoulder" : {size: 4, color:0xffffff},
		"LeftElbow"    : {size: 4, color:0xffffff},
		"LeftWrist"    : {size: 6, color:0xffffff},
		"*LeftWrist"   : {size: 8, color:0xffff00},
		"RightHip"     : {size: 4, color:0xffffff},
		"RightKnee"    : {size: 4, color:0xffffff},
		"RightAnkle"   : {size: 4, color:0xffffff},
		"RightToe"     : {size: 6, color:0xffffff},
		"*RightToe"    : {size: 8, color:0xffff00},
		"LeftHip"      : {size: 4, color:0xffffff},
		"LeftKnee"     : {size: 4, color:0xffffff},
		"LeftAnkle"    : {size: 4, color:0xffffff},
		"LeftToe"      : {size: 6, color:0xffffff},
		"*LeftToe"     : {size: 8, color:0xffff00}
	};;

	if (DATATABLE[options.name]) {
		size  = DATATABLE[options.name].size;
		color = DATATABLE[options.name].color;
	}
	
	if (typeof(size ) === "undefined") size  = 1;
	if (typeof(color) === "undefined") color = 0xffffff;

	o = new THREE.Particle(new THREE.ParticleCanvasMaterial({ color:color, program:ovalProgram }));
	o.name = options.name;
	o.scale.x = o.scale.y = o.scale.z = size;
	
	return o;
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
	var a = new Float32Array(this.group.children.length * 3);
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

Bvh.Motion.prototype.draw = function() {
	
	for (var i = 0; i < this.joints.length; i++) {
		
		var o = this.group.children[i];
		
		o.position.copy(this.joints[i].position);
	}
};
