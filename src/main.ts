import * as THREE from 'three';

const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event: MouseEvent) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
})

const scene = new THREE.Scene();

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial());


scene.add(cube1);

cube1.position.y = 0.4;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 4;
camera.lookAt(cube1.position)

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// const clock = new THREE.Clock();

function animation() {

    // const elapsedTime = clock.getElapsedTime();
    // cube1.rotation.y = elapsedTime;
    camera.position.x = cursor.x * 3;
    camera.position.y = - (cursor.y * 3);

    renderer.render(scene, camera);

}
