import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070807, 0.055);
const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.35, 9);

scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x160f0a, 1.35));
const keyLight = new THREE.DirectionalLight(0xd7ff2f, 5);
keyLight.position.set(4, 5, 6);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0xff6433, 40, 15);
rimLight.position.set(-4, 1, 4);
scene.add(rimLight);

const root = new THREE.Group();
scene.add(root);

const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x151915, roughness: 0.4, metalness: 0.75 });
const gripMaterial = new THREE.MeshStandardMaterial({ color: 0x252a24, roughness: 0.78, metalness: 0.2 });
const acidMaterial = new THREE.MeshStandardMaterial({ color: 0xd7ff2f, roughness: 0.2, metalness: 0.4, emissive: 0x1c2400, emissiveIntensity: 0.9 });
const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0x7d94a0, roughness: 0.1, metalness: 0.15, transmission: 0.35, transparent: true, opacity: 0.7 });

// Lightweight stylized paintball marker, assembled from procedural geometry.
const marker = new THREE.Group();
root.add(marker);

const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.72, 0.72), darkMaterial);
body.position.x = 0.15;
marker.add(body);

const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 3.2, 28), darkMaterial);
barrel.rotation.z = Math.PI / 2;
barrel.position.x = 2.9;
marker.add(barrel);

const barrelTip = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.55, 28), acidMaterial);
barrelTip.rotation.z = Math.PI / 2;
barrelTip.position.x = 4.72;
marker.add(barrelTip);

const grip = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.75, 0.62), gripMaterial);
grip.position.set(-0.65, -1.05, 0);
grip.rotation.z = -0.18;
marker.add(grip);

const triggerGuard = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 12, 30, Math.PI * 1.4), acidMaterial);
triggerGuard.rotation.set(Math.PI / 2, 0, 0.22);
triggerGuard.position.set(0.05, -0.72, 0);
marker.add(triggerGuard);

const hopper = new THREE.Mesh(new THREE.SphereGeometry(0.82, 32, 22), glassMaterial);
hopper.scale.set(1, 0.78, 1);
hopper.position.set(0.5, 1.08, 0);
marker.add(hopper);

const hopperNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.5, 20), darkMaterial);
hopperNeck.position.set(0.5, 0.55, 0);
marker.add(hopperNeck);

const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 2.5, 30), darkMaterial);
tank.rotation.z = Math.PI / 2;
tank.position.set(-2.35, -0.35, 0);
marker.add(tank);

const tankCap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.4, 20), acidMaterial);
tankCap.rotation.z = Math.PI / 2;
tankCap.position.set(-0.95, -0.35, 0);
marker.add(tankCap);

marker.rotation.set(-0.12, -0.55, 0.03);
marker.position.set(2.1, 0.4, 0);
marker.scale.setScalar(0.78);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(14, 64),
  new THREE.MeshStandardMaterial({ color: 0x0b0d0b, roughness: 1, metalness: 0, transparent: true, opacity: 0.75 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3.1;
scene.add(floor);

const paintGroup = new THREE.Group();
scene.add(paintGroup);
const paintColors = [0xd7ff2f, 0xff6433, 0x22b6ff, 0xff2fa0];
for (let i = 0; i < 70; i += 1) {
  const material = new THREE.MeshStandardMaterial({
    color: paintColors[i % paintColors.length],
    emissive: paintColors[i % paintColors.length],
    emissiveIntensity: 0.22,
    roughness: 0.45
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.045 + Math.random() * 0.06, 12, 12), material);
  ball.position.set((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  ball.userData.base = ball.position.clone();
  ball.userData.speed = 0.4 + Math.random() * 1.2;
  paintGroup.add(ball);
}

const bunkers = new THREE.Group();
scene.add(bunkers);
for (let i = 0; i < 8; i += 1) {
  const geometry = i % 2 ? new THREE.CylinderGeometry(0.5, 0.7, 2.1, 14) : new THREE.BoxGeometry(1.25, 1.9, 1.25);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: i % 2 ? 0x292f27 : 0x381814, roughness: 0.9 }));
  mesh.position.set((i - 3.5) * 2.2, -2.05, -7 - (i % 3) * 2.4);
  mesh.rotation.y = i * 0.7;
  bunkers.add(mesh);
}

const timeline = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: 'main',
    start: 'top top',
    end: 'bottom bottom',
    scrub: prefersReducedMotion ? false : 1.1
  }
});

if (!prefersReducedMotion) {
  timeline
    .to(marker.rotation, { y: 0.5, x: 0.12, z: -0.08, duration: 1.1 }, 0)
    .to(marker.position, { x: 1.4, y: -0.15, z: -1.3, duration: 1.1 }, 0)
    .to(camera.position, { z: 7.1, y: 0.1, duration: 1.1 }, 0)
    .to(marker.rotation, { y: -1.15, x: -0.05, duration: 1.1 }, 1.1)
    .to(marker.position, { x: -2.2, y: 0.1, z: -1.8, duration: 1.1 }, 1.1)
    .to(camera.position, { x: 0.8, z: 6.4, duration: 1.1 }, 1.1)
    .to(marker.rotation, { y: 0.18, x: 0.18, z: 0.06, duration: 1.15 }, 2.2)
    .to(marker.position, { x: 2.1, y: 0.2, z: -2.5, duration: 1.15 }, 2.2)
    .to(marker.scale, { x: 0.62, y: 0.62, z: 0.62, duration: 1.15 }, 2.2)
    .to(camera.position, { x: -0.8, z: 7.6, duration: 1.15 }, 2.2)
    .to(marker.rotation, { y: Math.PI * 1.25, x: 0.05, duration: 1.3 }, 3.35)
    .to(marker.position, { x: 0, y: 0.4, z: -3.4, duration: 1.3 }, 3.35)
    .to(marker.scale, { x: 0.95, y: 0.95, z: 0.95, duration: 1.3 }, 3.35)
    .to(camera.position, { x: 0, y: 0.35, z: 8.4, duration: 1.3 }, 3.35);

  gsap.utils.toArray('.section-copy, .stat-card, .gear-list, .packages-heading, .package-grid article, .final > *').forEach((element) => {
    gsap.fromTo(element, { autoAlpha: 0, y: 70 }, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 84%', once: true }
    });
  });
}

const clock = new THREE.Clock();
function render() {
  const elapsed = clock.getElapsedTime();
  if (!prefersReducedMotion) {
    marker.position.y += Math.sin(elapsed * 0.8) * 0.0008;
    paintGroup.children.forEach((ball, index) => {
      ball.position.y = ball.userData.base.y + Math.sin(elapsed * ball.userData.speed + index) * 0.18;
      ball.rotation.y += 0.01;
    });
    bunkers.rotation.y = Math.sin(elapsed * 0.08) * 0.025;
  }
  camera.lookAt(0, 0, -1.2);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
});