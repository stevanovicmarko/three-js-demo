import * as THREE from 'three';

const scene = new THREE.Scene();



const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial());

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial());

cube2.position.x = -2;

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial());

cube3.position.x = 2;

group.add(cube1, cube2, cube3);


scene.add( group );
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

group.position.y = 0.4;

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 8;
camera.position.y = 0.2;
camera.position.x = 0.1;
camera.lookAt(group.position)

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

function animation( time: number ) {

    group.rotation.x = time / 2000;
    group.rotation.y = time / 1000;

    renderer.render( scene, camera );

}
