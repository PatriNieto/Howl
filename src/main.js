import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

// Set ratio renderer
renderer.setPixelRatio(window.devicePixelRatio);

// Full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);

// 4. Add Torus geometry to scene
const geo = new THREE.TorusGeometry(10, 3, 16, 100);
const material2 = new THREE.MeshStandardMaterial({
  color: 0xDFFF00,
});

// Create torus mesh
const torus = new THREE.Mesh(geo, material2);

// Add torus to the scene
scene.add(torus);

// 5. Lighting
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(0, 6, 6);
pointlight.intensity = 50;
scene.add(pointlight);

// 6. Load textures with promises
const textureLoader = new THREE.TextureLoader();

const diffuseMap = textureLoader.load('models/wolf_with_animations/textures/Material__wolf_col_tga_diffuse.jpeg');
const occlusionMap = textureLoader.load('models/wolf_with_animations/textures/Material__wolf_col_tga_occlusion.jpeg');
const specularGlossinessMap = textureLoader.load('models/wolf_with_animations/textures/Material__wolf_col_tga_specularGlossiness.jpeg');

// Ensure the textures are loaded properly
Promise.all([diffuseMap, occlusionMap, specularGlossinessMap]).then(() => {
  console.log('All textures loaded successfully');
}).catch((error) => {
  console.error('Error loading textures:', error);
});

// 7. Load GLTF model and animation
let mixer; // Declare mixer for animations
const loader = new GLTFLoader().setPath('models/wolf_with_animations/');
loader.load('scene.gltf', function (gltf) {
  const model = gltf.scene;
  console.log('GLTF model loaded:', model); // Ensure the model is loaded correctly

  // Handle animation
  mixer = new THREE.AnimationMixer(model);

  // Traverse the model and apply textures
  model.traverse((child) => {
    if (child.isMesh) {
      // Apply textures
      child.material = new THREE.MeshStandardMaterial({
        map: diffuseMap,  // Diffuse texture
        aoMap: occlusionMap,  // Ambient occlusion
        roughnessMap: specularGlossinessMap,  // Specular map
        
      });
    }
  });

  // Add the model to the scene
  scene.add(model);

  // Ensure animations are played
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();  // Play all animations from the GLTF file
  });
}, undefined, function (error) {
  console.error('Error loading GLTF model:', error);  // Print any errors during model load
});

// 8. Add stars to the scene
function addStar() {
  const geoStar = new THREE.SphereGeometry(0.25, 24, 24);
  const materialStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geoStar, materialStar);

  // Generate random position
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

// Create 200 stars
Array(200).fill().forEach(addStar);

// 9. Move camera based on scroll
function moveCamera() {
  // Get the scroll position
  const t = document.body.getBoundingClientRect().top;

  // Rotate the torus
  torus.rotation.x += 0.05;
  torus.rotation.y += 0.05;
  torus.rotation.z += 0.05;

  // Move the camera based on scroll
  camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera;

// 10. Animation loop
function animate() {
  // Call the animation frame recursively (game loop)
  requestAnimationFrame(animate);

  // Update animations
  if (mixer) {
    mixer.update(0.01); // Update the animation mixer at each frame
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
