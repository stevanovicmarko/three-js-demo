import * as THREE from "three";
import "./style.css";
import * as dat from "dat.gui";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";


import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("./resources/flag/flag.png");

const gui = new dat.GUI();
gui.width = 400;


const cursor = new THREE.Vector2();

window.addEventListener("mousemove", function(event) {
  cursor.x = ((event.clientX / window.innerWidth) * 2) - 1;
  cursor.y = -((event.clientY / window.innerHeight) * 2) + 1;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(0, 0, 3);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animation);

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const uniforms = {
  uFrequency: { value: new THREE.Vector2(10, 5) },
  uTime: { value: 0 },
  uTexture: { value: flagTexture }
} as const;

// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
});

gui.add(material.uniforms["uFrequency"].value, "x").min(0).max(20).step(0.01).name("frequency X");
gui.add(material.uniforms["uFrequency"].value, "y").min(0).max(20).step(0.01).name("frequency Y");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

renderer.domElement.className = "web-gl";
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", function() {
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
  // const deltaTime = elapsedTime - oldElapsedTime;
  // oldElapsedTime = elapsedTime;
  material.uniforms["uTime"].value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
}
