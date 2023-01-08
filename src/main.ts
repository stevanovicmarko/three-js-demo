import * as THREE from 'three';
import './style.css';
import * as dat from 'dat.gui';

import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const gui = new dat.GUI();
gui.width = 400;

const cursor = new THREE.Vector2();

window.addEventListener('mousemove', function(event) {
    cursor.x = ((event.clientX / window.innerWidth) * 2) - 1;
    cursor.y = -((event.clientY / window.innerHeight) * 2) + 1;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(1, 1, 1);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animation);

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 1024, 1024);

const waterColors = {
    depthColor: '#913b48',
    surfaceColor: '#ffed9b'
};

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0.0 },

        uHugeWavesElevation: { value: 0.2 },
        uHugeWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uHugeWavesSpeed: { value: 0.5 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 3 },

        uDepthColor: { value: new THREE.Color(waterColors.depthColor) },
        uSurfaceColor: { value: new THREE.Color(waterColors.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5.0 },
    }
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

gui.add(water.material.uniforms.uHugeWavesElevation, 'value')
    .min(0).max(1).step(0.001).name('uHugeWavesElevation');

gui.add(water.material.uniforms.uHugeWavesFrequency.value, 'x')
    .min(0).max(10).step(0.001).name('uHugeWavesFrequencyX');

gui.add(water.material.uniforms.uHugeWavesFrequency.value, 'y')
    .min(0).max(10).step(0.001).name('uHugeWavesFrequencyY');

gui.add(water.material.uniforms.uHugeWavesSpeed, 'value')
    .min(0).max(5).step(0.001).name('uHugeWavesSpeed');

gui.add(water.material.uniforms.uSmallWavesElevation, 'value')
    .min(0).max(1).step(0.001).name('uSmallWavesElevation');

gui.add(water.material.uniforms.uSmallWavesFrequency, 'value')
    .min(0).max(10).step(0.01).name('uSmallWavesFrequency');

gui.add(water.material.uniforms.uSmallWavesSpeed, 'value')
    .min(0).max(5).step(0.01).name('uSmallWavesSpeed');

gui.add(water.material.uniforms.uSmallWavesIterations, 'value')
    .min(0).max(10).step(1).name('uSmallWavesIterations');

gui.add(water.material.uniforms.uColorOffset, 'value')
    .min(0).max(1).step(0.001).name('uColorOffset');

gui.add(water.material.uniforms.uColorMultiplier, 'value')
    .min(0).max(10).step(0.001).name('uColorMultiplier');

gui.addColor(waterColors, 'depthColor').name('depthColor')
    .onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(waterColors.depthColor);
    });
gui.addColor(waterColors, 'surfaceColor')
    .onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(waterColors.surfaceColor);
    });


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

const clock = new THREE.Clock();

// let oldElapsedTime = 0;

function animation() {
    const elapsedTime = clock.getElapsedTime();

    waterMaterial.uniforms.uTime.value = elapsedTime;

    // const deltaTime = elapsedTime - oldElapsedTime;
    // oldElapsedTime = elapsedTime;
    controls.update();
    renderer.render(scene, camera);
}
