import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true})
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 30;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geo = new THREE.TorusKnotGeometry(10, 2, 64, 8, 34, 23);

const mat = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,
fragmentShader: `
    varying vec3 vPosition;
    void main() {
        float dist = length(vPosition);
        
        vec3 warmCenterPink = vec3(0.83, 0.42, 0.55);
        vec3 warmOuterPink = vec3(1.0, 0.84, 0.87);
        
        float t = smoothstep(0.0, 8.0, dist);
        vec3 color = mix(warmCenterPink, warmOuterPink, t);
        gl_FragColor = vec4(color, 1.0);
    }
`,
    flatShading: true
});

const mesh = new THREE.Mesh(geo, mat);

scene.add(mesh);

const hemiLight = new THREE.HemisphereLight(0xffd1dc, 0xd98d9f);
scene.add(hemiLight);


function animate(t = 0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    controls.update();
}

animate();
