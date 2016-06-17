var camera, scene, renderer;
var bird, rot = 0, before;

var paths = [
  new boids.Vector3( 60,  40, -40),
  new boids.Vector3(-20,  40, -40),
  new boids.Vector3(-20,  0, 40)
];

function resize() {

    renderer.setSize($('#main').width(), $('#main').height());

}

function animate() {

    requestAnimationFrame( animate );
    update();
    renderer.render(scene, camera);

}

function update() {

    bird.patrol(paths, true);

    rot++;
    var colors = [0x88b7d5, 0xff4422];
    var after = colors[Math.round(rot / 30) % 2];
    if (before != after) before = after;
    bird.update({ color: before });
}

$(function() {

    try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
        alert('Sorry, but your graphics card does not seem to support WebGL.');
        return;
    }

    camera = new THREE.PerspectiveCamera(75, $('#main').width() / $('#main').height(), 1, 10000);
    camera.position.z = 100;

    bird = new boids.THREE.Bird({
      color: 0x88b7d5,
      position: new boids.Vector3( 20, 0, 0 )
    });

    scene = new THREE.Scene();
    scene.add(bird);

    renderer.setClearColor(new THREE.Color(0xfff9f4));
    resize();

    $('#main').append(renderer.domElement)
    $(window).resize(resize);

    animate();

});
