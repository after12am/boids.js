# boids.js

This library provides a api that allow you to control animal motion such as bird and fish.

<h3><a href="http://after12am.github.com/boids.js/example/perfume-dev.html">View Perfume-dev Live Demo</a></h3>
<h3><a href="http://after12am.github.com/boids.js/example/birds.html">View Flocking Live Demo</a></h3>

### Usage ###

Here is a very basic example.

```html
<script src="Three.js"></script>
<script src="http://after12am.github.com/boids.js/boids.min.js"></script>
<script>

window.onload = function() {

  var v = new BOIDS.SteeredVehicle( -200, 0, 0 );
  var target = new THREE.Vector3( 200, 0, 0 );

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