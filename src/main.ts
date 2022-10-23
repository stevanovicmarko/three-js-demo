import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

let mixer: THREE.AnimationMixer | undefined;

gltfLoader.load('./resources/Fox/glTF/Fox.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[2]);
        action.play();
        gltf.scene.scale.set(0.025, 0.025, 0.025);
        scene.add(gltf.scene);
    },
    () => {
        console.log('progress');
    }, (error) => {
        console.log('error', error);
    });

// const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    './resources/environmentMaps/0/px.png',
    './resources/environmentMaps/0/nx.png',
    './resources/environmentMaps/0/py.png',
    './resources/environmentMaps/0/ny.png',
    './resources/environmentMaps/0/pz.png'
]);

const cursor = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    cursor.x = ((event.clientX / window.innerWidth) * 2) - 1;
    cursor.y = -((event.clientY / window.innerHeight) * 2) + 1;
});


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = -1;
scene.add(floor);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);

scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(-3, 3, 3)


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
gui.width = 400;

const clock = new THREE.Clock();
let oldElapsedTime = 0;

function animation() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    mixer?.update(deltaTime);
    controls.update();
    renderer.render(scene, camera);
}
