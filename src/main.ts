import * as THREE from 'three';
import "./style.css";
import * as dat from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const params = {
    count: 100_000,
    size: 0.01,
    radius: 5,
    galaxyArmsCount: 10,
    galaxySpin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: 0xff6030,
    outsideColor: 0x1b3984
} as const;

let geometry: THREE.BufferGeometry | undefined;
let material: THREE.Material | undefined;
let points: THREE.Points | undefined;

function generateGalaxy() {

    geometry?.dispose();
    material?.dispose();
    if (points) {
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);
    const colorsInside = new THREE.Color(params.insideColor);
    const colorsOutside = new THREE.Color(params.outsideColor);

    for (let i = 0; i < params.count; i++) {
        const offset = i * 3;
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.galaxySpin;
        const armAngle = (i % params.galaxyArmsCount) / params.galaxyArmsCount * Math.PI * 2;

        const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness;
        const randomY = Math.pow(Math.random(),  params.randomnessPower) *(Math.random() < 0.5 ? 1 : -1) * params.randomness;
        const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness;

        positions[offset] = Math.cos(armAngle + spinAngle) * radius + randomX;
        positions[offset + 1] = randomY;
        positions[offset + 2] = Math.sin(armAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorsInside.clone();
        mixedColor.lerp(colorsOutside, radius / params.radius);
        colors[offset] = mixedColor.r;
        colors[offset + 1] = mixedColor.g;
        colors[offset + 2] = mixedColor.b;
    }

    console.log(colors);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

generateGalaxy();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.z = 4;
camera.position.y = 4;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
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
gui.add(params, 'count')
    .min(100)
    .max(1_000_000)
    .step(100)
    .name("Stars count")
    .onFinishChange(generateGalaxy);
gui.add(params, 'size')
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .name("Star size")
    .onFinishChange(generateGalaxy);

gui.add(params, 'radius')
    .min(0.01)
    .max(20)
    .step(0.001)
    .name("Galaxy Radius")
    .onFinishChange(generateGalaxy);

gui.add(params, 'galaxyArmsCount')
    .min(2)
    .max(20)
    .step(1)
    .name("Galaxy Arms Count")
    .onFinishChange(generateGalaxy);

gui.add(params, 'galaxySpin')
    .min(-5)
    .max(5)
    .step(0.01)
    .name("Galaxy Spin")
    .onFinishChange(generateGalaxy);

gui.add(params, 'randomness')
    .min(0)
    .max(2)
    .step(0.01)
    .name("Galaxy Randomness")
    .onFinishChange(generateGalaxy);

gui.add(params, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.01)
    .name("Galaxy Randomness Weight")
    .onFinishChange(generateGalaxy);

gui.addColor(params, 'insideColor')
    .name("Inside Color")
    .onFinishChange(generateGalaxy);

gui.addColor(params, 'outsideColor')
    .name("Outside Color")
    .onFinishChange(generateGalaxy);

function animation() {

    controls.update();
    renderer.render(scene, camera);
}
