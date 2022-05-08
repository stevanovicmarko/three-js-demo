import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("../resources/texture.jpg");
texture.rotation = Math.PI / 4;
texture.center.x = 0.5;
texture.center.y = 0.5;

const material = new THREE.MeshBasicMaterial({ map: texture });
const boxGeometry = new THREE.BoxGeometry();
const mesh = new THREE.Mesh(boxGeometry, material);

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

/*
  Debug
 */
const gui = new dat.GUI();
gui.add(mesh.position, 'x').min(-2).max(2).step(0.01);
gui.add(mesh.position, 'y').min(-2).max(2).step(0.01);
gui.add(mesh.position, 'z').min(-2).max(2).step(0.01);
gui.add(mesh, 'visible');
gui.add(mesh.material, 'wireframe');

function animation() {
    controls.update();
    renderer.render(scene, camera);
}
