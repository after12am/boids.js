boids.js
========

This library allows you to simulate bird flock and fish school. This computer model of coordinated animal motion was 
designed by [Craig Reynolds](http://www.red3d.com/cwr/boids/) in 1986. This model consists of three simple rules 
which are separation, alignment and cohesion.

<img src="https://cloud.githubusercontent.com/assets/678921/6096644/567b9c7a-afe0-11e4-9be0-642b72153734.png" width="100%">
## Usage

Here is a very basic example.

```html
<script src="boids.js"></script>
<script>

window.onload = function() {

  var v = new boids.SteeredVehicle( -200, 0, 0 );
  var target = new boids.Vector3( 200, 0, 0 );

  function animate() {
    
    setTimeout(animate, 1000 / 30);
    update();
  }

  function update() {

    v.seek(target);
    v.update();
    console.log(v.position.x, v.position.y, v.position.z);
  }

  animate();
}
  
</script>
```

## License

Copyright (c) 2012-2015 Satoshi Okami. See the LICENSE file for license rights and limitations (MIT).
