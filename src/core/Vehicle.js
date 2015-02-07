exports.Vehicle = function( x, y, z ) {
    
    this.id = exports.nextVehicleId();
    this.mass = 1.0;
    this.maxSpeed = 4.0;
    this.maxTrailSize = 10;
    this.position = new exports.Vector3( x, y, z );
    this.velocity = new exports.Vector3();
    this.trails = [];
};

exports.Vehicle.prototype.update = function() {
    
    this.velocity.limitScalar(this.maxSpeed);
    this.position.addSelf(this.velocity);
    this.trails.push(this.position.clone());
    
    if (this.trails.length >= this.maxTrailSize) this.trails.shift();
};

exports.Vehicle.prototype.bounce = function(w, h, d) {
    
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

exports.Vehicle.prototype.wrap = function(w, h, d) {
    
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