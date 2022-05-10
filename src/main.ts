import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("../resources/door/color.jpg");
// const doorAlphaMap = textureLoader.load("../resources/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("../resources/door/ambientOcclusion.jpg");
// const doorHeightTexture = textureLoader.load("../resources/door/height.jpg");
// const doorNormalTexture = textureLoader.load("../resources/door/normal.jpg");
// const doorMetalnessTexture = textureLoader.load("../resources/door/metalness.jpg");
// const doorRoughnessTexture = textureLoader.load("../resources/door/roughness.jpg");
// const matcapTexture = textureLoader.load("../resources/door/matcaps/1.png");
// const gradientTexture = textureLoader.load("../resources/door/matcaps/2.png");

// Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight);
scene.add(pointLight);

const material = new THREE.MeshStandardMaterial({
    metalness: 0.1,
    roughness: 0.3,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    side: THREE.DoubleSide
});

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), material);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.1, 16, 32), material);
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));

scene.add(sphere);
scene.add(plane);
scene.add(torus)


sphere.position.x = -2;
torus.position.x = 2;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 3;
camera.lookAt(sphere.position);

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
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);


function animation() {
    controls.update();
    renderer.render(scene, camera);
}
