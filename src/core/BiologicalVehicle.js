exports.BiologicalVehicle = function( x, y, z ) {
    
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
    
    exports.SteeredVehicle.call( this, x, y, z );
};

exports.BiologicalVehicle.prototype = new exports.SteeredVehicle();
