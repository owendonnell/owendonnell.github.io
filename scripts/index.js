
/* ===========================
   Theme handling (persisted)
   =========================== */

// Utility: safely get elements
const $ = (sel) => document.querySelector(sel);

const root = document.documentElement; // <html>
const body = document.body;
const themeBtn = $("#theme-toggle");
const mobileThemeBtn = $("#mobile-theme-toggle");
const navLinks = $(".nav-links");

// Determine initial theme: localStorage -> system preference -> light
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

// Apply theme to both new (data-theme) and legacy (.dark) selectors
function applyTheme(theme) {
  // New approach
  root.setAttribute("data-theme", theme);

  // Legacy class (in case your CSS targets .dark on <body>)
  body.classList.toggle("dark", theme === "dark");

  // Optional: if your nav has a .light style that flips in dark mode
  if (navLinks) {
    navLinks.classList.toggle("light", theme !== "dark");
  }

  // Update icons
  const icon = theme === "dark" ? "☀️" : "🌙";
  if (themeBtn) themeBtn.textContent = icon;
  if (mobileThemeBtn) mobileThemeBtn.textContent = icon;

  // Persist
  localStorage.setItem("theme", theme);
}

// initialize
applyTheme(initialTheme);

// Toggle handler
function toggleTheme() {
  const current = root.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
}

if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
if (mobileThemeBtn) mobileThemeBtn.addEventListener("click", toggleTheme);

// Keep in sync with OS changes if user hasn’t explicitly chosen
if (!storedTheme && window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    applyTheme(e.matches ? "dark" : "light");
  });
}

/* ===========================
   Navbar: scrolled state
   =========================== */
const navbar = $(".navbar");
const SCROLL_THRESHOLD = 50;

function onScroll() {
  if (!navbar) return;
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", onScroll);
onScroll(); // set on load

/* ===========================
   Burger / Mobile nav
   =========================== */
const burger = $("#burger");

// We’ll support either .open or .show (to match different CSS files)
function openNav() {
  if (!navLinks || !burger) return;
  navLinks.classList.add("open");
  navLinks.classList.add("show");
  burger.classList.add("open");
  burger.classList.add("active");
  // Lock body scroll if desired
  // body.style.overflow = "hidden";
}

function closeNav() {
  if (!navLinks || !burger) return;
  navLinks.classList.remove("open");
  navLinks.classList.remove("show");
  burger.classList.remove("open");
  burger.classList.remove("active");
  // body.style.overflow = "";
}

function toggleNav() {
  if (!navLinks || !burger) return;
  const isOpen = navLinks.classList.contains("open") || navLinks.classList.contains("show");
  isOpen ? closeNav() : openNav();
}

if (burger) burger.addEventListener("click", toggleNav);

// Close on link click (mobile)
if (navLinks) {
  navLinks.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "A") {
      closeNav();
    }
  });
}

// Close on outside click
document.addEventListener("click", (e) => {
  if (!navLinks || !burger) return;
  const isOpen = navLinks.classList.contains("open") || navLinks.classList.contains("show");
  if (!isOpen) return;
  const clickInsideNav = navLinks.contains(e.target) || burger.contains(e.target);
  if (!clickInsideNav) closeNav();
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

/* ===========================
   Smooth scrolling for hash links
   =========================== */
function isHashLink(a) {
  return a && a.getAttribute && a.getAttribute("href") && a.getAttribute("href").startsWith("#");
}

function smoothScrollTo(id) {
  const el = id && id !== "#" ? document.querySelector(id) : null;
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a || !isHashLink(a)) return;
  const href = a.getAttribute("href");
  if (!href) return;
  // prevent default jump
  e.preventDefault();
  closeNav();
  smoothScrollTo(href);
  // update hash without instant jump
  history.pushState(null, "", href);
});

/* ===========================
   Active link highlight on scroll
   =========================== */
const sections = Array.from(document.querySelectorAll("section[id]"));
const linkMap = new Map(); // id -> anchor element

if (navLinks) {
  navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
    const id = a.getAttribute("href");
    if (id) linkMap.set(id, a);
  });
}

function setActiveLinkOnScroll() {
  if (!sections.length || !linkMap.size) return;

  let currentId = null;
  const offset = 120; // adjust for fixed navbar height

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom >= offset) {
      currentId = `#${section.id}`;
      break;
    }
  }

  linkMap.forEach((a, id) => {
    if (id === currentId) a.classList.add("active");
    else a.classList.remove("active");
  });
}

window.addEventListener("scroll", setActiveLinkOnScroll);
window.addEventListener("resize", setActiveLinkOnScroll);
setActiveLinkOnScroll();

/* ===========================
   Tiny util: current year (if present)
   =========================== */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
