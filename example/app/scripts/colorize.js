var camera, scene, renderer;
var bird, target;
var rot = 0;

function resize() {

    renderer.setSize($('#main').width(), $('#main').height());

}

function animate() {

    requestAnimationFrame( animate );
    update();
    renderer.render(scene, camera);

}
var before;
function update() {

    if (bird.inSight(target)) {
        target = new boids.Vector3(
            Math.random() * $('#main').width()  / 3 - $('#main').width()  / 6,
            Math.random() * $('#main').height() / 3 - $('#main').height() / 6,
            Math.random() * $('#main').width()  / 3 - $('#main').width()  / 6
        );
    }

    bird.seek(target);

    rot++;
    var colors = [0x88b7d5, 0xff4422];
    var after = colors[Math.round(rot / 100) % 2];
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

    bird = new boids.THREE.Bird({ color: 0x88b7d5 });
    target = new boids.Vector3();

    scene = new THREE.Scene();
    scene.add(bird);

    renderer.setClearColor(new THREE.Color(0xfff9f4));
    resize();

    $('#main').append(renderer.domElement)
    $(window).resize(resize);

    animate();

});
