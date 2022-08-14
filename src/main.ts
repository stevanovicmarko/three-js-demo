import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const obj1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
obj1.position.x = -2;

const obj2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const obj3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
obj3.position.x = 2;

scene.add(obj1, obj2, obj3);

const cursor = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
   cursor.x = ((event.clientX / window.innerWidth) * 2) - 1;
   cursor.y = - ((event.clientY / window.innerHeight) * 2) + 1;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 4;

const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0).normalize();
raycaster.set(rayOrigin, rayDirection);



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
gui.width = 400;

const clock = new THREE.Clock();
const objectsToTest = [obj1, obj2, obj3];


function animation() {
    const elapsedTime = clock.getElapsedTime();
    const intersectedObjects = raycaster.intersectObjects(objectsToTest);

    for (const obj of objectsToTest) {
        obj.material.color.set(0xff0000);
    }

    for (const obj of intersectedObjects) {
        const color = (obj.object as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>).material.color;
        color.set(0x0000ff);
    }

    obj1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    obj2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    obj3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    raycaster.setFromCamera(cursor, camera);
    controls.update();
    renderer.render(scene, camera);
}
