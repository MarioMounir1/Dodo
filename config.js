/**
 * ============================================================
 *  MARIO & دودو — OUR SHARED MEMORIES SPACE
 * ============================================================
 */
window.SCRAPBOOK_CONFIG = {
  // Couple names
  herName: "دودو",
  herNameAr: "دودو",
  yourName: "Mario",
  yourNameAr: "ماريو",

  // The day your story started (used for live counter & lock screen)
  startDateISO: "2026-08-17T00:00:00",
  startDateLabel: "17 / 8 / 2026",

  // ============================================================
  //  LIVE CLOUD SYNC (Firebase Firestore)
  // ============================================================
  firebase: {
    enabled: true,
    config: {
      apiKey: "AIzaSyAwoiwsW-iE23cBFd3piyfK1BRvscx8krk",
      authDomain: "dodo-33f1d.firebaseapp.com",
      projectId: "dodo-33f1d",
      storageBucket: "dodo-33f1d.firebasestorage.app",
      messagingSenderId: "661090486817",
      appId: "1:661090486817:web:0101afeb8578586392b160",
      measurementId: "G-WTW02JE264",
    },
  },

  // Password Lock Screen (Day you started talking: 17/8/2026)
  lockScreen: {
    enabled: true,
    badgeEn: "Our Space",
    badgeAr: "",
    title: "Mario & دودو",
    subtitleEn: "Enter the day our story started to open our memories",
    subtitleAr: "اكتبوا اليوم اللي بدأت فيه قصتنا عشان نفتح ذكرياتنا",
    buttonText: "Enter Our Space ♥",
    wrongMessage: "Almost! Think of the day we first talked ♥ — حاولوا تاني",
    hintText: "Just type the numbers — no slashes needed",
  },

  // Hero section
  eyebrow: "Since 17 / 8 / 2026",
  eyebrowAr: "مساحتنا وذكرياتنا سوا",
  heroTitle: "Mario &",
  heroSubtitleAr: "قصتنا، صورنا، وكل ذكرياتنا الحلوة في مكان واحد",
  heroIntro:
    "Our private little corner of the internet — a living scrapbook where both of us can add photos, save memories, check off our bucket list, and leave notes for each other anytime.",

  // Featured cover Polaroid in the hero section
  coverPhoto: {
    src: "photos/cover.jpg",
    caption: "Under the stars together",
    captionAr: "أحلى مكان في الدنيا هو مع بعض",
    date: "Mario & دودو",
    placeholderTone: "rose",
  },

  // Polaroid Photo Gallery
  galleryHeading: "Our Memories",
  gallerySubheadingAr: "ذكرياتنا سوا اللي بنحبها أوي",
  photos: [
    {
      id: "static_1",
      src: "photos/photo-1.jpg",
      date: "11 / 05 / 2026",
      caption: "Holding hands, our favorite feeling",
      captionAr: "مسكة الإيد دي بالدنيا كلها",
      story:
        "Warm lights, matching glasses, hands intertwined, and that cute wink. One of those nights we never want to forget.",
      storyAr: "أحلى سهرة وأحلى ضحكة.. لحظة من اللحظات اللي بتفضل في القلب على طول.",
      tape: "blush",
      tilt: -2.8,
      placeholderTone: "warm",
    },
    {
      id: "static_2",
      src: "photos/photo-2.jpg",
      date: "Us",
      caption: "The way we look together",
      captionAr: "أحلى نظرة وأحلى صورة لينا",
      story:
        "One of our absolute favorite mirror moments — effortless, smiling, and completely in our own little world.",
      storyAr: "كل ما بنشوف الصورة دي بنبتسم.. وجودنا سوا بيخلي كل حاجة أحلى.",
      tape: "cream",
      tilt: 2.3,
      placeholderTone: "sunset",
    },
    {
      id: "static_3",
      src: "photos/photo-3.jpg",
      date: "Matching Vibes",
      caption: "Twin outfits, same heart",
      captionAr: "أحلى كابل في الجيم وفي الدنيا كلها",
      story:
        "Black tops, grey sweats, white sneakers — we didn't even have to try and we still matched perfectly.",
      storyAr: "حتى في اللبس شبه بعض.. كل تفصيلة بنعملها سوا بتبقى مميزة.",
      tape: "sage",
      tilt: -1.9,
      placeholderTone: "peach",
    },
    {
      id: "static_4",
      src: "photos/photo-4.jpg",
      date: "Close-up",
      caption: "My prettiest girl",
      captionAr: "قمر من غير ما تحاولي حتى",
      story:
        "You never believe me when I tell you how gorgeous you are, even without trying — so I'm keeping this photo right here as permanent proof.",
      storyAr: "بجد أحلى وأقمر واحدة شافتها عيني حتى من غير ما تحاولي.. ربنا يخليكي ليا يا دودو.",
      tape: "cream",
      tilt: 2.9,
      placeholderTone: "honey",
    },
    {
      id: "static_5",
      src: "photos/photo-5.jpg",
      date: "Handwritten Note",
      caption: "Words we'll keep forever",
      captionAr: "أغلى ورقة عندنا في الدنيا",
      story:
        "A handwritten reminder of how much love, safety, and care we found in each other. Kept right here forever.",
      storyAr: "كلام من القلب للقلب.. هيفضل محفوظ هنا على طول.",
      tape: "blush",
      tilt: -2.4,
      placeholderTone: "lavender",
    },
    {
      id: "static_6",
      src: "photos/photo-6.jpg",
      date: "Our Chats",
      caption: "You really are my everything",
      captionAr: "إنتي فعلاً كل حاجة ليا",
      story:
        "The kind of late-night messages that make you smile at your phone screen and thank God for each other.",
      storyAr: "الله لا يحرمنا من بعض أبداً.. أحلى حاجة حصلت في حياتنا.",
      tape: "sage",
      tilt: 2.1,
      fit: "contain",
      darkBg: true,
      placeholderTone: "rose",
    },
    {
      id: "static_7",
      src: "photos/photo-7.jpg",
      date: "Sweetest Notification",
      caption: "“بحبك اكترر ماي سويت موووريي”",
      captionAr: "أحلى رسالة بتفرح القلب",
      story:
        "No matter how many times we say it, it still gives butterflies like the very first time.",
      storyAr: "كل يوم بنحب بعض أكتر من اليوم اللي قبله.",
      tape: "cream",
      tilt: -2.6,
      fit: "contain",
      darkBg: true,
      placeholderTone: "warm",
    },
    {
      id: "static_8",
      src: "photos/photo-8.jpg",
      date: "Always",
      caption: "“بحبك اوي يا روح قلبي”",
      captionAr: "يا روح قلبي وعقلي وكل حاجة",
      story:
        "Simple words, endless meaning. Kept right here as a permanent part of our story.",
      storyAr: "بحبك أوي يا روح قلبي.. النهاردة وبكرة وللأبد.",
      tape: "blush",
      tilt: 1.8,
      fit: "contain",
      darkBg: true,
      placeholderTone: "rose",
    },
  ],

  // Our Favorite Songs
  songsSection: {
    kicker: "02 / Our Soundtrack",
    title: "Our Favorite Songs",
    titleAr: "أغانينا اللي بنحبها سوا",
    hint: "Screenshots, lyrics, and the songs that always remind us of each other ♪",
    emptyText: "No songs pinned yet — tap \"+ Add a Song\" to save our first favorite track ♪",
    songs: [],
  },

  // Shared Couple Bucket List
  bucketSection: {
    kicker: "03 / Our Bucket List",
    title: "Things We Want to Do Together",
    titleAr: "حاجات عايزين نعملها سوا",
    hint: "Add new ideas anytime and check them off when we do them together ♥",
    placeholder: "Add a dream or date idea... (e.g. Sunset walk by the sea)",
    starterIdeas: [
      { id: "starter_1", text: "Late-night coffee & long drive with our favorite playlist", addedBy: "Mario", done: false },
      { id: "starter_2", text: "Watch the sunset by the sea together", addedBy: "دودو", done: false },
      { id: "starter_3", text: "Cook our favorite meal together at home", addedBy: "Mario", done: false },
      { id: "starter_4", text: "Take a spontaneous road trip & fill this site with photos", addedBy: "دودو", done: false },
    ],
  },

  // Shared Notes Wall
  notesSection: {
    kicker: "04 / Our Notes Wall",
    title: "Leave a Note Anytime",
    titleAr: "",
    hint: "Sweet messages, random thoughts, inside jokes, or little reminders ♥",
    placeholder: "Write something sweet in English or Arabic... اكتبوا أي حاجة هنا ♥",
    emptyText: "No notes pinned yet — be the first to leave one ♥",
  },

  // Saved Letter section
  letter: {
    eyebrow: "05 / Where It All Began",
    title: "A Note Kept Forever",
    titleAr: "كلام محفوظ من القلب",
    greeting: "To our story — Mario & دودو,",
    paragraphs: [
      {
        en: "Since 17/8/2026 — the very first day we started talking — life quietly became warmer, brighter, and fuller of laughter just because we found each other.",
        ar: "من يوم ١٧/٨/٢٠٢٦ وحياتنا اتغيرت للأحلى بوجودنا سوا.. بجد أحلى حاجة حصلتلنا.",
      },
      {
        en: "This little website is ours to grow together: every new photo, every silly selfie, every late-night note, and every dream we check off our bucket list.",
        ar: "المكان ده بتاعنا إحنا الاتنين.. هنملاه صور وذكريات وضحك وأيام حلوة ملهاش آخر.",
      },
      {
        en: "No matter how many days pass, may we always be each other's safe place, best friend, and favorite home.",
        ar: "يا رب نفضل دايماً سند وأمان لبعض، وكل سنة نرجع هنا نلاقي ذكريات أكتر وأحلى.. الله لا يحرمنا من بعض أبداً.",
      },
    ],
    closing: "Here's to a million more memories together.",
    closingAr: "مع بعض النهاردة وبكرة وللأبد",
  },

  // Interactive closing note
  ending: {
    buttonText: "Send a little love ♥",
    messages: [
      "بحبك اوي يا روح قلبي ❤️",
      "Mario & دودو — Since 17/8/2026 & forever",
      "You're my favorite home — أحلى مكان هو مع بعض",
      "الله لا يحرمنا من بعض أبداً ❤️",
      "To a million more memories together ✨",
    ],
  },
};
