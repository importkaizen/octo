import * as THREE from './three.module.js';

const chapters=[
  {title:'The sales foundation',kicker:'THE FOUNDATION',summary:'Build an ethical, repeatable approach to premium offers.',lessons:['What high ticket buyers actually need','A consultative sales mindset','Your personal deal map'],practice:'Write a one-paragraph promise that says who you help, what changes for them, and why it matters.'},
  {title:'Know your buyer',kicker:'BUYER CONTEXT',summary:'Identify the people and problems your offer serves best.',lessons:['Define the ideal buyer','Find the costly problem','Read context before a call'],practice:'Create a buyer profile with goals, pressures, alternatives, and the cost of standing still.'},
  {title:'Discovery that matters',kicker:'DISCOVERY',summary:'Ask better questions and listen for the real problem.',lessons:['Set the agenda together','Questions that uncover impact','Listen, reflect, and clarify'],practice:'Draft six open questions for a discovery call, then practice two follow-up questions for each answer.'},
  {title:'Qualify with care',kicker:'MUTUAL FIT',summary:'Find mutual fit without turning the call into an interrogation.',lessons:['Understand readiness and urgency','Map decision makers','Name a clear next step'],practice:'Build a fit checklist with criteria for need, timing, decision process, and ability to act.'},
  {title:'Frame the value',kicker:'VALUE',summary:'Connect the offer to outcomes that the buyer values.',lessons:['Translate features into impact','Create a credible value case','Discuss investment with clarity'],practice:'Rewrite three feature statements as buyer outcomes supported by specific evidence.'},
  {title:'Work through concerns',kicker:'OBJECTIONS',summary:'Meet objections with curiosity, evidence, and calm.',lessons:['What an objection can mean','Clarify before responding','Handle price and risk concerns'],practice:'Write a response to “It costs too much” that begins with a clarifying question and checks for understanding.'},
  {title:'Make the proposal',kicker:'RECOMMENDATION',summary:'Turn discovery into a focused recommendation.',lessons:['Summarize the buyer’s priorities','Structure a clear proposal','Agree on decision criteria'],practice:'Outline a one-page proposal with problem, recommended approach, outcome, evidence, and next step.'},
  {title:'Close with confidence',kicker:'DECISION + FOLLOW-THROUGH',summary:'Guide a decision and follow through with integrity.',lessons:['Ask for a decision naturally','Plan a respectful follow-up','Review and improve the process'],practice:'Write your next-step language and a three-message follow-up sequence that adds value each time.'}
];
const canvas=document.getElementById('web-canvas'),renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x100d0e);scene.fog=new THREE.FogExp2(0x100d0e,.012);
const camera=new THREE.PerspectiveCamera(48,1,.1,120);camera.position.set(0,0,18);
scene.add(new THREE.AmbientLight(0xc4b5b3,1.18));
const keyLight=new THREE.PointLight(0xd9535c,70,55);keyLight.position.set(-4,5,12);scene.add(keyLight);
const violetLight=new THREE.PointLight(0x8b3038,42,48);violetLight.position.set(5,-3,-12);scene.add(violetLight);
const warmLight=new THREE.PointLight(0xf0d9d0,66,38);warmLight.position.set(4,3,0);scene.add(warmLight);
const world=new THREE.Group();scene.add(world);
const webLine=new THREE.LineBasicMaterial({color:0x52484a,transparent:true,opacity:.46,depthWrite:false});
const glowLine=new THREE.LineBasicMaterial({color:0xc84c54,transparent:true,opacity:.66,depthWrite:false});
const violetLine=new THREE.LineBasicMaterial({color:0xb78386,transparent:true,opacity:.34,depthWrite:false});
const legMaterial=new THREE.MeshStandardMaterial({color:0x817578,metalness:.82,roughness:.24});
const jointMaterial=new THREE.MeshStandardMaterial({color:0xb79796,metalness:.74,roughness:.22});
const coreMaterial=new THREE.MeshPhysicalMaterial({color:0x281b1d,metalness:.8,roughness:.18,clearcoat:1,clearcoatRoughness:.1,emissive:0x160b0d});
const hitMaterial=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false});
const hitNodes=[],anchors=[],nodeHalos=[];
const makeLine=(points,material,parent=world)=>{const g=new THREE.BufferGeometry().setFromPoints(points);const obj=new THREE.Line(g,material);parent.add(obj);return obj};
const makeTube=(points,radius,material,parent=world)=>{const curve=new THREE.CatmullRomCurve3(points);const obj=new THREE.Mesh(new THREE.TubeGeometry(curve,28,radius,7,false),material);parent.add(obj);return obj};
const makeSphere=(radius,material,pos,scale=[1,1,1],parent=world)=>{const obj=new THREE.Mesh(new THREE.SphereGeometry(radius,24,18),material);obj.position.copy(pos);obj.scale.set(...scale);parent.add(obj);return obj};
const pointOn=(r,a,z=0)=>new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,z);

// One radial web: each of its eight legs is a chapter path from the spider to a chapter node.
const webRadius=4.5, legAngles=Array.from({length:8},(_,i)=>i*Math.PI/4+Math.PI/8);
for(let ring=1;ring<=6;ring++){
  const radius=.72+ring*.62,points=[];
  for(let s=0;s<=192;s++){const a=s/192*Math.PI*2;const warp=Math.sin(a*8+ring*.7)*.075;points.push(pointOn(radius+warp,a,.015*Math.sin(a*5+ring)));}
  makeLine(points,ring===6?glowLine:webLine);
}
for(let leg=0;leg<8;leg++){
  const a=legAngles[leg],points=[];
  for(let s=0;s<=24;s++){const r=.2+s/24*4.2;points.push(pointOn(r,a+Math.sin(s/24*Math.PI)*.035,0));}
    makeLine(points,glowLine);
  for(let ring=1;ring<=6;ring++)makeSphere(.024,new THREE.MeshBasicMaterial({color:0xa47b7d}),pointOn(.72+ring*.62,a,.025));
}
for(let thread=0;thread<24;thread++){
  const a=thread*Math.PI/12,points=[];
  for(let s=0;s<=12;s++){const u=s/12,r=.8+u*3.72,theta=a+u*Math.PI/4;points.push(pointOn(r,theta,.02+Math.sin(u*Math.PI)*.08));}
  makeLine(points,thread%4===0?violetLine:webLine);
}
// The eight chapter nodes terminate the legs, with invisible hit paths extending from the hub.
for(let index=0;index<8;index++){
  const a=legAngles[index],tip=pointOn(3.38,a,.18);
  const nodeMat=new THREE.MeshPhysicalMaterial({color:index===0?0xf0b5aa:0xc46c6e,emissive:index%2?0x351114:0x281011,emissiveIntensity:.62,metalness:.58,roughness:.2,clearcoat:1});
  const node=makeSphere(.24,nodeMat,tip);node.userData={kind:'chapter',index,baseScale:1};hitNodes.push(node);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(.37,.014,8,48),new THREE.MeshBasicMaterial({color:0xd15860,transparent:true,opacity:.72}));halo.position.copy(tip);world.add(halo);nodeHalos.push({node,halo});
  anchors.push({kind:'chapter',index,position:tip.clone().add(new THREE.Vector3(.25,.36,.12))});
  const hit=makeTube([pointOn(.2,a,.12),pointOn(1.4,a,.12),pointOn(2.5,a,.16),tip],.17,hitMaterial);hit.userData={kind:'chapter',index};hitNodes.push(hit);
}
// The OCTO spider sits at the web hub. Its eight articulated legs align with the chapter paths.
const spiderZ=.14;
makeSphere(.43,coreMaterial,new THREE.Vector3(0,-.22,spiderZ),[.88,1.12,.72]);
makeSphere(.31,coreMaterial,new THREE.Vector3(0,.32,spiderZ+.12),[.92,.86,.72]);
const eyeMaterial=new THREE.MeshBasicMaterial({color:0xffb3a9});
for(const [x,y] of [[-.18,.43],[-.06,.51],[.06,.51],[.18,.43]])makeSphere(.036,eyeMaterial,new THREE.Vector3(x,y,spiderZ+.36));
for(let leg=0;leg<8;leg++){
  const a=legAngles[leg],side=leg<4?1:-1;
  const pts=[new THREE.Vector3(Math.cos(a)*.23,Math.sin(a)*.23,spiderZ+.05),pointOn(.92,a+.14*side,spiderZ+.23),pointOn(1.75,a,spiderZ+.02),pointOn(2.52,a-.08*side,spiderZ-.18)];
  makeTube(pts,.058,legMaterial);makeSphere(.092,jointMaterial,pts[1]);makeSphere(.067,jointMaterial,pts[2]);
}
const shellMaterial=new THREE.MeshPhysicalMaterial({color:0x382225,metalness:.86,roughness:.15,clearcoat:1,clearcoatRoughness:.08,emissive:0x180b0d});
makeSphere(.47,shellMaterial,new THREE.Vector3(0,-.24,spiderZ+.17),[.74,1.08,.33]);
const shellRim=new THREE.Mesh(new THREE.TorusGeometry(.36,.018,8,56),new THREE.MeshStandardMaterial({color:0xc84c54,metalness:.84,roughness:.2}));shellRim.position.set(0,-.24,spiderZ+.28);world.add(shellRim);
for(let mark=0;mark<5;mark++)makeSphere(.025,new THREE.MeshBasicMaterial({color:0xe27a76}),new THREE.Vector3((mark-2)*.105,-.28,spiderZ+.49));

// A sparse far field gives the web a sense of scale without obscuring the paths.
const dustPositions=[];for(let i=0;i<170;i++){dustPositions.push(Math.sin(i*12.17)*10,Math.cos(i*4.19)*7,Math.cos(i*1.71)*29-10)}
const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));
scene.add(new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xc9aaa7,size:.025,transparent:true,opacity:.55,depthWrite:false})));

const chapterRail=document.getElementById('chapter-rail');const chapterIndex=document.getElementById('chapter-index');
const labelHost=document.getElementById('web-labels');const labelButtons=[];
chapters.forEach((chapter,index)=>{
  const dot=document.createElement('button');dot.type='button';dot.className='rail-dot';dot.textContent=String(index+1).padStart(2,'0');dot.setAttribute('aria-label',`Jump to chapter ${index+1}: ${chapter.title}`);dot.addEventListener('click',()=>jumpToChapter(index));chapterRail.append(dot);
  const list=document.createElement('button');list.type='button';list.innerHTML=`<span>CHAPTER ${String(index+1).padStart(2,'0')}</span>${chapter.title}`;list.addEventListener('click',()=>{closeIndex();jumpToChapter(index)});chapterIndex.append(list);
});
anchors.forEach(anchor=>{
  const button=document.createElement('button');button.type='button';button.className=`web-label ${anchor.kind==='chapter'?'chapter-label':'section-label'}`;
  button.textContent=String(anchor.index+1).padStart(2,'0');
  button.setAttribute('aria-label',`Open chapter ${anchor.index+1}: ${chapters[anchor.index].title}`);
  button.addEventListener('click',()=>openDetail(anchor.kind,anchor.index));labelHost.append(button);labelButtons.push(button);
});

const panel=document.getElementById('detail-panel'),panelContent=document.getElementById('detail-content'),panelKicker=document.getElementById('detail-kicker'),indexPanel=document.getElementById('index-panel');let lastFocus=null;const openedLegs=new Set();
function openDetail(kind,index,scrollArrival=false){
  const item=chapters[index];if(!item)return;
  openedLegs.add(index);
  if(!panel.classList.contains('open'))lastFocus=document.activeElement;
  panelKicker.textContent=`CHAPTER ${String(index+1).padStart(2,'0')} / 08`;
  const art='<div class="panel-art" aria-hidden="true"><span></span></div>';
  if(kind==='chapter'){
    panelContent.innerHTML=`<div class="detail-layout">${art}<div class="detail-copy"><div class="detail-overline">${item.kicker} / OCTO SALES SYSTEM</div><h2 id="detail-title">${item.title}</h2><p class="panel-lede">${item.summary}</p></div><div class="panel-meta"><span><b>FORMAT</b>Self-paced outline</span><span><b>TOPICS</b>03</span><span><b>EXERCISE</b>01</span></div><div class="detail-columns"><section><h3>Inside this chapter</h3><ul>${item.lessons.map(text=>`<li>${text}</li>`).join('')}</ul></section><div class="practice-box"><strong>PUT IT INTO PRACTICE</strong>${item.practice}</div></div><button class="panel-next" data-next="${(index+1)%chapters.length}" type="button">Continue to chapter ${String((index+1)%chapters.length+1).padStart(2,'0')} <span aria-hidden="true">↗</span></button><p class="panel-note">Sample course outline. Lesson media and enrollment are not yet connected.</p></div>`;
  }
  panel.classList.add('chapter-view');panel.classList.remove('section-view');panel.classList.toggle('scroll-arrival',scrollArrival);panel.classList.add('open');panel.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.getElementById('panel-close').focus();
}
function closeDetail(){panel.classList.remove('open','scroll-arrival');panel.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus?.focus)lastFocus.focus()}
panelContent.addEventListener('click',event=>{const next=event.target.closest('[data-next]');if(next){closeDetail();jumpToChapter(Number(next.dataset.next))}});
document.getElementById('panel-close').addEventListener('click',closeDetail);document.getElementById('panel-scrim').addEventListener('click',closeDetail);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeDetail();closeIndex()}if(event.key==='Tab'&&panel.classList.contains('open')){const items=[...panel.querySelectorAll('button')];if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus()}else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus()}}});
function closeIndex(){indexPanel.classList.remove('open');indexPanel.setAttribute('aria-hidden','true');document.body.style.overflow='';document.getElementById('index-open').focus()}
document.getElementById('index-open').addEventListener('click',()=>{lastFocus=document.activeElement;indexPanel.classList.add('open');indexPanel.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.getElementById('index-close').focus()});
document.getElementById('index-close').addEventListener('click',closeIndex);document.getElementById('index-scrim').addEventListener('click',closeIndex);

const intro=document.getElementById('intro-hud'),activeNode=document.getElementById('active-node'),currentNumber=document.getElementById('active-number'),activeTitle=document.getElementById('active-title'),activeSummary=document.getElementById('active-summary'),activeKicker=document.getElementById('active-kicker'),railDots=[...chapterRail.children];
const scrollState=document.getElementById('scroll-state-text'),progressFill=document.getElementById('progress-fill'),progressCurrent=document.getElementById('progress-current'),scrollCue=document.getElementById('scroll-cue');let progress=0,activeChapter=0;
function scrollMaximum(){return Math.max(1,document.documentElement.scrollHeight-innerHeight)}
function jumpToChapter(index){const p=(index+.12)/chapters.length;window.scrollTo({top:p*scrollMaximum(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
function updateScroll(){progress=Math.max(0,Math.min(1,scrollY/scrollMaximum()));const travel=progress*chapters.length,legIndex=Math.min(chapters.length-1,Math.floor(travel)),legProgress=travel-legIndex;activeChapter=legIndex;const chapter=chapters[activeChapter];const engaged=progress>.025;
  if(!panel.classList.contains('open')){if(legProgress<.18)openedLegs.delete(legIndex);else if(legProgress>=.47&&!openedLegs.has(legIndex))openDetail('chapter',legIndex,true)}
  intro.classList.toggle('away',progress>.06);activeNode.classList.toggle('visible',engaged);currentNumber.textContent=String(activeChapter+1).padStart(2,'0');progressCurrent.textContent=String(activeChapter+1).padStart(2,'0');activeTitle.textContent=chapter.title;activeSummary.textContent=chapter.summary;activeKicker.textContent=chapter.kicker;
  railDots.forEach((dot,index)=>dot.classList.toggle('active',index===activeChapter));progressFill.style.width=`${progress*100}%`;scrollCue.classList.toggle('hidden',engaged);scrollState.textContent=progress<.035?'WEB OVERVIEW':chapter.kicker;
}
window.addEventListener('scroll',updateScroll,{passive:true});window.addEventListener('resize',updateScroll,{passive:true});
document.getElementById('enter-web').addEventListener('click',()=>jumpToChapter(0));document.getElementById('active-open').addEventListener('click',()=>openDetail('chapter',activeChapter));

const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let down=null,orbitX=0,orbitY=0,targetOrbitX=0,targetOrbitY=0;
canvas.addEventListener('pointerdown',event=>{down={x:event.clientX,y:event.clientY,ox:targetOrbitX,oy:targetOrbitY};canvas.setPointerCapture(event.pointerId)});
canvas.addEventListener('pointermove',event=>{if(!down)return;const dx=event.clientX-down.x,dy=event.clientY-down.y;if(Math.hypot(dx,dy)>5){canvas.classList.add('dragging');targetOrbitY=down.oy+dx*.004;targetOrbitX=THREE.MathUtils.clamp(down.ox+dy*.004,-.42,.42)}});
canvas.addEventListener('pointerup',event=>{if(!down)return;if(!canvas.classList.contains('dragging')){pointer.set(event.clientX/innerWidth*2-1,-(event.clientY/innerHeight*2-1));raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(hitNodes,false)[0];if(hit)openDetail(hit.object.userData.kind,hit.object.userData.index)}canvas.classList.remove('dragging');down=null});
canvas.addEventListener('pointercancel',()=>{down=null;canvas.classList.remove('dragging')});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function resize(){const width=innerWidth,height=innerHeight;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false)}window.addEventListener('resize',resize,{passive:true});resize();
function render(time=0){requestAnimationFrame(render);orbitX+=(targetOrbitX-orbitX)*.08;orbitY+=(targetOrbitY-orbitY)*.08;
  const travel=progress*8,legIndex=Math.min(7,Math.floor(travel)),legProgress=travel-legIndex;
  const legAngle=legAngles[legIndex],zoomIn=Math.exp(-Math.pow((legProgress-.5)/.13,2)),travelRadius=3.18*Math.sin(Math.PI*legProgress);
  const focusLocal=pointOn(travelRadius,legAngle,0);
  world.rotation.z=(reducedMotion.matches?0:time*.000012)+orbitY*.12;world.rotation.x=.1+orbitX*.12;world.rotation.y=orbitY*.12;world.updateMatrixWorld(true);
  const focus=focusLocal.applyMatrix4(world.matrixWorld),cameraOrbit=progress*Math.PI*2+orbitY*.22;
  const orbitOffset=.7*(1-zoomIn);camera.position.set(focus.x+Math.cos(cameraOrbit)*orbitOffset,focus.y+Math.sin(cameraOrbit)*orbitOffset,9.4-8.25*zoomIn);camera.lookAt(focus);
  keyLight.position.x=-4+Math.sin(time*.0003)*1.5;violetLight.position.y=-3+Math.cos(time*.00024)*1.1;
  renderer.render(scene,camera);
  const vWidth=innerWidth,vHeight=innerHeight;
  anchors.forEach((anchor,index)=>{const projected=anchor.position.clone().applyMatrix4(world.matrixWorld).project(camera);const x=(projected.x*.5+.5)*vWidth,y=(-projected.y*.5+.5)*vHeight;const visible=projected.z>-1&&projected.z<1&&x>20&&x<vWidth-20&&y>83&&y<vHeight-50;const button=labelButtons[index];button.style.left=`${Math.max(45,Math.min(vWidth-45,x))}px`;button.style.top=`${Math.max(92,Math.min(vHeight-57,y))}px`;button.style.display=visible?'block':'none';});
}
updateScroll();requestAnimationFrame(render);
