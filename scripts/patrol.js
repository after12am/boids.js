var camera, scene, renderer;
var bird;

var paths = [
    new boids.Vector3( 30,  10, -30), 
    new boids.Vector3(-30,  10, -30), 
    new boids.Vector3(-30, -10,  30),
    new boids.Vector3( 30, -10,  30)
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
    bird.update();
    
}

$(function() {
    
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
        alert('Sorry, but your graphics card does not seem to support WebGL.');
        return;
    }
    
    camera = new THREE.PerspectiveCamera(75, $('#main').width() / $('#main').height(), 1, 10000);
    camera.position.z = 120;
    
    bird = new boids.THREE.Bird();
    bird.behavior.maxForce = .1;
    
    scene = new THREE.Scene();
    scene.add(bird);
    
    renderer.setClearColor(new THREE.Color(0xfff9f4));
    resize();
    
    $('#main').append(renderer.domElement)
    $(window).resize(resize);
    
    animate();
    
});