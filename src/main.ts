import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon';

const scene = new THREE.Scene();

// const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    './resources/environmentMaps/0/px.png',
    './resources/environmentMaps/0/nx.png',
    './resources/environmentMaps/0/py.png',
    './resources/environmentMaps/0/ny.png',
    './resources/environmentMaps/0/pz.png'
]);


const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);


const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
    mass: 0
});
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle( new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7
});


world.addBody(floorBody);

world.defaultContactMaterial = defaultContactMaterial;

const cursor = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
   cursor.x = ((event.clientX / window.innerWidth) * 2) - 1;
   cursor.y = - ((event.clientY / window.innerHeight) * 2) + 1;
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
floor.rotation.x = - Math.PI * 0.5;
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

const objectsToUpdate: {mesh: THREE.Mesh, body: CANNON.Body}[] = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})


const createSphere = (radius: number, position: THREE.Vector3) => {

    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    });
    body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    world.addBody(body);

    objectsToUpdate.push({
        mesh,
        body
    });
}


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const gui = new dat.GUI();
gui.width = 400;
const debugObject = {
    createSphere: () => {
        createSphere(Math.random() * 0.5,
                          new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3));
    }
} as const;

gui.add(debugObject, 'createSphere');

const clock = new THREE.Clock();
let oldElapsedTime = 0;

function animation() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // Update physics world
    world.step(1/60, deltaTime, 3);

    for (const item of objectsToUpdate) {
        item.mesh.position.copy(new THREE.Vector3(item.body.position.x, item.body.position.y, item.body.position.z));
    }

    controls.update();
    renderer.render(scene, camera);
}
