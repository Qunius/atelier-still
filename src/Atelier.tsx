import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import "@/atelier.css";


const projects=[
 {name:"Fall Line House",kind:"Residence",image:0,description:"A low concrete horizon in the pine forest. The weight of the roof holds a long band of warm, inhabited light."},
 {name:"Timber Core",kind:"Interior",image:1,description:"An oak room within a concrete shell. Daylight crosses the structure, revealing the grain of one material against the mass of another."},
 {name:"House of Shadow",kind:"Spatial study",image:2,description:"A room shaped by subtraction. Curved mineral surfaces catch a narrow seam of daylight."},
 {name:"Glass Pavilion",kind:"Pavilion",image:4,description:"A translucent enclosure at the forest edge. Glass holds the light while the trees remain visible beyond."},
 {name:"Archive of Matter",kind:"Objects",image:3,description:"Twelve speculative material studies. An examination of weight, texture and the small irregularities left by making."}
];
const materials=[{name:"Concrete",img:1,note:"Mass. Cast surfaces. The record of the formwork."},{name:"Oak",img:3,note:"Grain. End cuts. Warmth held in a dark surface."},{name:"Glass",img:4,note:"A boundary that carries light."},{name:"Light",img:2,note:"The material that changes every other material."}];
const objects=["Fired clay","Cast iron","Oak","Granite","Glazed earth","Mineral plaster","Charred timber","Stoneware","Basalt","Folded metal","Ash","Raw clay"];
const plate=(i:number)=>import.meta.env.BASE_URL+"assets/plate-"+i+".webp";
function Mark(){return <svg viewBox="0 0 26 26" aria-hidden="true"><path d="M2 23V3h8v20M16 23V3h8v20M2 13h22" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>}
export default function Atelier(){
 const root=useRef<HTMLDivElement>(null), dialog=useRef<HTMLDialogElement>(null), indexDialog=useRef<HTMLDialogElement>(null), cursor=useRef<HTMLDivElement>(null), preview=useRef<HTMLDivElement>(null);
 const [material,setMaterial]=useState(0),[selected,setSelected]=useState(0),[project,setProject]=useState(0),[hovered,setHovered]=useState(0),[ready,setReady]=useState(false),[contact,setContact]=useState(false);
 const opener=useRef<HTMLElement|null>(null);
 function openProject(i:number){opener.current=document.activeElement as HTMLElement;setProject(i);dialog.current?.showModal()}
 function closeProject(){dialog.current?.close();opener.current?.focus()}
 function openIndex(){opener.current=document.activeElement as HTMLElement;indexDialog.current?.showModal();document.documentElement.classList.add("index-open")}
 function closeIndex(){indexDialog.current?.close();document.documentElement.classList.remove("index-open");opener.current?.focus()}
 useEffect(()=>{let cancelled=false;const img=new Image();img.src=plate(0);const done=()=>{if(!cancelled)setReady(true)};img.decode().then(done,done);const timeout=setTimeout(done,3500);return()=>{cancelled=true;clearTimeout(timeout)}},[]);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)",()=>{
   const lenis=new Lenis({duration:1.05,smoothWheel:true,anchors:true});
   const tick=(time:number)=>lenis.raf(time*1000);gsap.ticker.add(tick);lenis.on("scroll",ScrollTrigger.update);
   const ctx=gsap.context(()=>{
    gsap.to(".hero-image",{yPercent:12,scale:1.045,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    const tl=gsap.timeline({scrollTrigger:{trigger:".approach",start:"top top",end:"bottom bottom",scrub:.65}});
    tl.to(".approach-exterior",{xPercent:-7,scale:1.045,ease:"none"},0).to(".approach-title",{xPercent:18,ease:"none"},0).fromTo(".approach-interior",{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",ease:"none",duration:.52},.48);
    gsap.to(".philosophy h2 span:last-child",{xPercent:-9,ease:"none",scrollTrigger:{trigger:".philosophy",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.to(".reading-progress",{scaleX:1,ease:"none",scrollTrigger:{trigger:root.current,start:"top top",end:"bottom bottom",scrub:true}});
   },root);
   return()=>{ctx.revert();gsap.ticker.remove(tick);lenis.destroy()};
  });
  let raf=0,px=0,py=0,x=0,y=0;
  const fine=matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
  const move=(e:PointerEvent)=>{px=e.clientX;py=e.clientY;const target=e.target as HTMLElement;const label=target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor||"";if(cursor.current){cursor.current.dataset.active=label?"true":"false";cursor.current.textContent=label} };
  const animate=()=>{x+=(px-x)*.14;y+=(py-y)*.14;if(cursor.current)cursor.current.style.transform="translate3d("+x+"px,"+y+"px,0)";if(preview.current)preview.current.style.transform="translate3d("+Math.min(innerWidth-420,Math.max(20,x+75))+"px,"+Math.max(90,Math.min(innerHeight-280,y-130))+"px,0)";raf=requestAnimationFrame(animate)};
  if(fine){document.documentElement.classList.add("fine-cursor");addEventListener("pointermove",move);raf=requestAnimationFrame(animate)}
  const refresh=()=>ScrollTrigger.refresh();addEventListener("load",refresh);
  return()=>{mm.revert();cancelAnimationFrame(raf);removeEventListener("pointermove",move);removeEventListener("load",refresh);document.documentElement.classList.remove("fine-cursor")};
 },[]);
 return <div ref={root} className="atelier">
  <a className="skip" href="#content">Skip to content</a>
  <div className={"arrival "+(ready?"is-ready":"")} aria-hidden="true"><Mark/><span/></div>
  <div ref={cursor} className="cursor" aria-hidden="true"/>
  <header className="site-header"><a href="#top" aria-label="Atelier Still home" className="wordmark"><Mark/>ATELIER STILL</a><nav aria-label="Main navigation"><button onClick={openIndex} data-cursor="INDEX">INDEX <span>↗</span></button><a href="#info">INFO</a><a href="#contact">CONTACT</a></nav></header>
  <div className="reading-progress" aria-hidden="true"/>
  <main id="content">
   <section className="hero" id="top"><img className="hero-image" src={plate(0)} alt="A long concrete residence with warm glazing in a dark pine forest" fetchPriority="high"/><div className="hero-shade"/><div className="hero-top micro"><span>ARCHITECTURE<br/>INTERIORS / OBJECTS</span><span>STOCKHOLM<br/>59°19′ N / 18°04′ E</span></div><h1>Space.<br/><span>Held in memory.</span></h1><div className="hero-bottom micro"><span>AN EXPLORATION IN FIVE ACTS</span><a href="#fall-line">ENTER THE STUDY <span>↓</span></a><span>2026</span></div></section>
   <section className="approach" id="fall-line" aria-label="Fall Line House cinematic study"><div className="approach-stage"><img className="approach-exterior" src={plate(0)} alt="Fall Line House exterior"/><img className="approach-interior" src={plate(1)} alt="Concrete structure opening into a warm timber interior" loading="lazy"/><div className="sequence-caption micro"><span>01 / FALL LINE HOUSE</span><span>RESIDENTIAL STUDY / 2026</span></div><h2 className="approach-title">A long horizon.<br/>A quiet interior.</h2><button className="plate-link" data-cursor="VIEW ↗" onClick={()=>openProject(0)}>VIEW PROJECT <span>↗</span></button><span className="sequence-rule" aria-hidden="true"/></div></section>
   <section className="materials" aria-labelledby="materials-title"><div className="section-line micro"><span>THE MATERIAL DESK</span><span>01 / 04</span></div><div className="material-layout"><div><h2 id="materials-title">Nothing<br/>without matter.</h2><div className="material-controls">{materials.map((m,i)=><button key={m.name} onMouseEnter={()=>setMaterial(i)} onFocus={()=>setMaterial(i)} onClick={()=>setMaterial(i)} aria-pressed={material===i}><sup>0{i+1}</sup>{m.name}<span>{material===i?"↗":"+"}</span></button>)}</div></div><figure className={"material-figure material-"+material}>{materials.map((m,i)=><img key={m.name} src={plate(m.img)} alt={m.name+" architectural study"} loading="lazy" className={material===i?"active":""}/>)}<figcaption><span className="micro">SAMPLE / 0{material+1}</span><p>{materials[material].note}</p></figcaption></figure></div></section>
   <section className="project-index" id="projects"><div className="section-line micro"><span>PROJECT INDEX</span><span>FIVE SPATIAL STUDIES</span></div><div className="index-list" onMouseLeave={()=>preview.current?.classList.remove("visible")}>{projects.map((p,i)=><button key={p.name} className="index-row" onClick={()=>openProject(i)} onMouseEnter={()=>{setHovered(i);preview.current?.classList.add("visible")}} data-cursor="VIEW ↗"><span className="micro">0{i+1}</span><span className="project-name">{p.name}</span><span className="micro project-kind">{p.kind}</span><span className="row-arrow">↗</span><img className="mobile-thumb" src={plate(p.image)} alt="" loading="lazy"/></button>)}</div></section>
   <section id="timber" className="timber"><div className="timber-heading micro"><span>02 / TIMBER CORE</span><span>LIGHT THROUGH STRUCTURE</span></div><ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} className="timber-film"/></section>
   <section className="archive" id="archive"><div className="archive-heading"><div><span className="micro">05 / OBJECT STUDIES</span><h2>Archive of matter.</h2></div><p>Twelve objects.<br/>A vocabulary of surfaces.</p></div><div className="archive-wall">{objects.map((o,i)=><button key={o} aria-pressed={selected===i} className={"archive-cell "+(selected===i?"selected":"")} onMouseEnter={()=>setSelected(i)} onFocus={()=>setSelected(i)} onClick={()=>setSelected(i)} style={{backgroundImage:"url("+plate(3)+")",backgroundPosition:(i%4)*100/3+"% "+Math.floor(i/4)*50+"%"}} aria-label={"Study A-"+String(i+17).padStart(3,"0")+", "+o}><span className="micro">A-{String(i+17).padStart(3,"0")}<br/>{o.toUpperCase()}</span></button>)}</div><div className="archive-label" aria-live="polite"><span className="micro">A-{String(selected+17).padStart(3,"0")} / {objects[selected].toUpperCase()}</span><span className="micro">SPECULATIVE MATERIAL STUDY / 2026</span></div></section>
   <section className="philosophy" id="info"><span className="micro">ON SPACE AND MEMORY</span><h2><span>We work with mass.</span><span>With light.</span><span>With what remains.</span></h2><div className="philosophy-note"><Mark/><p>A wall changes the light. A threshold changes the pace. An object gives a room its measure. Our interest is in these relationships.</p></div></section>
   <section className="selected-work"><div className="section-line micro"><span>SELECTED PLATES</span><span>03 / 04</span></div><button className="selected-big" onClick={()=>openProject(2)} data-cursor="VIEW PROJECT ↗"><div className="image-window"><img src={plate(2)} alt="Sculptural charcoal chamber with a narrow shaft of daylight" loading="lazy"/></div><span className="plate-caption"><span>House of Shadow</span><span className="micro">SPATIAL STUDY / 2026 ↗</span></span></button><button className="selected-small" onClick={()=>openProject(3)} data-cursor="VIEW PROJECT ↗"><div className="image-window"><img src={plate(4)} alt="Translucent glass pavilion at the forest edge" loading="lazy"/></div><span className="plate-caption"><span>Glass Pavilion</span><span className="micro">PAVILION / 2026 ↗</span></span></button></section>
   <footer id="contact"><div className="section-line micro"><span>ATELIER STILL / STOCKHOLM</span><a href="#top">BACK TO THE ENTRANCE ↑</a></div><h2>Make room<br/>for something lasting.</h2><button className="contact-link" onClick={()=>setContact(!contact)} aria-expanded={contact}>Begin a conversation <span>↗</span></button>{contact&&<p className="contact-note" role="status">Atelier Still is a fictional studio created for this architectural experience. A contact address has not been connected.</p>}<div className="footer-base micro"><span>ARCHITECTURE / INTERIORS / OBJECTS</span><span>FICTIONAL STUDIO. IMAGINED PROJECTS.<br/>AI-GENERATED ARCHITECTURAL IMAGERY.</span><span>© 2026 ATELIER STILL</span></div></footer>
  </main>
  <div ref={preview} className="index-preview" aria-hidden="true"><img src={plate(projects[hovered].image)} alt=""/><span className="micro">0{hovered+1} / {projects[hovered].name.toUpperCase()}</span></div>
  <dialog ref={dialog} className="project-dialog" onCancel={closeProject} onClick={e=>{if(e.target===e.currentTarget)closeProject()}}><button className="dialog-close micro" onClick={closeProject}>CLOSE ×</button><img src={plate(projects[project].image)} alt={projects[project].name}/><div className="project-detail"><span className="micro">0{project+1} / {projects[project].kind.toUpperCase()} / 2026</span><h2>{projects[project].name}</h2><p>{projects[project].description}</p><div className="detail-bottom micro"><span>FICTIONAL ARCHITECTURAL STUDY</span><button onClick={()=>setProject((project+1)%projects.length)}>NEXT PROJECT ↗</button></div></div></dialog>
  <dialog ref={indexDialog} className="index-dialog" onCancel={closeIndex}><div className="panel-top"><span className="wordmark"><Mark/>ATELIER STILL</span><button className="micro" onClick={closeIndex}>CLOSE ×</button></div><div className="micro panel-label">AN INDEX OF SPACES</div>{projects.map((p,i)=><button className="panel-row" key={p.name} onClick={()=>{closeIndex();openProject(i)}}><span className="micro">0{i+1}</span><span>{p.name}</span><span>↗</span></button>)}<a className="micro panel-contact" href="#contact" onClick={closeIndex}>CONTACT ↗</a></dialog>
 </div>
}

