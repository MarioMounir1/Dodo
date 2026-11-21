(function () {
  const cfg = window.SCRAPBOOK_CONFIG;
  if (!cfg) return;

  const $ = (id) => document.getElementById(id);

  // Convert Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to ASCII digits
  function toAsciiDigits(str) {
    return str
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
  }

  function normalizeDateInput(raw) {
    const ascii = toAsciiDigits(String(raw || "").trim());
    const cleaned = ascii.replace(/[\s.\-\\]+/g, "/").replace(/\/+/g, "/");
    return cleaned;
  }

  // Heart burst helper
  const burstLayer = $("burst-layer");
  function spawnHearts(originEl, count = 9) {
    const rect = originEl
      ? originEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const symbols = ["♥", "♡", "✦"];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "floating-heart";
      el.textContent = symbols[i % symbols.length];
      el.style.left = `${cx + (Math.random() - 0.5) * 140}px`;
      el.style.top = `${cy}px`;
      el.style.setProperty("--dx", `${(Math.random() - 0.5) * 160}px`);
      el.style.setProperty("--rot", `${(Math.random() - 0.5) * 45}deg`);
      el.style.fontSize = `${1 + Math.random() * 0.85}rem`;
      burstLayer.appendChild(el);
      setTimeout(() => el.remove(), 1650);
    }
  }

  // ================= PASSWORD LOCK SCREEN =================
  const lockCfg = cfg.lockScreen;
  const lockScreen = $("lock-screen");
  const lockCard = $("lock-card");
  const lockInput = $("lock-input");
  const lockError = $("lock-error");
  const UNLOCK_KEY = "dodo_mario_unlocked_17_8_2026";

  function unlockSite(animate) {
    document.body.classList.remove("is-locked");
    lockScreen.classList.add("is-unlocked");
    lockScreen.setAttribute("aria-hidden", "true");
    if (animate) {
      spawnHearts(lockCard, 18);
    }
  }

  if (lockCfg && lockCfg.enabled) {
    $("lock-badge-en").textContent = lockCfg.badgeEn;
    $("lock-badge-ar").textContent = lockCfg.badgeAr;
    $("lock-title").textContent = lockCfg.title;
    $("lock-subtitle-en").textContent = lockCfg.subtitleEn;
    $("lock-subtitle-ar").textContent = lockCfg.subtitleAr;
    lockInput.placeholder = lockCfg.placeholder || "DD/M/YYYY";
    $("lock-submit").textContent = lockCfg.buttonText || "Unlock ♥";
    $("lock-hint").textContent = lockCfg.hintText || "";

    if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
      unlockSite(false);
    } else {
      setTimeout(() => lockInput.focus(), 120);
    }

    $("lock-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const normalized = normalizeDateInput(lockInput.value);
      const digitsOnly = normalized.replace(/\D/g, "");
      const accepted = lockCfg.acceptedNormalized || [];

      if (accepted.includes(normalized) || accepted.includes(digitsOnly)) {
        lockError.textContent = "";
        sessionStorage.setItem(UNLOCK_KEY, "1");
        unlockSite(true);
      } else {
        lockError.textContent = lockCfg.wrongMessage || "Try again ♥";
        lockCard.classList.remove("shake");
        void lockCard.offsetWidth;
        lockCard.classList.add("shake");
        lockInput.select();
      }
    });
  } else {
    unlockSite(false);
  }

  // ================= HERO & META =================
  document.title = `For ${cfg.herName} — From ${cfg.yourName}`;
  $("eyebrow-en").textContent = cfg.eyebrow;
  $("eyebrow-ar").textContent = cfg.eyebrowAr;
  $("hero-title-text").textContent = cfg.heroTitle;
  $("hero-name").textContent = `${cfg.herName} ♥`;
  $("hero-subtitle-ar").textContent = cfg.heroSubtitleAr;
  $("hero-intro").textContent = cfg.heroIntro;
  $("footer-from").textContent = cfg.yourName;
  $("footer-name").textContent = cfg.herName;

  // Helper: renders an <img> and gracefully falls back to a warm placeholder card
  function populatePhotoFrame(container, photo) {
    container.innerHTML = "";
    container.classList.toggle("is-contain", photo.fit === "contain");
    container.classList.toggle("is-dark", Boolean(photo.darkBg));

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "Our memory";
    img.loading = "lazy";

    img.addEventListener("error", () => {
      container.innerHTML = "";
      const ph = document.createElement("div");
      ph.className = `photo-placeholder tone-${photo.placeholderTone || "warm"}`;
      ph.innerHTML = `
        <span class="ph-icon" aria-hidden="true">♥</span>
        <span class="ph-label">${photo.caption || "Our photo goes here"}</span>
        <span class="ph-path">${photo.src}</span>
      `;
      container.appendChild(ph);
    });

    container.appendChild(img);
  }

  // Hero cover Polaroid
  populatePhotoFrame($("cover-frame"), cfg.coverPhoto);
  $("cover-caption-en").textContent = cfg.coverPhoto.caption;
  $("cover-caption-ar").textContent = cfg.coverPhoto.captionAr;
  $("cover-date").textContent = cfg.coverPhoto.date;

  $("cover-polaroid").addEventListener("click", () => {
    document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
  });
  $("cover-polaroid").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
    }
  });

  // ================= POLAROID GALLERY =================
  $("gallery-heading").textContent = cfg.galleryHeading;
  $("gallery-subheading-ar").textContent = cfg.gallerySubheadingAr;

  const grid = $("polaroid-grid");
  cfg.photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "polaroid reveal";
    figure.style.setProperty("--tilt", `${photo.tilt || 0}deg`);
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `Open memory: ${photo.caption}`);

    const tape = document.createElement("div");
    tape.className = `washi-tape washi-${photo.tape || "cream"}`;
    tape.setAttribute("aria-hidden", "true");

    const frame = document.createElement("div");
    frame.className = "polaroid-frame";
    populatePhotoFrame(frame, photo);

    const caption = document.createElement("figcaption");
    caption.className = "polaroid-caption";
    caption.innerHTML = `
      <span class="caption-hand"></span>
      <span class="caption-ar" dir="rtl" lang="ar"></span>
      <span class="caption-date"></span>
    `;
    caption.querySelector(".caption-hand").textContent = photo.caption;
    caption.querySelector(".caption-ar").textContent = photo.captionAr || "";
    caption.querySelector(".caption-date").textContent = photo.date || "";

    figure.append(tape, frame, caption);

    const openThis = () => openLightbox(index);
    figure.addEventListener("click", openThis);
    figure.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openThis();
      }
    });

    grid.appendChild(figure);
  });

  // ================= VIDEO MEMORY =================
  const videoSection = $("video-section");
  if (cfg.videoMoment && cfg.videoMoment.enabled) {
    $("video-kicker").textContent = cfg.videoMoment.kicker;
    $("video-title").textContent = cfg.videoMoment.title;
    $("video-title-ar").textContent = cfg.videoMoment.titleAr;
    $("video-caption-en").textContent = cfg.videoMoment.caption;
    $("video-caption-ar").textContent = cfg.videoMoment.captionAr;
    $("memory-video").src = cfg.videoMoment.src;
  } else if (videoSection) {
    videoSection.style.display = "none";
  }

  // ================= HANDWRITTEN LOVE LETTER =================
  $("letter-eyebrow").textContent = cfg.letter.eyebrow;
  $("letter-title").textContent = cfg.letter.title;
  $("letter-title-ar").textContent = cfg.letter.titleAr;
  $("letter-greeting").textContent = cfg.letter.greeting;

  const letterBody = $("letter-body");
  cfg.letter.paragraphs.forEach((para) => {
    const block = document.createElement("div");
    block.className = "letter-block";

    if (para.en) {
      const pEn = document.createElement("p");
      pEn.className = "letter-en";
      pEn.textContent = para.en;
      block.appendChild(pEn);
    }
    if (para.ar) {
      const pAr = document.createElement("p");
      pAr.className = "letter-ar";
      pAr.dir = "rtl";
      pAr.lang = "ar";
      pAr.textContent = para.ar;
      block.appendChild(pAr);
    }
    letterBody.appendChild(block);
  });

  $("letter-closing-en").textContent = cfg.letter.closing;
  $("letter-closing-ar").textContent = cfg.letter.closingAr;
  $("signature-en").textContent = cfg.yourName;
  $("signature-ar").textContent = cfg.yourNameAr;

  // ================= LIGHTBOX MODAL =================
  const lightbox = $("lightbox");
  let activeIndex = 0;

  function renderLightbox() {
    const photo = cfg.photos[activeIndex];
    if (!photo) return;
    populatePhotoFrame($("lb-frame"), photo);
    $("lb-date").textContent = photo.date || "";
    $("lb-caption-en").textContent = photo.caption || "";
    $("lb-caption-ar").textContent = photo.captionAr || "";
    $("lb-story-en").textContent = photo.story || "";
    $("lb-story-ar").textContent = photo.storyAr || "";
    $("lb-counter").textContent = `${activeIndex + 1} / ${cfg.photos.length}`;
  }

  function openLightbox(index) {
    activeIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function stepLightbox(delta) {
    activeIndex = (activeIndex + delta + cfg.photos.length) % cfg.photos.length;
    renderLightbox();
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") closeLightbox();
  });
  $("lb-prev").addEventListener("click", () => stepLightbox(-1));
  $("lb-next").addEventListener("click", () => stepLightbox(1));

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  // ================= INTERACTIVE CLOSING =================
  const loveBtn = $("love-btn");
  const loveToast = $("love-toast");
  $("love-btn-text").textContent = cfg.ending.buttonText;
  let msgIndex = 0;

  loveBtn.addEventListener("click", () => {
    const messages = cfg.ending.messages || ["I love you ♥"];
    loveToast.textContent = messages[msgIndex % messages.length];
    msgIndex += 1;
    spawnHearts(loveBtn, 10);
  });

  // ================= SCROLL REVEAL =================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
