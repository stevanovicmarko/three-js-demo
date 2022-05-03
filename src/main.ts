import * as THREE from 'three';
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();

const count = 5000;
const positions = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2;
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

mesh.position.y = 0.4;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 3;
camera.lookAt(mesh.position);

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
