var camera, scene, renderer;
var bird;
var birds = [];

function resize() {
    
    renderer.setSize($('#main').width(), $('#main').height());
    
}

function animate() {
    
    requestAnimationFrame(animate);
    render();
    renderer.render(scene, camera);
    
}

function render() {
    
    for (var i = 0; i < 20; i++) {
        
        var bird = birds[i];
        bird.wander();
        bird.bounce($('#main').width() / 2, $('#main').height() / 2, $('#main').width() / 6);
        bird.update();
        
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
    
    for (var i = 0; i < 20; i++) {
        
        var bird = new boids.THREE.Bird()
        bird.behavior.velocity.x = Math.random() - .5;
        bird.behavior.velocity.y = Math.random() - .5;
        bird.behavior.velocity.z = Math.random() - .5;
        bird.behavior.maxSpeed = 2;
        bird.behavior.wanderRange = 80 * Math.random() + 25;
        bird.behavior.wanderRadius = 60 * Math.random() + 20;
        bird.behavior.maxForce = .1
        scene.add(bird);
        
        birds.push(bird);
        
    }
    
    
    
    
    $('#main').append(renderer.domElement);
    $(window).resize(resize);
    
    animate();
    
});