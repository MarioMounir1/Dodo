(function () {
  const cfg = window.SCRAPBOOK_CONFIG;
  if (!cfg) return;

  const $ = (id) => document.getElementById(id);

  // Convert Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to ASCII digits and strip non-digits
  function toDigits(str) {
    return String(str || "")
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      .replace(/\D/g, "");
  }

  // Heart burst helper
  const burstLayer = $("burst-layer");
  function spawnHearts(originEl, count = 9) {
    if (!burstLayer) return;
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
  const dayInput = $("lock-day");
  const monthInput = $("lock-month");
  const yearInput = $("lock-year");
  const lockError = $("lock-error");
  const UNLOCK_KEY = "dodo_mario_unlocked_17_8_2026";

  // ================= PERIODIC CUTE LOVE WHISPER =================
  const loveWhisper = $("love-whisper");
  let whisperStarted = false;

  function showLoveWhisper() {
    if (!loveWhisper || document.body.classList.contains("is-locked")) return;
    loveWhisper.classList.add("is-showing");
    loveWhisper.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      loveWhisper.classList.remove("is-showing");
      loveWhisper.setAttribute("aria-hidden", "true");
    }, 4500);
  }

  function startLoveWhisperLoop() {
    if (whisperStarted) return;
    whisperStarted = true;
    setInterval(showLoveWhisper, 30000);
  }

  function unlockSite(animate) {
    document.body.classList.remove("is-locked");
    if (lockScreen) {
      lockScreen.classList.add("is-unlocked");
      lockScreen.setAttribute("aria-hidden", "true");
    }
    if (animate) {
      spawnHearts(lockCard, 18);
    }
    startLoveWhisperLoop();
  }

  if (lockCfg && lockCfg.enabled && dayInput && monthInput && yearInput) {
    $("lock-badge-en").textContent = lockCfg.badgeEn;
    if ($("lock-badge-ar")) $("lock-badge-ar").textContent = lockCfg.badgeAr;
    $("lock-title").textContent = lockCfg.title;
    $("lock-subtitle-en").textContent = lockCfg.subtitleEn;
    $("lock-subtitle-ar").textContent = lockCfg.subtitleAr;
    $("lock-submit").textContent = lockCfg.buttonText || "Enter Our Space ♥";
    $("lock-hint").textContent = lockCfg.hintText || "Just type the numbers — no slashes needed";

    dayInput.addEventListener("input", () => {
      dayInput.value = toDigits(dayInput.value).slice(0, 2);
      if (dayInput.value.length === 2) monthInput.focus();
    });

    monthInput.addEventListener("input", () => {
      monthInput.value = toDigits(monthInput.value).slice(0, 2);
      if (
        monthInput.value.length === 2 ||
        (monthInput.value.length === 1 && Number(monthInput.value) > 1)
      ) {
        yearInput.focus();
      }
    });

    yearInput.addEventListener("input", () => {
      yearInput.value = toDigits(yearInput.value).slice(0, 4);
    });

    monthInput.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !monthInput.value) dayInput.focus();
    });
    yearInput.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !yearInput.value) monthInput.focus();
    });

    if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
      unlockSite(false);
    } else {
      setTimeout(() => dayInput.focus(), 120);
    }

    $("lock-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Number(toDigits(dayInput.value));
      const m = Number(toDigits(monthInput.value));
      const yRaw = toDigits(yearInput.value);
      const y = yRaw.length === 2 ? Number(`20${yRaw}`) : Number(yRaw);

      if (d === 17 && m === 8 && y === 2026) {
        lockError.textContent = "";
        sessionStorage.setItem(UNLOCK_KEY, "1");
        unlockSite(true);
      } else {
        lockError.textContent = lockCfg.wrongMessage || "Try again ♥";
        lockCard.classList.remove("shake");
        void lockCard.offsetWidth;
        lockCard.classList.add("shake");
        dayInput.focus();
        dayInput.select();
      }
    });
  } else {
    unlockSite(false);
  }

  // ================= LIVE TOGETHER COUNTER =================
  const startDateMs = new Date(cfg.startDateISO || "2026-08-17T00:00:00").getTime();
  function updateTogetherCounter() {
    const diff = Math.max(0, Date.now() - startDateMs);
    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    $("cnt-days").textContent = String(days);
    $("cnt-hours").textContent = String(hours).padStart(2, "0");
    $("cnt-mins").textContent = String(mins).padStart(2, "0");
    $("cnt-secs").textContent = String(secs).padStart(2, "0");
  }
  updateTogetherCounter();
  setInterval(updateTogetherCounter, 1000);

  // ================= STORAGE (FIREBASE LIVE SYNC + LOCAL FALLBACK) =================
  const LOCAL_MEMORIES_KEY = "dodo_mario_memories_v1";
  const LOCAL_SONGS_KEY = "dodo_mario_songs_v1";
  const LOCAL_NOTES_KEY = "dodo_mario_notes_v1";
  const LOCAL_BUCKET_KEY = "dodo_mario_bucket_v1";
  const LOCAL_FAVS_KEY = "dodo_mario_favs_v1";

  let db = null;
  const syncStatusEl = $("sync-status");

  const fbCfg = cfg.firebase;
  if (
    fbCfg &&
    fbCfg.enabled &&
    fbCfg.config &&
    fbCfg.config.projectId &&
    typeof window.firebase !== "undefined"
  ) {
    try {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(fbCfg.config);
      }
      db = window.firebase.firestore();
      if (syncStatusEl) {
        syncStatusEl.textContent = "● Synced live between Mario & دودو";
        syncStatusEl.classList.add("is-live");
      }
    } catch (err) {
      console.warn("Firebase init failed, using local storage:", err);
      db = null;
    }
  }

  if (!db && syncStatusEl) {
    syncStatusEl.textContent = "Saved on this device";
  }

  function readLocal(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeLocal(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Compress uploaded photo cleanly via <canvas> so it's fast & fits in Firestore
  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Invalid image file"));
        img.onload = () => {
          const MAX_SIDE = 1080;
          let { width, height } = img;
          if (width > MAX_SIDE || height > MAX_SIDE) {
            if (width >= height) {
              height = Math.round((height * MAX_SIDE) / width);
              width = MAX_SIDE;
            } else {
              width = Math.round((width * MAX_SIDE) / height);
              height = MAX_SIDE;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.78;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length > 680000 && quality > 0.4) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ================= HERO & META =================
  document.title = `${cfg.yourName} & ${cfg.herName} — Our Memories`;
  $("eyebrow-en").textContent = cfg.eyebrow;
  $("eyebrow-ar").textContent = cfg.eyebrowAr;
  $("hero-title-text").textContent = cfg.heroTitle;
  $("hero-name").textContent = `${cfg.herName} ♥`;
  $("hero-subtitle-ar").textContent = cfg.heroSubtitleAr;
  $("hero-intro").textContent = cfg.heroIntro;
  $("footer-from").textContent = cfg.yourName;
  $("footer-name").textContent = cfg.herName;

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

  // ================= POLAROID GALLERY (STATIC + DYNAMIC + FILTERS + FAVS) =================
  $("gallery-heading").textContent = cfg.galleryHeading;
  $("gallery-subheading-ar").textContent = cfg.gallerySubheadingAr;

  const grid = $("polaroid-grid");
  let dynamicMemories = [];
  let visiblePhotos = [...cfg.photos];
  let activeFilter = "all";
  let favIds = new Set(readLocal(LOCAL_FAVS_KEY, []));

  function toggleFavorite(photoId, btnEl) {
    if (!photoId) return;
    if (favIds.has(photoId)) {
      favIds.delete(photoId);
    } else {
      favIds.add(photoId);
      spawnHearts(btnEl, 6);
    }
    writeLocal(LOCAL_FAVS_KEY, Array.from(favIds));
    renderGallery();
  }

  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      activeFilter = pill.dataset.filter;
      renderGallery();
    });
  });

  function renderGallery() {
    const combined = [...cfg.photos, ...dynamicMemories];

    visiblePhotos = combined.filter((p) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "favorites") return favIds.has(p.id);
      return p.addedBy === activeFilter;
    });

    grid.innerHTML = "";
    if (!visiblePhotos.length) {
      const empty = document.createElement("p");
      empty.className = "gallery-empty";
      empty.textContent =
        activeFilter === "favorites"
          ? "No favorite memories yet — tap ♥ on any Polaroid to save it here!"
          : `No memories added by ${activeFilter} yet — tap "+ Add a Memory" above ♥`;
      grid.appendChild(empty);
      return;
    }

    visiblePhotos.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "polaroid";
      figure.style.setProperty("--tilt", `${photo.tilt || 0}deg`);
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", `Open memory: ${photo.caption}`);

      const tape = document.createElement("div");
      tape.className = `washi-tape washi-${photo.tape || "cream"}`;
      tape.setAttribute("aria-hidden", "true");

      const favBtn = document.createElement("button");
      const isFav = favIds.has(photo.id);
      favBtn.className = `polaroid-fav-btn${isFav ? " is-fav" : ""}`;
      favBtn.type = "button";
      favBtn.title = isFav ? "Remove from favorites" : "Add to favorites";
      favBtn.setAttribute("aria-label", favBtn.title);
      favBtn.textContent = isFav ? "♥" : "♡";
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(photo.id, favBtn);
      });
      figure.appendChild(favBtn);

      if (photo.addedBy) {
        const badge = document.createElement("span");
        badge.className = "polaroid-author-pill";
        badge.textContent = `By ${photo.addedBy} ♥`;
        figure.appendChild(badge);
      }

      const frame = document.createElement("div");
      frame.className = "polaroid-frame";
      populatePhotoFrame(frame, photo);

      const caption = document.createElement("figcaption");
      caption.className = "polaroid-caption";
      caption.innerHTML = `
        <span class="caption-hand" dir="auto"></span>
        <span class="caption-ar" dir="rtl" lang="ar"></span>
        <span class="caption-date"></span>
      `;
      caption.querySelector(".caption-hand").textContent = photo.caption || "";
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
  }

  async function saveNewMemory(memoryObj) {
    if (db) {
      await db.collection("memories").add(memoryObj);
    } else {
      const next = [
        ...readLocal(LOCAL_MEMORIES_KEY),
        { ...memoryObj, id: `local_${Date.now()}` },
      ];
      writeLocal(LOCAL_MEMORIES_KEY, next);
      dynamicMemories = next;
      renderGallery();
    }
  }

  async function deleteMemoryById(id) {
    if (!id) return;
    if (db) {
      await db.collection("memories").doc(id).delete();
    } else {
      const next = readLocal(LOCAL_MEMORIES_KEY).filter((m) => m.id !== id);
      writeLocal(LOCAL_MEMORIES_KEY, next);
      dynamicMemories = next;
      renderGallery();
    }
  }

  if (db) {
    db.collection("memories")
      .orderBy("createdAt", "asc")
      .onSnapshot(
        (snapshot) => {
          dynamicMemories = snapshot.docs.map((doc) => ({
            id: doc.id,
            isUserAdded: true,
            ...doc.data(),
          }));
          renderGallery();
        },
        (err) => {
          console.warn("Memories sync error:", err);
          dynamicMemories = readLocal(LOCAL_MEMORIES_KEY).map((m) => ({
            ...m,
            isUserAdded: true,
          }));
          renderGallery();
        }
      );
  } else {
    dynamicMemories = readLocal(LOCAL_MEMORIES_KEY).map((m) => ({
      ...m,
      isUserAdded: true,
    }));
    renderGallery();
  }

  // ================= ADD MEMORY MODAL =================
  const addModal = $("add-memory-modal");
  const addForm = $("add-memory-form");
  const photoInput = $("memory-photo-input");
  const photoPreview = $("memory-photo-preview");
  const dropzoneEmpty = $("photo-dropzone-empty");
  const addError = $("add-memory-error");
  const saveMemoryBtn = $("save-memory-btn");
  let selectedPhotoDataUrl = "";
  let selectedTape = "blush";

  function openAddModal() {
    addModal.classList.add("is-open");
    addModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeAddModal() {
    addModal.classList.remove("is-open");
    addModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $("open-add-memory-btn").addEventListener("click", openAddModal);
  addModal.addEventListener("click", (e) => {
    if (e.target.dataset.closeAdd === "true") closeAddModal();
  });

  document.querySelectorAll("#add-memory-modal .tape-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#add-memory-modal .tape-choice").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedTape = btn.dataset.tape;
    });
  });

  photoInput.addEventListener("change", async () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    addError.textContent = "";
    try {
      selectedPhotoDataUrl = await compressImageFile(file);
      photoPreview.src = selectedPhotoDataUrl;
      photoPreview.hidden = false;
      dropzoneEmpty.hidden = true;
    } catch {
      addError.textContent = "Could not load that photo. Please try another image.";
    }
  });

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const caption = $("memory-caption").value.trim();
    const story = $("memory-story").value.trim();
    const date = $("memory-date").value.trim() || new Date().toLocaleDateString();
    const addedBy = $("memory-author").value;

    if (!selectedPhotoDataUrl) {
      addError.textContent = "Please choose a photo first ♥ — اختاروا صورة الأول";
      return;
    }
    if (!caption) {
      addError.textContent = "Please add a short caption ♥";
      return;
    }

    addError.textContent = "";
    saveMemoryBtn.disabled = true;
    saveMemoryBtn.textContent = "Saving...";

    try {
      const tilts = [-2.6, 2.2, -1.8, 2.7, -2.1, 1.9];
      await saveNewMemory({
        src: selectedPhotoDataUrl,
        caption,
        captionAr: "",
        story,
        storyAr: "",
        date,
        addedBy,
        tape: selectedTape,
        tilt: tilts[Math.floor(Math.random() * tilts.length)],
        isUserAdded: true,
        createdAt: Date.now(),
      });

      addForm.reset();
      selectedPhotoDataUrl = "";
      photoPreview.hidden = true;
      photoPreview.src = "";
      dropzoneEmpty.hidden = false;
      closeAddModal();
      spawnHearts($("open-add-memory-btn"), 14);
    } catch (err) {
      console.error(err);
      addError.textContent = "Could not save memory. Check your connection or Firebase rules.";
    } finally {
      saveMemoryBtn.disabled = false;
      saveMemoryBtn.textContent = "Add to Our Scrapbook ♥";
    }
  });

  // ================= OUR FAVORITE SONGS =================
  const songsCfg = cfg.songsSection || {};
  if ($("songs-kicker")) $("songs-kicker").textContent = songsCfg.kicker || "02 / Our Soundtrack";
  if ($("songs-title")) $("songs-title").textContent = songsCfg.title || "Our Favorite Songs";
  if ($("songs-title-ar")) $("songs-title-ar").textContent = songsCfg.titleAr || "";
  if ($("songs-hint")) $("songs-hint").textContent = songsCfg.hint || "";

  const songsGrid = $("songs-grid");
  let dynamicSongs = [];
  let songsUseLocal = !db;

  function sanitizeSongUrl(url) {
    const trimmed = String(url || "").trim();
    if (!trimmed) return "";
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.href;
      }
    } catch {
      return "";
    }
    return "";
  }

  function hasArabic(text) {
    return /[\u0600-\u06FF]/.test(String(text || ""));
  }

  function populateSongFrame(container, song) {
    container.innerHTML = "";
    const img = document.createElement("img");
    img.src = song.src;
    img.alt = song.name || "Favorite song screenshot";
    img.loading = "lazy";

    img.addEventListener("error", () => {
      container.innerHTML = "";
      const ph = document.createElement("div");
      ph.className = "photo-placeholder tone-rose";
      ph.innerHTML = `
        <span class="ph-icon" aria-hidden="true">♪</span>
        <span class="ph-label"></span>
      `;
      ph.querySelector(".ph-label").textContent = song.name || "Our favorite song";
      container.appendChild(ph);
    });

    container.appendChild(img);
  }

  function renderSongs() {
    if (!songsGrid) return;
    const combinedSongs = [...(songsCfg.songs || []), ...dynamicSongs];
    songsGrid.innerHTML = "";

    if (!combinedSongs.length) {
      const empty = document.createElement("p");
      empty.className = "songs-empty";
      empty.textContent =
        songsCfg.emptyText || 'No songs pinned yet — tap "+ Add a Song" to save your first track ♪';
      songsGrid.appendChild(empty);
      return;
    }

    const tilts = [-1.8, 1.5, -1.2, 1.9, -1.4, 1.3];

    combinedSongs.forEach((song, idx) => {
      const card = document.createElement("article");
      card.className = "song-card";
      card.style.setProperty("--tilt", `${song.tilt ?? tilts[idx % tilts.length]}deg`);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `View song: ${song.name || "Favorite song"}`);

      const tape = document.createElement("div");
      tape.className = `washi-tape washi-${song.tape || "blush"}`;
      tape.setAttribute("aria-hidden", "true");

      const noteBadge = document.createElement("span");
      noteBadge.className = "song-badge-note";
      noteBadge.setAttribute("aria-hidden", "true");
      noteBadge.textContent = "♪";

      card.append(tape, noteBadge);

      if (song.addedBy) {
        const authorPill = document.createElement("span");
        authorPill.className = "polaroid-author-pill";
        authorPill.textContent = `By ${song.addedBy} ♥`;
        card.appendChild(authorPill);
      }

      const frame = document.createElement("div");
      frame.className = "song-frame";
      populateSongFrame(frame, song);

      const body = document.createElement("div");
      body.className = "song-body";

      const title = document.createElement("h3");
      title.className = "song-name";
      title.dir = "auto";
      title.textContent = song.name || "Untitled Song";
      body.appendChild(title);

      if (song.artist) {
        const artist = document.createElement("p");
        artist.className = "song-artist";
        artist.dir = "auto";
        artist.textContent = song.artist;
        body.appendChild(artist);
      }

      if (song.quote) {
        const quote = document.createElement("blockquote");
        quote.className = "song-quote";
        quote.dir = hasArabic(song.quote) ? "rtl" : "auto";
        quote.textContent = `“${song.quote}”`;
        body.appendChild(quote);
      }

      const footer = document.createElement("div");
      footer.className = "song-card-footer";

      const safeLink = sanitizeSongUrl(song.link);
      if (safeLink) {
        const listenLink = document.createElement("a");
        listenLink.className = "song-listen-pill";
        listenLink.href = safeLink;
        listenLink.target = "_blank";
        listenLink.rel = "noopener noreferrer";
        listenLink.textContent = "▶ Listen";
        listenLink.addEventListener("click", (e) => e.stopPropagation());
        footer.appendChild(listenLink);
      } else {
        const tapHint = document.createElement("span");
        tapHint.className = "song-tap-hint";
        tapHint.textContent = "Tap to view ♪";
        footer.appendChild(tapHint);
      }

      if (song.isUserAdded && song.id) {
        const delBtn = document.createElement("button");
        delBtn.className = "note-delete";
        delBtn.type = "button";
        delBtn.title = "Remove song";
        delBtn.setAttribute("aria-label", "Remove song");
        delBtn.textContent = "×";
        delBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (confirm("Remove this song from our soundtrack?")) {
            await deleteSongById(song.id);
          }
        });
        footer.appendChild(delBtn);
      }

      card.append(frame, body, footer);

      const openThisSong = () => openSongLightbox(song);
      card.addEventListener("click", openThisSong);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openThisSong();
        }
      });

      songsGrid.appendChild(card);
    });
  }

  async function saveNewSong(songObj) {
    if (db && !songsUseLocal) {
      await db.collection("songs").add(songObj);
    } else {
      const next = [
        { ...songObj, id: `song_${Date.now()}`, isUserAdded: true },
        ...readLocal(LOCAL_SONGS_KEY),
      ];
      writeLocal(LOCAL_SONGS_KEY, next);
      dynamicSongs = next;
      renderSongs();
    }
  }

  async function deleteSongById(id) {
    if (!id) return;
    if (db && !songsUseLocal) {
      await db.collection("songs").doc(id).delete();
    } else {
      const next = readLocal(LOCAL_SONGS_KEY).filter((s) => s.id !== id);
      writeLocal(LOCAL_SONGS_KEY, next);
      dynamicSongs = next;
      renderSongs();
    }
  }

  if (db) {
    db.collection("songs")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          songsUseLocal = false;
          dynamicSongs = snapshot.docs.map((doc) => ({
            id: doc.id,
            isUserAdded: true,
            ...doc.data(),
          }));
          renderSongs();
        },
        (err) => {
          console.warn("Songs Firestore fallback to local:", err);
          songsUseLocal = true;
          dynamicSongs = readLocal(LOCAL_SONGS_KEY).map((s) => ({ ...s, isUserAdded: true }));
          renderSongs();
        }
      );
  } else {
    dynamicSongs = readLocal(LOCAL_SONGS_KEY).map((s) => ({ ...s, isUserAdded: true }));
    renderSongs();
  }

  // Add Song Modal
  const addSongModal = $("add-song-modal");
  const addSongForm = $("add-song-form");
  const songPhotoInput = $("song-photo-input");
  const songPhotoPreview = $("song-photo-preview");
  const songDropzoneEmpty = $("song-dropzone-empty");
  const addSongError = $("add-song-error");
  const saveSongBtn = $("save-song-btn");
  let selectedSongPhotoUrl = "";
  let selectedSongTape = "blush";

  function openAddSongModal() {
    addSongModal.classList.add("is-open");
    addSongModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeAddSongModal() {
    addSongModal.classList.remove("is-open");
    addSongModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if ($("open-add-song-btn")) {
    $("open-add-song-btn").addEventListener("click", openAddSongModal);
  }

  if (addSongModal) {
    addSongModal.addEventListener("click", (e) => {
      if (e.target.dataset.closeAddSong === "true") closeAddSongModal();
    });
  }

  document.querySelectorAll(".song-tape-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".song-tape-choice").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedSongTape = btn.dataset.songTape;
    });
  });

  if (songPhotoInput) {
    songPhotoInput.addEventListener("change", async () => {
      const file = songPhotoInput.files && songPhotoInput.files[0];
      if (!file) return;
      addSongError.textContent = "";
      try {
        selectedSongPhotoUrl = await compressImageFile(file);
        songPhotoPreview.src = selectedSongPhotoUrl;
        songPhotoPreview.hidden = false;
        songDropzoneEmpty.hidden = true;
      } catch {
        addSongError.textContent = "Could not load that screenshot. Please try another image.";
      }
    });
  }

  if (addSongForm) {
    addSongForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = $("song-name").value.trim();
      const artist = $("song-artist").value.trim();
      const quote = $("song-quote").value.trim();
      const rawLink = $("song-link").value.trim();
      const addedBy = $("song-author").value;

      if (!selectedSongPhotoUrl) {
        addSongError.textContent = "Please upload a screenshot of the song first ♪ — اختاروا سكرين شوت الأول";
        return;
      }
      if (!name) {
        addSongError.textContent = "Please enter the song name ♪";
        return;
      }
      if (!quote) {
        addSongError.textContent = "Please write a favorite quote from the song ♥";
        return;
      }

      const link = rawLink ? sanitizeSongUrl(rawLink) : "";
      if (rawLink && !link) {
        addSongError.textContent = "Please enter a valid link starting with https://";
        return;
      }

      addSongError.textContent = "";
      saveSongBtn.disabled = true;
      saveSongBtn.textContent = "Saving...";

      try {
        const tilts = [-1.8, 1.5, -1.2, 1.9, -1.4, 1.3];
        await saveNewSong({
          src: selectedSongPhotoUrl,
          name,
          artist,
          quote,
          link,
          addedBy,
          tape: selectedSongTape,
          tilt: tilts[Math.floor(Math.random() * tilts.length)],
          isUserAdded: true,
          createdAt: Date.now(),
        });

        addSongForm.reset();
        selectedSongPhotoUrl = "";
        songPhotoPreview.hidden = true;
        songPhotoPreview.src = "";
        songDropzoneEmpty.hidden = false;
        closeAddSongModal();
        spawnHearts($("open-add-song-btn"), 14);
      } catch (err) {
        console.error(err);
        addSongError.textContent = "Could not save song. Check your connection or Firebase rules.";
      } finally {
        saveSongBtn.disabled = false;
        saveSongBtn.textContent = "Add to Our Soundtrack ♪";
      }
    });
  }

  // Song Lightbox Modal
  const songLightbox = $("song-lightbox");
  const songLbAuthor = $("song-lb-author");
  const songLbArtist = $("song-lb-artist");
  const songLbQuote = $("song-lb-quote");
  const songLbLink = $("song-lb-link");
  const songLbDelete = $("song-lb-delete");
  let activeSong = null;

  function openSongLightbox(song) {
    if (!songLightbox || !song) return;
    activeSong = song;
    populateSongFrame($("song-lb-frame"), song);
    $("song-lb-name").textContent = song.name || "";

    if (song.artist) {
      songLbArtist.textContent = song.artist;
      songLbArtist.hidden = false;
    } else {
      songLbArtist.hidden = true;
    }

    if (song.addedBy) {
      songLbAuthor.textContent = `Added by ${song.addedBy} ♥`;
      songLbAuthor.hidden = false;
    } else {
      songLbAuthor.hidden = true;
    }

    songLbQuote.textContent = song.quote ? `“${song.quote}”` : "";
    songLbQuote.dir = hasArabic(song.quote) ? "rtl" : "auto";

    const safeLink = sanitizeSongUrl(song.link);
    if (safeLink) {
      songLbLink.href = safeLink;
      songLbLink.hidden = false;
    } else {
      songLbLink.hidden = true;
    }

    songLbDelete.hidden = !(song.isUserAdded && song.id);

    songLightbox.classList.add("is-open");
    songLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeSongLightbox() {
    if (!songLightbox) return;
    songLightbox.classList.remove("is-open");
    songLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeSong = null;
  }

  if (songLightbox) {
    songLightbox.addEventListener("click", (e) => {
      if (e.target.dataset.closeSongLb === "true") closeSongLightbox();
    });
  }

  if (songLbDelete) {
    songLbDelete.addEventListener("click", async () => {
      if (!activeSong || !activeSong.id) return;
      if (!confirm("Remove this song from our soundtrack?")) return;
      await deleteSongById(activeSong.id);
      closeSongLightbox();
    });
  }

  // ================= SHARED BUCKET LIST =================
  const bucketCfg = cfg.bucketSection;
  $("bucket-kicker").textContent = bucketCfg.kicker;
  $("bucket-title").textContent = bucketCfg.title;
  $("bucket-title-ar").textContent = bucketCfg.titleAr;
  $("bucket-hint").textContent = bucketCfg.hint;
  $("bucket-input").placeholder = bucketCfg.placeholder;

  const bucketListEl = $("bucket-list");
  const bucketCountText = $("bucket-count-text");
  const bucketBarFill = $("bucket-bar-fill");
  let bucketItems = [];
  let bucketUseLocal = !db;

  function renderBucketList() {
    bucketListEl.innerHTML = "";
    const doneCount = bucketItems.filter((i) => i.done).length;
    const total = bucketItems.length;
    const pct = total ? Math.round((doneCount / total) * 100) : 0;
    bucketCountText.textContent = `${doneCount} of ${total} dreams completed (${pct}%)`;
    bucketBarFill.style.width = `${pct}%`;

    bucketItems.forEach((item) => {
      const li = document.createElement("li");
      li.className = `bucket-item${item.done ? " is-done" : ""}`;

      const label = document.createElement("label");
      label.className = "bucket-check-label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "bucket-checkbox";
      checkbox.checked = Boolean(item.done);
      checkbox.addEventListener("change", async () => {
        const nextDone = checkbox.checked;
        if (nextDone) spawnHearts(li, 8);
        await toggleBucketItem(item.id, nextDone);
      });

      const textSpan = document.createElement("span");
      textSpan.className = "bucket-item-text";
      textSpan.dir = "auto";
      textSpan.textContent = item.text;

      label.append(checkbox, textSpan);

      const meta = document.createElement("div");
      meta.className = "bucket-item-meta";

      if (item.addedBy) {
        const tag = document.createElement("span");
        tag.className = "bucket-tag";
        tag.textContent = item.addedBy;
        meta.appendChild(tag);
      }

      const delBtn = document.createElement("button");
      delBtn.className = "note-delete";
      delBtn.type = "button";
      delBtn.title = "Remove item";
      delBtn.setAttribute("aria-label", "Remove item");
      delBtn.textContent = "×";
      delBtn.addEventListener("click", async () => {
        await deleteBucketItem(item.id);
      });
      meta.appendChild(delBtn);

      li.append(label, meta);
      bucketListEl.appendChild(li);
    });
  }

  function loadLocalBucket() {
    const saved = readLocal(LOCAL_BUCKET_KEY, null);
    if (Array.isArray(saved)) {
      bucketItems = saved;
    } else {
      bucketItems = (bucketCfg.starterIdeas || []).map((s, idx) => ({
        ...s,
        createdAt: Date.now() - (10 - idx) * 1000,
      }));
      writeLocal(LOCAL_BUCKET_KEY, bucketItems);
    }
    renderBucketList();
  }

  async function addBucketItem(itemObj) {
    if (db && !bucketUseLocal) {
      await db.collection("bucketList").add(itemObj);
    } else {
      bucketItems = [...bucketItems, { ...itemObj, id: `b_${Date.now()}` }];
      writeLocal(LOCAL_BUCKET_KEY, bucketItems);
      renderBucketList();
    }
  }

  async function toggleBucketItem(id, done) {
    if (db && !bucketUseLocal) {
      await db.collection("bucketList").doc(id).update({ done });
    } else {
      bucketItems = bucketItems.map((i) => (i.id === id ? { ...i, done } : i));
      writeLocal(LOCAL_BUCKET_KEY, bucketItems);
      renderBucketList();
    }
  }

  async function deleteBucketItem(id) {
    if (db && !bucketUseLocal) {
      await db.collection("bucketList").doc(id).delete();
    } else {
      bucketItems = bucketItems.filter((i) => i.id !== id);
      writeLocal(LOCAL_BUCKET_KEY, bucketItems);
      renderBucketList();
    }
  }

  if (db) {
    db.collection("bucketList")
      .orderBy("createdAt", "asc")
      .onSnapshot(
        (snapshot) => {
          bucketUseLocal = false;
          if (snapshot.empty && !localStorage.getItem("dodo_bucket_seeded")) {
            localStorage.setItem("dodo_bucket_seeded", "1");
            (bucketCfg.starterIdeas || []).forEach((s, idx) => {
              db.collection("bucketList").add({
                text: s.text,
                addedBy: s.addedBy,
                done: false,
                createdAt: Date.now() + idx,
              });
            });
            return;
          }
          bucketItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          renderBucketList();
        },
        (err) => {
          console.warn("Bucket list Firestore fallback to local:", err);
          bucketUseLocal = true;
          loadLocalBucket();
        }
      );
  } else {
    loadLocalBucket();
  }

  $("bucket-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("bucket-input");
    const text = input.value.trim();
    if (!text) return;
    const addedBy = $("bucket-author").value;

    const btn = $("bucket-submit-btn");
    btn.disabled = true;
    try {
      await addBucketItem({ text, addedBy, done: false, createdAt: Date.now() });
      input.value = "";
      spawnHearts(btn, 7);
    } catch (err) {
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });

  // ================= SHARED NOTES WALL =================
  const notesCfg = cfg.notesSection;
  $("notes-kicker").textContent = notesCfg.kicker;
  $("notes-title").textContent = notesCfg.title;
  if ($("notes-title-ar")) $("notes-title-ar").textContent = notesCfg.titleAr;
  $("notes-hint").textContent = notesCfg.hint;
  $("note-input").placeholder = notesCfg.placeholder;

  const notesWall = $("notes-wall");
  const noteStatus = $("note-status");
  let noteAuthor = "دودو";
  let notesList = [];

  document.querySelectorAll(".author-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".author-pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      noteAuthor = pill.dataset.author;
    });
  });

  function formatNoteDate(ts) {
    try {
      return new Date(ts).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  function renderNotes() {
    notesWall.innerHTML = "";
    if (!notesList.length) {
      const empty = document.createElement("p");
      empty.className = "notes-empty";
      empty.textContent = notesCfg.emptyText;
      notesWall.appendChild(empty);
      return;
    }

    const styles = ["blush", "cream", "sage"];
    const tilts = [-1.8, 1.4, -1.1, 1.9, -1.5, 1.2];

    notesList.forEach((note, idx) => {
      const card = document.createElement("article");
      const tone = styles[idx % styles.length];
      card.className = `note-card note-card-${tone}`;
      card.style.setProperty("--tilt", `${tilts[idx % tilts.length]}deg`);

      const tape = document.createElement("div");
      tape.className = `washi-tape washi-center washi-${tone}`;
      tape.setAttribute("aria-hidden", "true");

      const text = document.createElement("p");
      text.className = "note-text";
      text.dir = "auto";
      text.textContent = note.text;

      const meta = document.createElement("div");
      meta.className = "note-meta";

      const left = document.createElement("span");
      left.innerHTML = `<span class="note-author"></span> · <span class="note-time"></span>`;
      left.querySelector(".note-author").textContent = `From ${note.author} ♥`;
      left.querySelector(".note-time").textContent = formatNoteDate(note.createdAt);

      const delBtn = document.createElement("button");
      delBtn.className = "note-delete";
      delBtn.type = "button";
      delBtn.title = "Delete note";
      delBtn.setAttribute("aria-label", "Delete note");
      delBtn.textContent = "×";
      delBtn.addEventListener("click", async () => {
        if (confirm("Remove this note?")) {
          await deleteNoteById(note.id);
        }
      });

      meta.append(left, delBtn);
      card.append(tape, text, meta);
      notesWall.appendChild(card);
    });
  }

  async function saveNewNote(noteObj) {
    if (db) {
      await db.collection("notes").add(noteObj);
    } else {
      const next = [{ ...noteObj, id: `note_${Date.now()}` }, ...readLocal(LOCAL_NOTES_KEY)];
      writeLocal(LOCAL_NOTES_KEY, next);
      notesList = next;
      renderNotes();
    }
  }

  async function deleteNoteById(id) {
    if (!id) return;
    if (db) {
      await db.collection("notes").doc(id).delete();
    } else {
      const next = readLocal(LOCAL_NOTES_KEY).filter((n) => n.id !== id);
      writeLocal(LOCAL_NOTES_KEY, next);
      notesList = next;
      renderNotes();
    }
  }

  if (db) {
    db.collection("notes")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          notesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          renderNotes();
        },
        (err) => {
          console.warn("Notes sync error:", err);
          notesList = readLocal(LOCAL_NOTES_KEY);
          renderNotes();
        }
      );
  } else {
    notesList = readLocal(LOCAL_NOTES_KEY);
    renderNotes();
  }

  $("note-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("note-input");
    const text = input.value.trim();
    if (!text) return;

    const btn = $("note-submit-btn");
    btn.disabled = true;
    noteStatus.textContent = "Pinning...";

    try {
      await saveNewNote({
        author: noteAuthor,
        text,
        createdAt: Date.now(),
      });
      input.value = "";
      noteStatus.textContent = "Pinned to our wall ♥";
      spawnHearts(btn, 10);
      setTimeout(() => {
        noteStatus.textContent = "";
      }, 2500);
    } catch (err) {
      console.error(err);
      noteStatus.textContent = "Could not save note right now.";
    } finally {
      btn.disabled = false;
    }
  });

  // ================= SAVED LETTER =================
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
  $("signature-ar").textContent = cfg.herName;

  // ================= LIGHTBOX MODAL =================
  const lightbox = $("lightbox");
  const lbAuthorTag = $("lb-author-tag");
  const lbDeleteBtn = $("lb-delete");
  let activeIndex = 0;

  function renderLightbox() {
    const photo = visiblePhotos[activeIndex];
    if (!photo) return;
    populatePhotoFrame($("lb-frame"), photo);
    $("lb-date").textContent = photo.date || "";
    $("lb-caption-en").textContent = photo.caption || "";
    $("lb-caption-ar").textContent = photo.captionAr || "";
    $("lb-story-en").textContent = photo.story || "";
    $("lb-story-ar").textContent = photo.storyAr || "";
    $("lb-counter").textContent = `${activeIndex + 1} / ${visiblePhotos.length}`;

    if (photo.addedBy) {
      lbAuthorTag.textContent = `Added by ${photo.addedBy} ♥`;
      lbAuthorTag.hidden = false;
    } else {
      lbAuthorTag.hidden = true;
    }

    lbDeleteBtn.hidden = !(photo.isUserAdded && photo.id);
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
    if (!visiblePhotos.length) return;
    activeIndex = (activeIndex + delta + visiblePhotos.length) % visiblePhotos.length;
    renderLightbox();
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") closeLightbox();
  });
  $("lb-prev").addEventListener("click", () => stepLightbox(-1));
  $("lb-next").addEventListener("click", () => stepLightbox(1));

  lbDeleteBtn.addEventListener("click", async () => {
    const photo = visiblePhotos[activeIndex];
    if (!photo || !photo.id) return;
    if (!confirm("Remove this memory from our scrapbook?")) return;
    await deleteMemoryById(photo.id);
    closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (addModal.classList.contains("is-open") && e.key === "Escape") {
      closeAddModal();
      return;
    }
    if (addSongModal && addSongModal.classList.contains("is-open") && e.key === "Escape") {
      closeAddSongModal();
      return;
    }
    if (songLightbox && songLightbox.classList.contains("is-open") && e.key === "Escape") {
      closeSongLightbox();
      return;
    }
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

  // ================= SAFE SCROLL REVEAL =================
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }
})();
