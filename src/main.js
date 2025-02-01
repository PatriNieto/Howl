import './style.css'

import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';



//1.scene

const scene = new THREE.Scene()
//2.camera
const camera= new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
//3.render
const renderer = new THREE.WebGLRenderer(
  {
    //wich element to use
    canvas : document.querySelector('#bg')
  }
)

//set ratio renderer
renderer.setPixelRatio(window.devicePixelRatio)

//full screen canvas 
renderer.setSize(window.innerWidth, window.innerHeight)

//camera.position.setZ(30)



const geo = new THREE.TorusGeometry(10,3,16,100)
const material = new THREE.MeshBasicMaterial(
  {color: '#DFFF00', 
    wireframe:true
   }
)

const material2 = new THREE.MeshStandardMaterial({
  color: 0xDFFF00 
})

const torus = new THREE.Mesh(geo, material2)

//lo aadimos a la escena
scene.add(torus)


//añadimos luces
const pointlight = new THREE.PointLight(0xffffff)
pointlight.position.set(0,6,6)
pointlight.intensity=50
scene.add(pointlight)


/* const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.position.set(5,5,5)
scene.add(ambientLight) */

//const controls = new OrbitControls(camera, renderer.domElement)

function addStar(){
  const geoStar = new THREE.SphereGeometry(0.25,24,24)
  const materialStar = new THREE.MeshStandardMaterial(0xffffff)
  const star = new THREE.Mesh(geoStar, materialStar)
//generar random
    const [x, y ,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100)) 
    star.position.set(x,y,z)
    scene.add(star)
  
}

//llamamos indicando el numero de estrellas ue queremos
Array(200).fill().forEach(addStar)


function moveCamera(){
   
  //calculamos donde esta
  const t = document.body.getBoundingClientRect().top
  torus.rotation.x += 0.05
  torus.rotation.y += 0.05
  torus.rotation.z += 0.05

  //y que se mueva la camera
   camera.position.z = t * -0.01
  /*camera.position.x += t * - 0.0002  
  camera.position.y += t * - 0.0002 */

}

document.body.onscroll = moveCamera

function animate(){
  //le decimos al navegador que es una animacion , pensar en un game loop
  requestAnimationFrame(animate)
 /*  torus.rotation.x += 0.01
  torus.rotation.y += 0.01
  torus.rotation.z += 0.01 */

  //controls.update()

  renderer.render(scene, camera)

}

animate()