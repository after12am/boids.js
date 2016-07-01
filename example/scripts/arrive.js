var camera, scene, renderer;
var bird;
var paths = [new boids.Vector3(0, 0, 190), new boids.Vector3(30, 30, 0)];
var path_index = 0;

function resize() {
    
    renderer.setSize($('#main').width(), $('#main').height());
    
}

function animate() {
    
    requestAnimationFrame(animate);
    render();
    renderer.render(scene, camera);
    
}

function render() {
    
    // hacking for probably a bug around core library.
    // this is extremely bad workaround.
    // I will fix this in the near future.
    if (bird.position.distanceTo(paths[path_index]) > 1) {
        bird.arrive(paths[path_index]);
        bird.update();
    } else {
        bird.flap();
    }
    
}

$(function() {
    
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
        alert('Sorry, but your graphics card does not seem to support WebGL.');
        return;
    }
    
    camera = new THREE.PerspectiveCamera(75, $('#main').width() / $('#main').height(), 1, 1000);
    camera.position.z = 200;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x646464, 0.15);
    renderer.setClearColor(new THREE.Color(0xfff9f4));
    resize();
    
    bird = new boids.THREE.Bird()
    bird.behavior.velocity.x = 1;
    bird.behavior.velocity.y = 1;
    bird.behavior.velocity.z = 1;
    bird.behavior.position = paths[1];
    bird.behavior.maxForce = .1
    scene.add(bird);
    
    
    $('#main').append(renderer.domElement);
    $(window).resize(resize);
    
    animate();
    
});