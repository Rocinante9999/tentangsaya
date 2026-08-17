const rail=document.getElementById('rail');
const slides=[...document.querySelectorAll('.slide')];
const dotsWrap=document.getElementById('dots');
const now=document.getElementById('slideNow');
const total=document.getElementById('slideTotal');
const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const isMobile=()=>matchMedia('(max-width:980px)').matches;
total.textContent=String(slides.length).padStart(2,'0');

slides.forEach((s,i)=>{
 const bg=s.dataset.bg; if(bg)s.style.setProperty('--bgimg',`url("${bg}")`);
 const d=document.createElement('button'); d.className='dot'; d.type='button'; d.ariaLabel=`Go to slide ${i+1}`;
 d.addEventListener('click',()=>go(i)); dotsWrap.appendChild(d);
});
const dots=[...dotsWrap.children];
function index(){return clamp(Math.round(rail.scrollLeft/Math.max(1,rail.clientWidth)),0,slides.length-1)}
function setActive(i){dots.forEach((d,n)=>d.classList.toggle('active',n===i));now.textContent=String(i+1).padStart(2,'0');document.documentElement.style.setProperty('--accent',slides[i].dataset.accent||'#a7ff32')}
function go(i){slides[clamp(i,0,slides.length-1)].scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});closeMenu()}
function next(){go(index()+1)} function prev(){go(index()-1)}
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(slides.indexOf(e.target))}),{root:rail,threshold:.62}).observe(slides[0]);
slides.slice(1).forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(slides.indexOf(e.target))}),{root:rail,threshold:.62}).observe(s));
setActive(0);
let wheelLock=false;rail.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<Math.abs(e.deltaX))return;if(wheelLock)return;e.preventDefault();wheelLock=true;e.deltaY>0?next():prev();setTimeout(()=>wheelLock=false,650)},{passive:false});
window.addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();next()}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();prev()}else if(e.key==='Home'){e.preventDefault();go(0)}else if(e.key==='End'){e.preventDefault();go(slides.length-1)}});
let sx=0,sy=0;rail.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY},{passive:true});rail.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<45)return;Math.abs(dx)>Math.abs(dy)?(dx<0?next():prev()):(dy<0?next():prev())},{passive:true});
function closeMenu(){mobileMenu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}
menuBtn.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);slides.forEach((s,i)=>{const active=i===index();if(active&&!isMobile()){s.style.setProperty('--mx',`${x*14}px`);s.style.setProperty('--my',`${y*10}px`)}})});
