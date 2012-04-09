# boids.js

boids.js provides a simple api which mainly simulates the flocking behaviour of birds.

### Note ###

boids.js requires [Three.js](https://github.com/mrdoob/three.js/). 

  
### Usage ###

Here is a basic usage. This example is just a console demo. If you want to see graphical one, please scroll down to demo below.

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

### Demo ###

<ul>
	<li><a href="http://after12am.github.com/boids.js/example/perfume-dev.html">perfume</a></li>
	<li><a href="http://after12am.github.com/boids.js/example/birds.html">flocking</a></li>
</ul>
