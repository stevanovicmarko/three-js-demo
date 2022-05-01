import * as THREE from 'three';
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animation);


renderer.domElement.className = "web-gl";
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
    if (!document.fullscreenElement) {
        renderer.domElement.requestFullscreen().catch(err => console.error(err));
    } else {
        document.exitFullscreen().catch(err => console.error(err));
    }
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animation() {
    controls.update();
    renderer.render(scene, camera);
}
