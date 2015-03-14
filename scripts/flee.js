var camera, scene, renderer;
var birdA, birdB, birdC;
var origin = new boids.Vector3(0, 0, 0);

function resize() {
    
    renderer.setSize($('#main').width(), $('#main').height());
    
}

function animate() {
    
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
    
}

function update() {
    
    birdA.seek(birdB.behavior.position);
    birdA.flee(birdC.behavior.position);
    birdA.seek(origin);
    
    if (birdA.inSight(origin)) {
        birdA.flee(origin);
    }
    
    birdB.seek(birdC.behavior.position);
    birdB.flee(birdA.behavior.position);
    birdB.seek(origin);
    
    if (birdB.inSight(origin)) {
        birdB.flee(origin);
    }
    
    birdC.seek(birdA.behavior.position);
    birdC.flee(birdB.behavior.position);
    birdC.seek(origin);
    
    if (birdC.inSight(origin)) {
        birdC.flee(origin);
    }
    
    birdA.update();
    birdB.update();
    birdC.update();
    
}

$(function() {
    
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
        alert('Sorry, but your graphics card does not seem to support WebGL.');
        return;
    }
    
    camera = new THREE.PerspectiveCamera(75, $('#main').width() / $('#main').height(), 1, 1000);
    camera.position.z = 250;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x646464, 0.15);
    renderer.setClearColor(new THREE.Color(0xfff9f4));
    resize();
    
    birdA = new boids.THREE.Bird()
    birdA.behavior.velocity.x = 1;
    birdA.behavior.velocity.y = 1;
    birdA.behavior.velocity.z = 1;
    birdA.behavior.position.x = 200;
    birdA.behavior.position.y = 200;
    birdA.behavior.position.z = 0;
    birdA.behavior.maxForce = .1
    scene.add(birdA);
    
    birdB = new boids.THREE.Bird();
    birdB.behavior.velocity.x = 1;
    birdB.behavior.velocity.y = 1;
    birdB.behavior.velocity.z = 1;
    birdB.behavior.position.x = 400;
    birdB.behavior.position.y = -200;
    birdB.behavior.position.z = 0;
    birdB.behavior.maxForce = .1
    scene.add(birdB);
    
    birdC = new boids.THREE.Bird();
    birdC.behavior.velocity.x = 1;
    birdC.behavior.velocity.y = 1;
    birdC.behavior.velocity.z = 1;
    birdC.behavior.position.x = -300;
    birdC.behavior.position.y = 260;
    birdC.behavior.position.z = 0;
    birdC.behavior.maxForce = .1
    scene.add(birdC);
    
    $('#main').append(renderer.domElement);
    $(window).resize(resize);
    
    animate();
    
});