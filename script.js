const slides = [...document.querySelectorAll(".slide")];
const total = slides.length;
let current = 0;
let animating = false;
let projectIndex = 0;
const projects = [...document.querySelectorAll(".project-card")];

const currentEl = document.querySelector("#current");
const totalEl = document.querySelector("#total");
const progress = document.querySelector(".progress span");
totalEl.textContent = String(total).padStart(2,"0");
progress.style.width = `${100 / total}%`;

function showSlide(next, direction = 1) {
  if (animating || next === current || next < 0 || next >= total) return;
  animating = true;
  const oldSlide = slides[current];
  const newSlide = slides[next];

  oldSlide.classList.remove("active");
  oldSlide.classList.add("exit");
  newSlide.style.setProperty("--dir", direction);
  newSlide.classList.add("active");

  setTimeout(() => {
    oldSlide.classList.remove("exit");
    current = next;
    currentEl.textContent = String(current + 1).padStart(2,"0");
    progress.style.width = `${((current + 1) / total) * 100}%`;
    animating = false;
  }, 650);
}

function nextSlide(){ showSlide(Math.min(total - 1, current + 1), 1); }
function prevSlide(){ showSlide(Math.max(0, current - 1), -1); }

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = Number(btn.dataset.go);
    if (target === current) return;
    showSlide(target, target > current ? 1 : -1);
    document.querySelector(".mobile-nav")?.classList.remove("open");
  });
});

document.querySelector("#nextSlide").addEventListener("click", nextSlide);
document.querySelector("#prevSlide").addEventListener("click", prevSlide);

window.addEventListener("keydown", e => {
  if (["ArrowDown","PageDown"," ","ArrowRight"].includes(e.key)) { e.preventDefault(); nextSlide(); }
  if (["ArrowUp","PageUp","ArrowLeft"].includes(e.key)) { e.preventDefault(); prevSlide(); }
  if (e.key === "Home") showSlide(0);
  if (e.key === "End") showSlide(total - 1);
});

let wheelLock = false;
window.addEventListener("wheel", e => {
  if (wheelLock) return;
  wheelLock = true;
  e.deltaY > 0 ? nextSlide() : prevSlide();
  setTimeout(() => wheelLock = false, 700);
}, {passive:true});

let touchStartX = 0, touchStartY = 0;
window.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, {passive:true});
window.addEventListener("touchend", e => {
  const x = e.changedTouches[0].clientX - touchStartX;
  const y = e.changedTouches[0].clientY - touchStartY;
  if (Math.max(Math.abs(x), Math.abs(y)) < 45) return;
  if (Math.abs(y) >= Math.abs(x)) y < 0 ? nextSlide() : prevSlide();
  else x < 0 ? nextSlide() : prevSlide();
}, {passive:true});

function showProject(next) {
  if (next < 0) next = projects.length - 1;
  if (next >= projects.length) next = 0;
  projects.forEach((p,i) => {
    p.classList.remove("active-card","prev-card");
    if (i === next) p.classList.add("active-card");
    else if (i < next || (next === 0 && i === projects.length - 1)) p.classList.add("prev-card");
  });
  projectIndex.textContent = `${String(next+1).padStart(2,"0")} / ${String(projects.length).padStart(2,"0")}`;
  projectIndex.dataset.i = next;
  projectIndex = next;
}
const projectLabel = document.querySelector("#projectIndex");
document.querySelector("#nextProject").addEventListener("click", () => showProject(projectIndex + 1));
document.querySelector("#prevProject").addEventListener("click", () => showProject(projectIndex - 1));
showProject(0);

const toggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
toggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

const cursor = document.querySelector(".cursor-dot");
window.addEventListener("pointermove", e => {
  cursor.style.left = `${e.clientX - 4}px`;
  cursor.style.top = `${e.clientY - 4}px`;
});
document.querySelectorAll("button,a").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.style.transform = "scale(3)");
  el.addEventListener("mouseleave", () => cursor.style.transform = "scale(1)");
});
