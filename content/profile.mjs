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
  photo: "", // npr. "img/tino.webp" (stavi sliku u public/img), prazno = bez fotografije
  cvFile: "cv.pdf",
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

  experience: [
    {
      role: { hr: "Dobrovoljni darivatelj krvi", en: "Voluntary blood donor" },
      company: { hr: "Hrvatski Crveni križ", en: "Croatian Red Cross" },
      place: { hr: "Hrvatska", en: "Croatia" },
      start: "2024-12", end: null,
      points: [{ hr: "Redovito darujem krv.", en: "I donate blood regularly." }],
      tags: [{ hr: "Volontiranje", en: "Volunteering" }]
    },
    {
      role: { hr: "Skladišni radnik, sortiranje i otprema robe", en: "Warehouse worker, sorting and dispatch" },
      company: "HNK Hajduk Split",
      place: { hr: "Split", en: "Split" },
      start: "2023-05", end: "2023-08",
      points: [
        { hr: "Zaprimao, skladištio i izdavao robu prema internim procedurama.", en: "Received, stored and issued goods following internal procedures." },
        { hr: "Utovar i istovar ručnim kolicima i viljuškarom.", en: "Loaded and unloaded goods with hand trucks and a forklift." },
        { hr: "Vodio evidenciju zaliha i inventara skladišta.", en: "Kept stock and inventory records." },
        { hr: "Održavao red i poštivao pravila zaštite na radu.", en: "Kept the warehouse tidy and followed health and safety rules." }
      ],
      tags: [{ hr: "Logistika", en: "Logistics" }, { hr: "Evidencija zaliha", en: "Inventory" }, { hr: "Timski rad", en: "Teamwork" }]
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
      tags: [{ hr: "Volontiranje", en: "Volunteering" }, { hr: "Komunikacija", en: "Communication" }]
    }
  ],

  education: [
    {
      title: { hr: "Prijediplomski studij informatike", en: "BSc in Computer Science (in progress)" },
      school: { hr: "Prirodoslovno-matematički fakultet, Split", en: "Faculty of Science, University of Split" },
      start: "2024", end: null,
      note: { hr: "Treća godina.", en: "Third year." }
    },
    {
      title: { hr: "Komercijalist", en: "Commercial clerk (vocational)" },
      school: { hr: "Srednja strukovna škola bana Josipa Jelačića, Sinj", en: "Ban Josip Jelačić Vocational School, Sinj" },
      start: "2019", end: "2024",
      note: null
    }
  ],

  // Dozvole, sport i članstva
  certificates: [
    { title: { hr: "Vozačka dozvola B i AM", en: "Driving licence, categories B and AM" }, issuer: null, year: "" },
    { title: { hr: "Kickboxing klub „Knez”", en: "Knez kickboxing club" }, issuer: { hr: "Četiri memorijalna turnira (point fighting, light contact)", en: "Four memorial tournaments (point fighting, light contact)" }, year: "2017–2023" },
    { title: { hr: "MMA klub „BSK Pancration”", en: "BSK Pancration MMA club" }, issuer: { hr: "Aktivni član, Sinj", en: "Active member, Sinj" }, year: "2023–2024" }
  ],

  // Vještine bez ocjena: "now" = ono što trenutno učim i koristim, "solid" = ono u čemu sam siguran
  skills: [
    { group: { hr: "Učim i koristim", en: "Learning and using" }, items: ["HTML", "CSS", "JavaScript", "Git i GitHub"] },
    { group: { hr: "Sa studija", en: "From university" }, items: [{ hr: "Osnove programiranja", en: "Programming basics" }, { hr: "Baze podataka i SQL", en: "Databases and SQL" }] },
    { group: { hr: "Pouzdano znam", en: "Confident with" }, items: ["Word, Excel, PowerPoint", { hr: "Evidencija i logistika", en: "Records and logistics" }] },
    { group: { hr: "Kako radim", en: "How I work" }, items: [{ hr: "Timski rad", en: "Teamwork" }, { hr: "Rješavanje problema", en: "Problem solving" }, { hr: "Organizacija vremena", en: "Time management" }, { hr: "Rad pod pritiskom", en: "Working under pressure" }] }
  ],
  // CEFR razine: A1, A2, B1, B2, C1, C2 ili "native"
  languages: [
    { name: { hr: "Hrvatski", en: "Croatian" }, level: "native" },
    { name: { hr: "Engleski", en: "English" }, level: "B2" }
  ],

  // status: "done" ili "planned"
  projects: [
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
      id: "next",
      title: { hr: "Sljedeći projekt", en: "Next project" },
      year: "2026", status: "planned",
      summary: { hr: "Ovdje dolazi moj sljedeći projekt s fakulteta ili vlastiti projekt.", en: "My next university or personal project goes here." },
      stack: ["JavaScript"],
      links: []
    }
  ],

  // Preporuke (profesor, poslodavac). Prazna lista sakriva odjeljak.
  // { quote: { hr: "...", en: "..." }, name: "Ime Prezime", title: { hr: "Voditelj skladišta", en: "Warehouse manager" } }
  testimonials: []
};
