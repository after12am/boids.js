exports.THREE.Bird = function () {
    
    function v(x, y, z) {
        geometry.vertices.push(new THREE.Vector3(x, y, z));
    }

    function f3(a, b, c) {
        geometry.faces.push( new THREE.Face3( a, b, c ) );
    }
    
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial({
        color: new THREE.Color( 0x646464 ),
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
    
    this.behavior = new boids.SteeredVehicle(0, 0, 0);
    this.behavior.maxForce = .15;
    
}

exports.THREE.Bird.prototype = Object.create(THREE.Mesh.prototype);

/*
  @param target boids.Vector3
*/
exports.THREE.Bird.prototype.seek = function(target) {
    
    this.behavior.seek(target);
    
}

/*
  @param target boids.Vector3
*/
exports.THREE.Bird.prototype.flee = function(target) {
    
    this.behavior.flee(target);
    
}

/*
  @param target boids.Vector3
*/
exports.THREE.Bird.prototype.arrive = function(target) {
    
    this.behavior.arrive(target);
    
}

/*
  @param paths array
  @param loop boolean
*/
exports.THREE.Bird.prototype.patrol = function(paths, loop) {
    
    this.behavior.patrol(paths, loop);
    
}

/*
  @param target boids.Vector3
*/
exports.THREE.Bird.prototype.tooClose = function(target) {
    
    this.behavior.tooClose(target);
    
}

/*
  @param array of boids.Vector3
*/
exports.THREE.Bird.prototype.flock = function(boids) {
    
    this.behavior.flock(boids);
    
}

exports.THREE.Bird.prototype.wrap = function(width, height, depth) {
    
    this.behavior.wrap(width, height, depth);
    
}

exports.THREE.Bird.prototype.bounce = function(width, height, depth) {
    
    this.behavior.bounce(width, height, depth);
    
}

exports.THREE.Bird.prototype.wander = function() {
    
    this.behavior.wander();
    
}

exports.THREE.Bird.prototype.inSight = function(target) {
    return this.behavior.inSight(target);
}

exports.THREE.Bird.prototype.update = function() {
    
    this.behavior.update();
    // this.behavior.wrap(500, 500, 400);
    this.flap();
    
    this.position.x = this.behavior.position.x;
    this.position.y = this.behavior.position.y;
    this.position.z = this.behavior.position.z;
}

/*
    private
*/
exports.THREE.Bird.prototype.flap = function() {
    
    this.rotation.y = Math.atan2(-this.behavior.velocity.z, this.behavior.velocity.x);
    this.rotation.z = Math.asin(this.behavior.velocity.y / this.behavior.velocity.length());

    this.phase = (this.phase + (Math.max(0, this.rotation.z) + 0.1)) % 62.83;
    this.geometry.verticesNeedUpdate = true;
    
    this.geometry.vertices[ 5 ].y = 
    this.geometry.vertices[ 4 ].y = Math.sin(this.phase) * 5;
    
}