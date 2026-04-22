// ===== Circle Reveal =====

const wrapper = document.getElementById("wrapper");
const circle = document.getElementById("circle");

function updateCircle() {
  const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
  const wrapperHeight = wrapper.offsetHeight;
  const viewportH = window.innerHeight;
  const scrollY = window.scrollY;

  const scrolled = scrollY - wrapperTop + viewportH * 0.6;
  const scrollable = wrapperHeight - viewportH;
  const progress = Math.max(0, Math.min(1, scrolled / scrollable));

  const maxSize =
    Math.sqrt(viewportH * viewportH + window.innerWidth * window.innerWidth) *
    2;
  const size = progress * maxSize;

  circle.style.width = size + "px";
  circle.style.height = size + "px";
}

window.addEventListener("scroll", updateCircle, { passive: true });
updateCircle();

// ===== Hero Image Slider =====

const heroSlides = document.querySelectorAll(".hero-slider-slide");
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  heroSlides[index].style.opacity = "1";
  heroSlides[index].style.transform = "translateX(0)";
  heroSlides[index].style.transition =
    "opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
}

function hideSlide(index) {
  return new Promise((resolve) => {
    const dir = index % 2 === 0 ? "-100%" : "100%";
    heroSlides[index].style.transition =
      "opacity 0.3s ease, transform 0.35s ease";
    heroSlides[index].style.opacity = "0";
    heroSlides[index].style.transform = "translateX(" + dir + ")";
    setTimeout(resolve, 350);
  });
}

async function nextSlide() {
  await hideSlide(currentSlide);
  await new Promise((r) => setTimeout(r, 400));

  currentSlide = (currentSlide + 1) % heroSlides.length;

  const enterDir = currentSlide % 2 === 0 ? "-100%" : "100%";
  heroSlides[currentSlide].style.transition = "none";
  heroSlides[currentSlide].style.transform = "translateX(" + enterDir + ")";
  heroSlides[currentSlide].style.opacity = "0";
  heroSlides[currentSlide].offsetHeight; // force reflow

  showSlide(currentSlide);

  const isLast = currentSlide === heroSlides.length - 1;
  clearTimeout(slideTimer);
  slideTimer = setTimeout(nextSlide, isLast ? 4000 : 1000);
}

slideTimer = setTimeout(nextSlide, 1000);

// ===== Mobile Menu =====

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileDropdown = document.querySelector(".mobile-dropdown");
const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

const menuOverlay = document.createElement("div");
menuOverlay.className = "mobile-menu-overlay";
document.body.appendChild(menuOverlay);

function toggleMobileMenu() {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
  document.body.classList.toggle("menu-open");
}

function closeMobileMenu() {
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
  menuOverlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

hamburger.addEventListener("click", toggleMobileMenu);
menuOverlay.addEventListener("click", closeMobileMenu);

const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");
if (mobileDropdownToggle) {
  mobileDropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    mobileDropdown.classList.toggle("active");
  });
}

mobileLinks.forEach((link) => {
  if (!link.classList.contains("mobile-dropdown-toggle")) {
    link.addEventListener("click", (e) => {
      closeMobileMenu();
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
    closeMobileMenu();
  }
});

// ===== Navbar Scroll Effect =====

window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===== Smooth Scrolling =====

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    if (this.classList.contains("dropdown-item")) {
      const dropdown = this.closest(".dropdown");
      if (dropdown) {
        dropdown.style.opacity = "0";
        dropdown.style.visibility = "hidden";
      }

      const portfolioSection = document.getElementById("portfolio");
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("highlight");
          setTimeout(() => target.classList.remove("highlight"), 2000);
        }, 800);
      }
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== Dropdown Menu =====

const portfolioDropdown = document.querySelector(".nav-item");
let dropdownTimeout;

if (portfolioDropdown) {
  const dropdown = portfolioDropdown.querySelector(".dropdown");

  portfolioDropdown.addEventListener("mouseenter", () => {
    clearTimeout(dropdownTimeout);
    dropdown.style.opacity = "1";
    dropdown.style.visibility = "visible";
  });

  portfolioDropdown.addEventListener("mouseleave", () => {
    dropdownTimeout = setTimeout(() => {
      dropdown.style.opacity = "0";
      dropdown.style.visibility = "hidden";
    }, 300);
  });
}

// ===== Intersection Observers =====

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px 100px 0px" },
);

document
  .querySelectorAll(".fade-in, .fade-in-left, .fade-in-right")
  .forEach((el) => observer.observe(el));

// ===== Transition Text: Word-by-word Reveal =====

const transitionText = document.querySelector(".transition-text");
if (transitionText) {
  const words = transitionText.textContent.split(" ");
  transitionText.innerHTML = words
    .map(
      (word, i) =>
        '<span class="reveal-word" style="display:inline-block;opacity:0;transform:translateY(30px);transition:opacity 0.5s ease ' +
        i * 0.06 +
        "s, transform 0.6s cubic-bezier(0.16,1,0.3,1) " +
        i * 0.06 +
        's">' +
        word +
        "&nbsp;</span>",
    )
    .join("");

  const wordObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.querySelectorAll(".reveal-word").forEach((w) => {
            w.style.opacity = "1";
            w.style.transform = "translateY(0)";
          });
        }
      });
    },
    { threshold: 0.3 },
  );
  wordObserver.observe(transitionText);
}

// ===== Parallax & Color Waves =====

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  document.querySelectorAll(".parallax-element").forEach((element, index) => {
    const speed = 0.5 + index * 0.2;
    element.style.transform = `translateY(${-(scrolled * speed)}px)`;
  });

  const transitionSection = document.querySelector(".color-transition");
  if (transitionSection) {
    const rect = transitionSection.getBoundingClientRect();
    const sectionHeight = transitionSection.offsetHeight;
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / sectionHeight));

    document.querySelectorAll(".color-wave").forEach((wave, index) => {
      wave.style.opacity = 0.1 + scrollProgress * 0.4 * (1 - index * 0.2);
    });
  }
});

// ===== Logo: Scroll to Top =====

document.querySelector(".logo").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
