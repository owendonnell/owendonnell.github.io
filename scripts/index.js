
/* =========================================
   Owen Donnell – Portfolio Site JavaScript
   ========================================= */

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);

/* ---------- Theme Handling ---------- */
const root = document.documentElement; // <html>
const body = document.body;
const themeBtn = $("#theme-toggle");
const mobileThemeBtn = $("#mobile-theme-toggle");
const navLinks = $(".nav-links");

// Resolve initial theme: localStorage -> OS preference -> light
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

function applyTheme(theme) {
  // Modern hook
  root.setAttribute("data-theme", theme);

  // Legacy support for existing CSS
  body.classList.toggle("dark", theme === "dark");

  // Optional flip for .nav-links.light
  if (navLinks) {
    navLinks.classList.toggle("light", theme !== "dark");
  }

  // Update button icons
  const icon = theme === "dark" ? "☀️" : "🌙";
  if (themeBtn) themeBtn.textContent = icon;
  if (mobileThemeBtn) mobileThemeBtn.textContent = icon;

  localStorage.setItem("theme", theme);
}

// Initialize theme
applyTheme(initialTheme);

// Toggle handler
function toggleTheme() {
  const current = root.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
}

if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
if (mobileThemeBtn) mobileThemeBtn.addEventListener("click", toggleTheme);

// Follow OS changes if user hasn’t set a preference explicitly
if (!storedTheme && window.matchMedia) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  // Modern browsers
  if (mql.addEventListener) {
    mql.addEventListener("change", (e) => applyTheme(e.matches ? "dark" : "light"));
  } else if (mql.addListener) {
    // Safari fallback
    mql.addListener((e) => applyTheme(e.matches ? "dark" : "light"));
  }
}

/* ---------- Navbar: scrolled state ---------- */
const navbar = $(".navbar");
const SCROLL_THRESHOLD = 50;

function updateNavbarOnScroll() {
  if (!navbar) return;
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavbarOnScroll);
updateNavbarOnScroll();

/* ---------- Burger / Mobile Nav ---------- */
const burger = $("#burger");

function openNav() {
  if (!navLinks || !burger) return;
  navLinks.classList.add("open", "show");
  burger.classList.add("open", "active");
}

function closeNav() {
  if (!navLinks || !burger) return;
  navLinks.classList.remove("open", "show");
  burger.classList.remove("open", "active");
}

function toggleNav() {
  if (!navLinks) return;
  const isOpen = navLinks.classList.contains("open") || navLinks.classList.contains("show");
  isOpen ? closeNav() : openNav();
}

if (burger) burger.addEventListener("click", toggleNav);

// Close when clicking a nav link (mobile)
if (navLinks) {
  navLinks.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeNav();
  });
}

// Close on outside click
document.addEventListener("click", (e) => {
  if (!navLinks || !burger) return;
  const isOpen = navLinks.classList.contains("open") || navLinks.classList.contains("show");
  if (!isOpen) return;
  const clickedInside = navLinks.contains(e.target) || burger.contains(e.target);
  if (!clickedInside) closeNav();
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

/* ---------- Smooth Scrolling for hash links ---------- */
function isHashLink(a) {
  return a && a.getAttribute && a.getAttribute("href") && a.getAttribute("href").startsWith("#");
}

function smoothScrollTo(id) {
  if (!id || id === "#") return;
  const el = document.querySelector(id);
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

  // Update URL hash without reflow jump
  history.pushState(null, "", href);
});

/* ---------- Active Link Highlight on Scroll ---------- */
const sections = Array.from(document.querySelectorAll("section[id]"));
const linkMap = new Map(); // "#id" -> <a>

if (navLinks) {
  navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
    const id = a.getAttribute("href");
    if (id) linkMap.set(id, a);
  });
}

function setActiveLinkOnScroll() {
  if (!sections.length || !linkMap.size) return;

  let currentId = null;
  const offset = 120; // adjust for your fixed navbar height

  // Find the first section that contains the offset line
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

/* ---------- Current Year (footer) ---------- */
const yearEl = $("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
