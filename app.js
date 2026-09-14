import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('#webgl'),alpha:true,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.set(0,.2,9);
scene.add(new THREE.HemisphereLight(0xffe2b5,0x300000,2.4));
const key=new THREE.PointLight(0xffd51f,65,18);key.position.set(4,4,5);scene.add(key);
const rim=new THREE.PointLight(0xff210f,85,20);rim.position.set(-4,0,3);scene.add(rim);
const marker=new THREE.Group();scene.add(marker);
const metal=new THREE.MeshStandardMaterial({color:0x1b0b08,metalness:.82,roughness:.25});
const red=new THREE.MeshStandardMaterial({color:0xef210f,metalness:.45,roughness:.28,emissive:0x310300});
const gold=new THREE.MeshStandardMaterial({color:0xffd51f,metalness:.5,roughness:.22,emissive:0x351700});
const glass=new THREE.MeshPhysicalMaterial({color:0xff7b43,transmission:.25,transparent:true,opacity:.82,roughness:.08});
function mesh(g,m,p,r=[0,0,0]){const x=new THREE.Mesh(g,m);x.position.set(...p);x.rotation.set(...r);marker.add(x);return x}
mesh(new THREE.BoxGeometry(3.35,.78,.78),metal,[0,.15,0]);
mesh(new THREE.CylinderGeometry(.19,.26,3.7,32),metal,[3.25,.15,0],[0,0,Math.PI/2]);
mesh(new THREE.CylinderGeometry(.3,.3,.65,32),gold,[5.37,.15,0],[0,0,Math.PI/2]);
mesh(new THREE.BoxGeometry(.7,1.9,.7),red,[-.7,-1.12,0],[0,0,-.18]);
mesh(new THREE.TorusGeometry(.46,.09,14,34,Math.PI*1.42),gold,[.05,-.72,.02],[Math.PI/2,0,.2]);
const hopper=mesh(new THREE.SphereGeometry(.95,36,28),glass,[.55,1.35,0]);hopper.scale.set(1,.76,1);
mesh(new THREE.CylinderGeometry(.2,.25,.58,24),metal,[.55,.68,0]);
mesh(new THREE.CylinderGeometry(.55,.67,2.75,34),metal,[-2.55,-.3,0],[0,0,Math.PI/2]);
mesh(new THREE.CylinderGeometry(.29,.33,.48,24),gold,[-1.02,-.3,0],[0,0,Math.PI/2]);
marker.rotation.set(-.08,-.42,.02);marker.scale.setScalar(.82);marker.position.set(1.75,.2,0);
const balls=new THREE.Group();scene.add(balls);const colors=[0xffd51f,0xef210f,0xff7417,0xfff2c0];
for(let i=0;i<85;i++){const m=new THREE.MeshStandardMaterial({color:colors[i%4],emissive:colors[i%4],emissiveIntensity:.18,roughness:.42});const b=new THREE.Mesh(new THREE.SphereGeometry(.04+Math.random()*.065,10,10),m);b.position.set((Math.random()-.5)*14,(Math.random()-.5)*9,(Math.random()-.5)*7);b.userData.y=b.position.y;b.userData.s=.45+Math.random()*1.2;balls.add(b)}
if(!reduced){
 const tl=gsap.timeline({scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:1.05}});
 tl.to(marker.rotation,{y:.48,x:.08,duration:1},0).to(marker.position,{x:1.35,y:-.05,z:-.6,duration:1},0)
 .to(marker.rotation,{y:-.85,z:-.05,duration:1},1).to(marker.position,{x:-1.8,y:.1,z:-1,duration:1},1)
 .to(marker.rotation,{y:.22,x:.18,duration:1},2).to(marker.position,{x:1.8,y:.25,z:-1.7,duration:1},2)
 .to(marker.rotation,{y:Math.PI*1.15,x:.05,duration:1.3},3).to(marker.position,{x:0,y:.15,z:-2.1,duration:1.3},3).to(marker.scale,{x:1.02,y:1.02,z:1.02,duration:1.3},3)
 .to(marker.rotation,{y:Math.PI*1.7,z:.12,duration:1},4).to(marker.position,{x:1.2,y:.1,z:-1,duration:1},4);
 gsap.utils.toArray('.giant.back').forEach(el=>gsap.to(el,{x:'-18vw',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
 gsap.utils.toArray('.giant.front').forEach(el=>gsap.fromTo(el,{x:'20vw'},{x:'-12vw',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
 gsap.utils.toArray('.copy,.package-head,.cards,.final-copy').forEach(el=>gsap.from(el,{opacity:0,y:80,duration:1,scrollTrigger:{trigger:el,start:'top 82%',once:true}}));
}
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-meter i').style.height=(scrollY/max*100)+'%'},{passive:true});
const clock=new THREE.Clock();function draw(){const t=clock.getElapsedTime();marker.position.y+=Math.sin(t*.8)*.00065;balls.children.forEach((b,i)=>{b.position.y=b.userData.y+Math.sin(t*b.userData.s+i)*.16});camera.lookAt(0,0,-1);renderer.render(scene,camera);requestAnimationFrame(draw)}draw();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))});
addEventListener('load',()=>setTimeout(()=>document.querySelector('.loader').classList.add('done'),900));