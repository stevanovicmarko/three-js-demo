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

const bricksColorTexture = textureLoader.load("../resources/bricks/color.jpg");
const bricksAmbientOcclustionTexture = textureLoader.load("../resources/bricks/ambientOcclusion.jpg");
const bricksNormalTexture = textureLoader.load("../resources/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load("../resources/bricks/roughness.jpg");

const grassColorTexture = textureLoader.load("../resources/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load("../resources/grass/ambientOcclusion.jpg");
const grassNormalTexture = textureLoader.load("../resources/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load("../resources/grass/roughness.jpg");

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const axesHelper = new THREE.AxesHelper( 5 );
scene.add(axesHelper);

const FOG_COLOR = 0x262837;
const fog = new THREE.Fog(FOG_COLOR, 1, 40);
scene.fog = fog;

const grass = new THREE.Mesh(new THREE.PlaneBufferGeometry(80, 80),
                            new THREE.MeshStandardMaterial({
                                transparent: true,
                                map: grassColorTexture,
                                aoMap: grassAmbientOcclusionTexture,
                                normalMap: grassNormalTexture,
                                roughnessMap: grassRoughnessTexture
                            }));
// needed for ambient occlusion
grass.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(grass.geometry.attributes.uv.array, 2));
grass.rotation.x = -Math.PI * 0.5;
grass.position.y = 0;
grass.receiveShadow = true;
scene.add(grass);

const house = new THREE.Group();
const walls = new THREE.Mesh(new THREE.BoxBufferGeometry(4, 2.5, 4), new THREE.MeshStandardMaterial({
    transparent: true,
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclustionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
}));
// needed for ambient occlusion
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));

walls.position.y = 1.25;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: 0xb35f45})
);
house.add(roof);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;

const door = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
                            new THREE.MeshStandardMaterial({ transparent:true,
                                map: doorColorTexture,
                                alphaMap: doorAlphaMap,
                                aoMap: doorAmbientOcclusionTexture,
                                displacementMap: doorHeightTexture,
                                displacementScale: 0.1,
                                normalMap: doorNormalTexture,
                                metalnessMap: doorMetalnessTexture,
                                roughnessMap: doorRoughnessTexture
                            }));

// needed for ambient occlusion
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));

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
    grave.castShadow = true;
    graves.add(grave);
}

const ghost1 = new THREE.PointLight(0xff00ff, 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight(0x00ff00, 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight(0xffff00, 2, 3);
scene.add(ghost3);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.z = 4;
camera.position.y = 4;
camera.lookAt(grass.position);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(FOG_COLOR);
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

const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xb9d5ff, 0.3);
directionalLight.position.set(4, 5, -2);
scene.add(directionalLight);
scene.add(directionalLight.target);

const doorLight = new THREE.PointLight(0xff7d46, 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

directionalLight.castShadow = true;

doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
walls.castShadow = true;


const gui = new dat.GUI();
gui.width = 400;
gui.add(ambientLight, 'intensity').name('Ambient Light Intensity').min(0).max(1).step(0.01);
gui.add(directionalLight, 'intensity').name('Directional Light Intensity').min(0).max(1).step(0.001);
gui.add(directionalLight.position, 'x').name('Directional Light X-Position').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').name('Directional Light Y-Position').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').name('Directional Light Z-Position').min(-5).max(5).step(0.001);
gui.add(doorLight, 'intensity').name('Door Light Intensity').min(0).max(1).step(0.01);

const clock = new THREE.Clock();

function animation() {
    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.6;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle * 2);

    const ghost2Angle = - elapsedTime * 0.33;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle * 3) + Math.sin(elapsedTime * 2.2);

    const ghost3Angle = - elapsedTime * 0.62;
    ghost3.position.x = Math.cos(ghost3Angle) * (5 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (6 + Math.sin(elapsedTime * 0.54));
    ghost3.position.y = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.2));

    controls.update();
    renderer.render(scene, camera);
}
