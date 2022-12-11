import * as THREE from 'three';
import './style.css';
import * as dat from 'dat.gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();
const cubeTexLoader = new THREE.CubeTextureLoader();
const scene = new THREE.Scene();

const envMapParams = {
    envMapIntensity: 5
};

function updateAllMaterials() {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && (child as any).material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = envMapParams.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}

const envMap = cubeTexLoader.load([
    './resources/environmentMaps/0/px.jpg',
    './resources/environmentMaps/0/nx.jpg',
    './resources/environmentMaps/0/py.jpg',
    './resources/environmentMaps/0/ny.jpg',
    './resources/environmentMaps/0/pz.jpg',
    './resources/environmentMaps/0/nz.jpg'
]);
envMap.encoding = THREE.sRGBEncoding;
scene.background = envMap;
scene.environment = envMap;

const gui = new dat.GUI();
gui.width = 400;

gltfLoader.load('./resources/FlightHelmet/glTF/FlightHelmet.gltf', function(gltf) {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(0, -4, 0);
    gltf.scene.rotation.y = -Math.PI * 0.5;
    scene.add(gltf.scene);
    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation');
    updateAllMaterials();
});

const cursor = new THREE.Vector2();

window.addEventListener('mousemove', function(event) {
    cursor.x = ((event.clientX / window.innerWidth) * 2) - 1;
    cursor.y = -((event.clientY / window.innerHeight) * 2) + 1;
});


const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.position.set(5, 5, 5);
directionalLight.shadow.mapSize.set(1024, 1024);

scene.add(directionalLight);

scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));


gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('light intensity');
['x', 'y', 'z'].forEach(function(direction) {
    gui.add(directionalLight.position, direction).min(-5).max(5).step(0.001).name(`light position ${direction}`);
});

gui.add(envMapParams, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(-8, 8, 8);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animation);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.NoToneMapping;
renderer.toneMappingExposure = 1;

gui.add(renderer, 'toneMapping', {
   'No tone mapping': THREE.NoToneMapping,
   Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    Reinert: THREE.ReinhardToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(function (){
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
});

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01);


renderer.domElement.className = 'web-gl';
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', function() {
    if (!document.fullscreenElement) {
        renderer.domElement.requestFullscreen().catch(err => console.error(err));
    } else {
        document.exitFullscreen().catch(err => console.error(err));
    }
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const clock = new THREE.Clock();
// let oldElapsedTime = 0;

function animation() {
    // const elapsedTime = clock.getElapsedTime();
    // const deltaTime = elapsedTime - oldElapsedTime;
    // oldElapsedTime = elapsedTime;

    controls.update();
    renderer.render(scene, camera);
}
