import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Escena
const scene = new THREE.Scene();

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Torus
const geo = new THREE.TorusGeometry(10, 3, 16, 100);
const materialTorus = new THREE.MeshStandardMaterial({ color: 0xdfff00 });
const torus = new THREE.Mesh(geo, materialTorus);
torus.position.set(0, 130, 0);
scene.add(torus);

// Iluminación
const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(6, 6, 6);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x78df00, 50);
pointLight2.position.set(0, 0, -1);
scene.add(pointLight2);

const directionalLight = new THREE.DirectionalLight(0xe83030);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

// Texto 3D
const fontLoader = new FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('HOWL', {
      font: font,
      size: 15,
      depth: 1,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.9,
      bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x550000,
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-30, -5, 0);
    scene.add(textMesh);
  }
);

// Modelo GLTF
let wolf;
let mixer;
const loader = new GLTFLoader().setPath('models/wolf_with_animations/');
loader.load(
  'scene.gltf',
  (gltf) => {
    wolf = gltf.scene;
    wolf.scale.set(2, 2, 2);
    wolf.position.set(0, -5, -30);
    scene.add(wolf);

    mixer = new THREE.AnimationMixer(wolf);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error);
  }
);

// Estrellas
function addStar() {
  const geoStar = new THREE.SphereGeometry(0.25, 24, 24);
  const materialStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geoStar, materialStar);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// Movimiento cámara
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  if (t >= 0) {
    // Estado inicial
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  } else if (t < -300 && t > -800) {
    // Segunda fase
    const progress = (-t - 300) / 500;
    camera.position.set(0, -1, 30 - progress * 60);
    if (wolf) camera.lookAt(wolf.position);
  } else if (t <= -800) {
    // Tercera fase: órbita
 const angle = (-t - 800) * 0.0005;
    camera.position.x = Math.sin(angle) * 20;
    camera.position.z = Math.cos(angle) * 20;
    camera.lookAt(0, 0, -30); 
  }
}

// Animación
function animate() {
  requestAnimationFrame(animate);
  moveCamera();
  if (mixer) mixer.update(0.01);
  renderer.render(scene, camera);
}
animate();
