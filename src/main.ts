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
// Lights
const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
const directionalLight = new THREE.DirectionalLight(0xdddddd, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.radius = 5;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.far = 6;

scene.add(ambientLight)
    .add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.position.set(2, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const material = new THREE.MeshStandardMaterial();

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));
sphere.castShadow = true;

const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshStandardMaterial());
cube.geometry.setAttribute('uv2', new THREE.BufferAttribute(cube.geometry.attributes.uv.array, 2));
cube.castShadow = true;


const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(8, 8, 100, 100), material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));
plane.receiveShadow = true;

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.1, 64, 128), material);
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
torus.castShadow = true;

scene.add(sphere)
    .add(plane)
    .add(cube)
    .add(torus);


sphere.position.x = -2;
torus.position.x = 2;
plane.position.y = -2;
plane.rotation.x = -Math.PI / 2;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 25);
camera.position.z = 3;
camera.lookAt(sphere.position);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animation);

directionalLight.position.z = 1;
directionalLight.lookAt(sphere.position);
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);
// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightCameraHelper);

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
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);


function animation() {
    controls.update();
    renderer.render(scene, camera);
}
