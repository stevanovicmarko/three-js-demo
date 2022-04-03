import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial());

scene.add(cube);

cube.position.y = 0.4;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 4;
camera.lookAt(cube.position);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animation() {
    controls.update();
    renderer.render(scene, camera);
}
