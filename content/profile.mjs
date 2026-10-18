/* Sav osobni sadržaj stranice je ovdje (podaci iz CV-a, listopad 2026.).
   Tekst s dvije verzije piše se kao { hr: "...", en: "..." }.
   Prazno polje ili prazna lista sakriva taj dio stranice.
   Nakon izmjene pokreni `npm run build` (Vercel to radi sam pri objavi). */

export default {
  name: "Tino Kekez",
  firstName: "Tino",
  initials: "TK",
  siteUrl: "https://tinokekez.vercel.app",

  // Glavna rečenica na vrhu stranice; ime se dodaje ispred nje
  headline: {
    hr: "studira informatiku u Splitu, uči web development i traži studentski posao ili praksu.",
    en: "studies computer science in Split, is learning web development and is looking for a student job or internship."
  },
  role: { hr: "Student informatike koji uči web development", en: "Computer science student learning web development" },
  // Kratki opis za tražilice i dijeljenje linka
  description: {
    hr: "Tino Kekez, student treće godine informatike na PMF-u u Splitu. Životopis, iskustvo, vještine i projekti.",
    en: "Tino Kekez, third-year computer science student in Split, Croatia. CV, experience, skills and projects."
  },
  tagline: {
    hr: "Student sam treće godine informatike na PMF-u u Splitu. Učim izrađivati web stranice i tražim studentski posao ili praksu u IT-u.",
    en: "I'm a third-year computer science student in Split. I'm learning to build websites and looking for a student job or internship in IT."
  },
  study: { hr: "Informatika, PMF Split", en: "Computer Science, University of Split" },
  location: { hr: "Sinj i Split, Hrvatska", en: "Sinj and Split, Croatia" },
  available: true,
  availability: { hr: "Slobodan za studentski posao i praksu", en: "Available for student work and internships" },
  email: "tinokekez23@gmail.com",
  phone: "", // upiši broj ako ga želiš javno prikazati
  photo: "img/tino.webp", // slika je u public/img, prazno = bez fotografije
  photoSmall: "img/tino-mali.webp", // izrez lica za kružić u zaglavlju
  cvFile: "cv.pdf",
  // Slika koja se prikaže kad netko podijeli link (WhatsApp, LinkedIn…), 1200 × 630
  shareImage: {
    src: { hr: "img/share/tino-kekez-hr.jpg", en: "img/share/tino-kekez-en.jpg" },
    width: 1200, height: 630
  },
  socials: [
    // { label: "GitHub", url: "https://github.com/tvoje-ime" },
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/tvoje-ime" }
  ],

  about: [
    {
      hr: "Student sam treće godine informatike na Prirodoslovno-matematičkom fakultetu u Splitu. Trenutno učim web development: HTML, CSS i JavaScript, a ova stranica je moj prvi veći projekt.",
      en: "I'm a third-year computer science student at the Faculty of Science in Split. I'm currently learning web development: HTML, CSS and JavaScript, and this site is my first bigger project."
    },
    {
      hr: "Radio sam u skladištu, volontirao i godinama trenirao borilačke sportove, pa znam raditi u timu, držati se dogovora i učiti brzo. U slobodno vrijeme sviram gitaru, klavir i bubnjeve te planinarim.",
      en: "I've worked in a warehouse, volunteered and trained combat sports for years, so I know how to work in a team, keep my word and learn fast. In my free time I play guitar, piano and drums, and go hiking."
    }
  ],

  aboutPhoto: {
    src: "img/gitara.webp",
    alt: { hr: "Tino svira gitaru i pjeva na nastupu s bendom", en: "Tino playing guitar and singing at a gig with the band" },
    caption: { hr: "Gitara i vokal na jednom od nastupa", en: "Guitar and vocals at one of our gigs" }
  },

  experience: [
    {
      role: { hr: "Skladišni radnik, sortiranje i otprema robe", en: "Warehouse worker, sorting and dispatch" },
      company: "HNK Hajduk Split",
      logo: { src: "img/hajduk.webp", alt: { hr: "Grb HNK Hajduk Split", en: "HNK Hajduk Split crest" } },
      place: { hr: "Split", en: "Split" },
      start: "2023-05", end: "2023-08",
      points: [
        { hr: "Zaprimao, skladištio i izdavao robu prema internim procedurama.", en: "Received, stored and issued goods following internal procedures." },
        { hr: "Utovar i istovar ručnim kolicima i viljuškarom.", en: "Loaded and unloaded goods with hand trucks and a forklift." },
        { hr: "Vodio evidenciju zaliha i inventara skladišta.", en: "Kept stock and inventory records." },
        { hr: "Održavao red i poštivao pravila zaštite na radu.", en: "Kept the warehouse tidy and followed health and safety rules." }
      ],
      tags: [{ hr: "Logistika", en: "Logistics" }, { hr: "Evidencija zaliha", en: "Inventory" }, { hr: "Timski rad", en: "Teamwork" }]
    }
  ],

  // Volontiranje: prikazuje se kao zaseban dio ispod radnog iskustva
  volunteering: [
    {
      role: { hr: "Dobrovoljni darivatelj krvi", en: "Voluntary blood donor" },
      company: { hr: "Hrvatski Crveni križ", en: "Croatian Red Cross" },
      place: { hr: "Hrvatska", en: "Croatia" },
      start: "2024-12", end: null,
      points: [{ hr: "Redovito darujem krv.", en: "I donate blood regularly." }],
      icon: { src: "img/darivanje-krvi.svg", alt: { hr: "Kap krvi", en: "A drop of blood" } }
    },
    {
      role: { hr: "Volonter na glazbenim radionicama", en: "Volunteer, music workshops" },
      company: { hr: "Centar za odgoj i obrazovanje „Juraj Bonači”", en: "Juraj Bonači Education Centre" },
      place: { hr: "Sinj", en: "Sinj" },
      start: "2023-04", end: "2023-04",
      points: [
        { hr: "Kroz sviranje radio s djecom s posebnim potrebama i pomagao u svakodnevnim aktivnostima.", en: "Worked with children with special needs through music and helped with daily activities." },
        { hr: "Naučio strpljivo i jasno komunicirati.", en: "Learned to communicate patiently and clearly." }
      ],
      icon: { src: "img/glazbene-radionice.svg", alt: { hr: "Glazbene note", en: "Music notes" } }
    }
  ],

  education: [
    {
      title: { hr: "Prijediplomski studij informatike", en: "BSc in Computer Science (in progress)" },
      school: { hr: "Prirodoslovno-matematički fakultet, Split", en: "Faculty of Science, University of Split" },
      start: "2024", end: null,
      note: { hr: "Treća godina.", en: "Third year." },
      icon: { src: "img/pmf.webp", alt: { hr: "Logo PMF-a Split", en: "Faculty of Science Split logo" }, logo: true }
    },
    {
      title: { hr: "Komercijalist", en: "Commercial clerk (vocational)" },
      school: { hr: "Srednja strukovna škola bana Josipa Jelačića, Sinj", en: "Ban Josip Jelačić Vocational School, Sinj" },
      start: "2019", end: "2024",
      note: null,
      icon: { src: "img/ss-jelacic.webp", alt: { hr: "Logo Srednje strukovne škole bana Josipa Jelačića", en: "Ban Josip Jelačić Vocational School logo" }, logo: true }
    }
  ],

  // Dozvole, sport i članstva
  certificates: [
    { title: { hr: "Vozačka dozvola B i AM", en: "Driving licence, categories B and AM" }, issuer: null, year: "" },
    { title: { hr: "Kickboxing klub „Knez”", en: "Knez kickboxing club" }, issuer: { hr: "Četiri memorijalna turnira (point fighting, light contact)", en: "Four memorial tournaments (point fighting, light contact)" }, year: "2017–2023", icon: { src: "img/kbk-knez.webp", alt: { hr: "Logo kickboxing kluba Knez", en: "Knez kickboxing club logo" }, logo: true } },
    { title: { hr: "MMA klub „BSK Pancration”", en: "BSK Pancration MMA club" }, issuer: { hr: "Aktivni član, Sinj", en: "Active member, Sinj" }, year: "2023–2024", icon: { src: "img/bsk-pancration.webp", alt: { hr: "Logo borilačkog kluba Pancration", en: "Pancration combat sports club logo" }, logo: true } }
  ],

  // Vještine po skupinama, bez ocjena
  skills: [
    { group: { hr: "Učim i koristim", en: "Learning and using" }, items: ["HTML", "CSS", "JavaScript", "Git i GitHub"] },
    { group: { hr: "Sa studija", en: "From university" }, items: [{ hr: "Osnove programiranja", en: "Programming basics" }, { hr: "Baze podataka i SQL", en: "Databases and SQL" }] },
    { group: { hr: "Pouzdano znam", en: "Confident with" }, items: ["Word, Excel, PowerPoint", { hr: "Evidencija i logistika", en: "Records and logistics" }] }
  ],
  // CEFR razine: A1, A2, B1, B2, C1, C2 ili "native"
  languages: [
    { name: { hr: "Hrvatski", en: "Croatian" }, level: "native" },
    { name: { hr: "Engleski", en: "English" }, level: "B2" }
  ],

  // status: "done" ili "planned"
  projects: [
    {
      id: "arthur",
      title: { hr: "Arthur protiv goblina", en: "Arthur vs. the Goblins" },
      year: "2026", status: "done",
      summary: {
        hr: "2D platformska igra iz kolegija Objektno orijentirano programiranje. Arthur skače po platformama, ruši gobline i traži izlaz kroz dva levela.",
        en: "A 2D platformer from my Object-Oriented Programming course. Arthur jumps across platforms, knocks out goblins and makes his way through two levels."
      },
      problem: {
        hr: "Zadatak je bio napraviti igru na gotovom okviru (Otter) i pritom pravilno koristiti klase i nasljeđivanje.",
        en: "The task was to build a game on a provided framework (Otter) and make proper use of classes and inheritance."
      },
      solution: {
        hr: "Napisao sam klasu Arthur, koja nasljeđuje Sprite, i klasu Goblin, koja nasljeđuje Item. Arthur ima kretanje, skok, udarac sa svojom zonom pogotka, živote i kratku neranjivost nakon što ga goblin pogodi. Goblini patroliraju između dviju točaka. Leveli su složeni u Tiled editoru.",
        en: "I wrote an Arthur class that extends Sprite and a Goblin class that extends Item. Arthur can walk, jump and strike with his own hit area, has lives and a short invulnerability window after a hit. Goblins patrol between two points. The levels were laid out in the Tiled editor."
      },
      result: {
        hr: "Igra s dva levela i tri života. Ako padneš u rupu ili izgubiš sve živote, level kreće ispočetka. Igra se na računalu: klikni Setup game pa START, strelicama se kreće i skače, a razmaknicom udara. Grafike su besplatne (CC0), od ansimuza i Kenneya.",
        en: "A game with two levels and three lives. Fall into a pit or lose every life and the level restarts. Play it on a computer: click Setup game, then START; arrow keys move and jump, space strikes. The art is free (CC0), by ansimuz and Kenney."
      },
      stack: ["JavaScript", "OOP", "Canvas", "Tiled"],
      video: {
        src: "img/arthur", poster: "img/arthur-800.webp", width: 800, height: 500,
        alt: { hr: "Snimka igre: Arthur skače na platformu, udarcem ruši dva goblina i dolazi do cilja", en: "Gameplay clip: Arthur jumps onto a platform, knocks out two goblins and reaches the goal" }
      },
      image: { src: "img/arthur", width: 1200, height: 750, alt: { hr: "Arthur na platformi u špilji, pored goblina", en: "Arthur on a cave platform next to a goblin" } },
      links: [{ label: { hr: "Igraj u pregledniku", en: "Play in the browser" }, url: "/projekti/arthur/igra/" }]
    },
    {
      id: "ednevnik",
      title: { hr: "eDnevnik, model baze podataka", en: "eDnevnik, a school gradebook database" },
      year: "2026", status: "done",
      summary: {
        hr: "Baza podataka za školski e-dnevnik iz kolegija Baze podataka: učenici, razredi, nastavnici, predmeti, ocjene i izostanci.",
        en: "A database for a school gradebook, from my Databases course: students, classes, teachers, subjects, grades and absences."
      },
      problem: {
        hr: "Trebalo je opisati kako škola vodi ocjene i izostanke tako da se isti podatak ne upisuje dvaput i da se u bazu ne može upisati nešto besmisleno.",
        en: "The goal was to model how a school keeps grades and absences so that nothing is stored twice and nothing nonsensical can be entered."
      },
      solution: {
        hr: "Model sam napravio u Oracle SQL Developer Data Modeleru. Tablica Nast_raz povezuje nastavnika, predmet i razred, pa svaka ocjena zna tko ju je dao i iz kojeg predmeta. Ograničenja paze na podatke: ocjena je od 1 do 5, OIB je jedinstven, a izostanak je opravdan ili nije (D/N).",
        en: "I built the model in Oracle SQL Developer Data Modeler. The Nast_raz table links a teacher, a subject and a class, so every grade knows who gave it and for which subject. Constraints keep the data clean: grades run from 1 to 5, the personal ID number (OIB) is unique, and an absence is either excused or not (Y/N)."
      },
      result: {
        hr: "Sedam tablica, osam stranih ključeva i SQL skripta za Oracle 11g sa sekvencama i okidačima koji sami dodjeljuju ID.",
        en: "Seven tables, eight foreign keys and an Oracle 11g SQL script with sequences and triggers that assign IDs automatically."
      },
      stack: ["SQL", "Oracle 11g", "SQL Developer Data Modeler"],
      image: { src: "img/ednevnik", width: 1200, height: 750, alt: { hr: "Dijagram baze eDnevnik: sedam tablica povezanih stranim ključevima", en: "eDnevnik database diagram: seven tables connected by foreign keys" } },
      links: [{ label: { hr: "SQL skripta", en: "SQL script" }, url: "/projekti/ednevnik.sql" }]
    },
    {
      id: "portfolio",
      title: { hr: "Osobni portfolio", en: "Personal portfolio" },
      year: "2026", status: "done",
      summary: { hr: "Dvojezična stranica sa životopisom i projektima. Ovo što upravo gledaš.", en: "A bilingual site with my CV and projects. The one you're looking at." },
      problem: { hr: "Trebala mi je stranica koju mogu poslati uz prijavu za posao, umjesto samo PDF-a.", en: "I needed a site I could send with job applications instead of just a PDF." },
      solution: { hr: "Prva verzija u čistom HTML-u, CSS-u i JavaScriptu. Druga verzija generira statične HR i EN stranice iz jedne datoteke s podacima i ima kontakt obrazac koji stvarno šalje e-poštu.", en: "The first version was plain HTML, CSS and JavaScript. The second generates static HR and EN pages from one data file and has a contact form that actually sends email." },
      result: { hr: "Brza stranica bez frameworka, prilagođena mobitelu i čitačima ekrana.", en: "A fast, framework-free site that works on phones and with screen readers." },
      stack: ["HTML", "CSS", "JavaScript", "Node.js", "Vercel"],
      image: { src: "img/portfolio-v1", width: 1200, height: 750, alt: { hr: "Prva verzija portfolija: tamna stranica s velikim imenom i podacima o studiju", en: "First version of the portfolio: a dark page with a large name and study details" } },
      links: []
    },
    {
      id: "daily-deals",
      title: { hr: "Daily deals, naslovnica web trgovine", en: "Daily deals, an online shop front page" },
      year: "2025", status: "done",
      summary: {
        hr: "Moj prvi rad u HTML-u i CSS-u: dio naslovnice web trgovine po uzoru na eBay, s ponudama, bannerom i podnožjem.",
        en: "My first HTML and CSS project: part of an online shop front page modelled on eBay, with deals, a banner and a footer."
      },
      problem: { hr: "Cilj je bio postojeći dizajn što vjernije prenijeti u HTML i CSS.", en: "The goal was to rebuild an existing design in HTML and CSS as closely as possible." },
      solution: { hr: "Proizvode sam složio flexboxom, dodao banner s pozadinskom slikom i gumbom te podnožje s četiri stupca linkova.", en: "I laid out the products with flexbox and added a banner with a background image and button, plus a four-column footer." },
      result: { hr: "Danas bih ga napisao drukčije, ali tu sam počeo i vidi se koliko sam od tada naučio.", en: "I'd write it differently today, but this is where I started, and it shows how much I've learned since." },
      stack: ["HTML", "CSS"],
      image: { src: "img/trgovina", width: 1200, height: 750, alt: { hr: "Stranica Daily deals: šest proizvoda s cijenama i popustima", en: "Daily deals page: six products with prices and discounts" } },
      links: []
    }
  ],

  // Preporuke (profesor, poslodavac). Prazna lista sakriva odjeljak.
  // { quote: { hr: "...", en: "..." }, name: "Ime Prezime", title: { hr: "Voditelj skladišta", en: "Warehouse manager" } }
  testimonials: []
};
