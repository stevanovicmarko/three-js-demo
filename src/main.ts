import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const doorColorTexture = textureLoader.load("../resources/door/color.jpg");
const doorAlphaMap = textureLoader.load("../resources/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("../resources/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("../resources/door/height.jpg");
const doorNormalTexture = textureLoader.load("../resources/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("../resources/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("../resources/door/roughness.jpg");

const axesHelper = new THREE.AxesHelper( 5 );
scene.add(axesHelper);


const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshStandardMaterial({color: 0xa9c388}));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
// floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2));
scene.add(floor);

const house = new THREE.Group();
const walls = new THREE.Mesh(new THREE.BoxBufferGeometry(4, 2.5, 4), new THREE.MeshStandardMaterial({
    color: 0xac8e82
}));
walls.position.y = 1.25;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: 0xb35f45})
);
house.add(roof);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;

const door = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshStandardMaterial({color: 0xaa7b7b}));
house.add(door);
door.position.y = 1;
door.position.z = 2 + 0.01;

scene.add(house);

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x89c854});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

for (const bush of [bush1, bush2, bush3, bush4]) {
    house.add(bush);
}

const graves = new THREE.Group();
scene.add(graves);
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color: 0xb2b6b1});
for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.4, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    graves.add(grave);
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.z = 4;
camera.position.y = 4;
camera.lookAt(floor.position);

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

const gui = new dat.GUI();
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xb9d5ff);
directionalLight.position.set(4, 5, -2);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);
scene.add(directionalLight.target);

function animation() {
    controls.update();
    renderer.render(scene, camera);
}
