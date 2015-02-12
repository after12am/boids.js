var camera, scene, renderer;
var birds = [];
var bird_num = 40;

function animate() {
    
    requestAnimationFrame(animate);
    render();
}

function render() {
    
    for (var i = 0; i < bird_num; i++) {
        birds[i].flock(birds.map(function(item) { return item.behavior(); }));
        birds[i].bounce($('#main').width(), $('#main').height(), 1000);
        birds[i].update();
    }
    
    renderer.render(scene, camera);
}

$(function() {
    
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
        alert('Sorry, but your graphics card does not seem to support WebGL.');
        return;
    }
    
    camera = new THREE.PerspectiveCamera(75, $('#main').width() / $('#main').height(), 1, 1000);
    camera.position.z = 350;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x646464, 0.15);
    // scene.fog = new THREE.Fog(0x646464, 1, $('#main').width());
    
    for (var i = 0; i < bird_num; i++) {
        birds.push(new Bird());
        birds[i].boid.position.x = Math.random() * $('#main').width()  - $('#main').width()  / 2;
        birds[i].boid.position.y = Math.random() * $('#main').height() - $('#main').height() / 2;
        birds[i].boid.position.z = Math.random() * $('#main').width()  - $('#main').width()  / 2;
        birds[i].boid.velocity.x = Math.random() * 4 - 2;
        birds[i].boid.velocity.y = Math.random() * 4 - 2;
        birds[i].boid.velocity.z = Math.random() * 4 - 2;
        birds[i].boid.maxForce   = Math.random() * .12;
        scene.add(birds[i]);
    }
    
    renderer.setSize($('#main').width(), $('#main').height());
    renderer.setClearColor(new THREE.Color(0xfff9f4));
    
    $('#main').append(renderer.domElement)
    
    animate();
    
});