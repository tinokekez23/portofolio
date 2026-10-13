/* =========================================================================
   SAV OSOBNI SADRŽAJ STRANICE JE OVDJE (podaci iz CV-a, listopad 2026.).
   Tekst koji ima dvije verzije piše se kao { hr: "...", en: "..." }.
   Prazno polje ili prazna lista sakriva taj dio stranice.
   ========================================================================= */
window.PROFILE = {
  // true prikazuje traku "Demo sadržaj" na vrhu stranice.
  showPlaceholderNotice: false,

  name: "Tino Kekez",
  initials: "TK",
  role: { hr: "Student informatike · web developer u usponu", en: "Computer science student · aspiring web developer" },
  tagline: {
    hr: "Student treće godine informatike na PMF-u u Splitu. Učim izrađivati moderne web stranice i tražim priliku da znanje primijenim u IT sektoru.",
    en: "Third-year computer science student at the Faculty of Science in Split. I'm learning to build modern websites and looking for a chance to apply that in the IT sector."
  },
  study: { hr: "Informatika, PMF Split", en: "Computer Science, Split" },
  location: { hr: "Sinj / Split, Hrvatska", en: "Sinj / Split, Croatia" },
  availability: { hr: "Otvoren za studentske poslove i praksu", en: "Open to student jobs and internships" },
  available: true,
  email: "tinokekez23@gmail.com",
  phone: "",                                   // upiši broj ako ga želiš javno prikazati
  cvFile: "cv.pdf",
  socials: [
    // { label: "GitHub",   url: "https://github.com/tvoje-ime" },
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/tvoje-ime" }
  ],

  facts: [
    { value: "3.",  label: { hr: "godina studija informatike", en: "year of CS studies" } },
    { value: "B2",  label: { hr: "razina engleskog", en: "English level" } },
    { value: "B",   label: { hr: "vozačka dozvola", en: "driving licence" } }
  ],

  about: [
    {
      hr: "Student sam treće godine informatike na Prirodoslovno-matematičkom fakultetu u Splitu, motiviran za rad u IT sektoru. Trenutno učim web development: HTML, CSS i JavaScript, a ova stranica je moj prvi veliki projekt.",
      en: "I'm a third-year computer science student at the Faculty of Science in Split, motivated to work in the IT sector. I'm currently learning web development: HTML, CSS and JavaScript, and this site is my first big project."
    },
    {
      hr: "Iskustvo imam u timskom radu, volontiranju i logistici. Odgovoran sam i pouzdan, brzo učim i dobro se snalazim u dinamičnom okruženju. U slobodno vrijeme sviram gitaru, klavir i bubnjeve, treniram i planinarim.",
      en: "I have experience in teamwork, volunteering and logistics. I'm responsible and reliable, I learn quickly and work well in a fast-moving environment. In my free time I play guitar, piano and drums, train and go hiking."
    }
  ],
  values: [
    { title: { hr: "Timski rad", en: "Teamwork" },        text: { hr: "Iskustvo iz skladišta, sporta i volontiranja.", en: "Experience from warehouse work, sport and volunteering." } },
    { title: { hr: "Odgovornost", en: "Responsibility" }, text: { hr: "Pouzdan u poslu i u dogovorima.", en: "Reliable at work and with commitments." } },
    { title: { hr: "Učenje", en: "Learning" },            text: { hr: "Stalno učim nove tehnologije i alate.", en: "Always learning new technologies and tools." } }
  ],

  experience: [
    {
      role: { hr: "Dobrovoljni darivatelj krvi", en: "Voluntary blood donor" },
      company: { hr: "Hrvatski Crveni križ", en: "Croatian Red Cross" }, place: { hr: "Hrvatska", en: "Croatia" },
      start: "2024-12", end: null,
      points: [
        { hr: "Redovito dobrovoljno darivanje krvi.", en: "Regular voluntary blood donation." }
      ],
      tags: [{ hr: "Volontiranje", en: "Volunteering" }]
    },
    {
      role: { hr: "Skladišni radnik na sortiranju i otpremi robe", en: "Warehouse worker, sorting and dispatch" },
      company: "HNK Hajduk Split", place: { hr: "Split", en: "Split" },
      start: "2023-05", end: "2023-08",
      points: [
        { hr: "Prijem, skladištenje i izdavanje robe prema internim procedurama.", en: "Receiving, storing and issuing goods according to internal procedures." },
        { hr: "Utovar i istovar robe uz korištenje ručnih kolica i viljuškara.", en: "Loading and unloading goods using hand trucks and forklifts." },
        { hr: "Vođenje evidencije o stanju zaliha i inventaru skladišta.", en: "Keeping stock and warehouse inventory records." },
        { hr: "Održavanje reda i poštivanje mjera zaštite na radu.", en: "Keeping the warehouse tidy and following health and safety rules." }
      ],
      tags: [{ hr: "Logistika", en: "Logistics" }, { hr: "Evidencija zaliha", en: "Inventory" }, { hr: "Timski rad", en: "Teamwork" }]
    },
    {
      role: { hr: "Volonter (glazbene radionice)", en: "Volunteer (music workshops)" },
      company: { hr: "Centar za odgoj i obrazovanje „Juraj Bonači”", en: "Juraj Bonači Education Centre" }, place: { hr: "Sinj", en: "Sinj" },
      start: "2023-04", end: "2023-04",
      points: [
        { hr: "Pomoć u svakodnevnim aktivnostima i rad s djecom s posebnim potrebama, uz sviranje.", en: "Helped with daily activities and worked with children with special needs, through music." },
        { hr: "Razvijanje empatije i komunikacijskih vještina.", en: "Developed empathy and communication skills." }
      ],
      tags: [{ hr: "Volontiranje", en: "Volunteering" }, { hr: "Komunikacija", en: "Communication" }]
    }
  ],

  education: [
    {
      title: { hr: "Sveučilišni prijediplomski studij informatike", en: "BSc in Computer Science (in progress)" },
      school: { hr: "Prirodoslovno-matematički fakultet, Split", en: "Faculty of Science, University of Split" },
      start: "2024", end: { hr: "danas", en: "present" },
      note: { hr: "Razina 6 Hrvatskoga kvalifikacijskog okvira.", en: "EQF level 6." }
    },
    {
      title: { hr: "Komercijalist", en: "Commercial clerk (secondary vocational)" },
      school: { hr: "Srednja strukovna škola bana Josipa Jelačića, Sinj", en: "Ban Josip Jelačić Vocational School, Sinj" },
      start: "2019", end: "2024",
      note: { hr: "Razina 4 Hrvatskoga kvalifikacijskog okvira.", en: "EQF level 4." }
    }
  ],
  // Ovdje idu certifikati, dozvole i članstva
  certificates: [
    { title: { hr: "Vozačka dozvola B i AM", en: "Driving licence B and AM" }, issuer: { hr: "Republika Hrvatska", en: "Republic of Croatia" }, year: "" },
    { title: { hr: "MMA klub „BSK Pancration”", en: "BSK Pancration MMA club" }, issuer: { hr: "Aktivni član, Sinj", en: "Active member, Sinj" }, year: "2023 – 2024" },
    { title: { hr: "Kickboxing klub „Knez”", en: "Knez kickboxing club" }, issuer: { hr: "4 memorijalna turnira (point fighting, light contact)", en: "4 memorial tournaments (point fighting, light contact)" }, year: "2017 – 2023" }
  ],

  // level: 1–5 (vlastita procjena)
  skills: [
    { group: { hr: "Web (učim)", en: "Web (learning)" }, items: [["HTML", 2], ["CSS", 2], ["JavaScript", 1], ["Git i GitHub", 1]] },
    { group: { hr: "Informatika", en: "Computing" }, items: [["MS Office (Word, Excel, PowerPoint)", 5], [{ hr: "Osnove programiranja", en: "Programming basics" }, 2], [{ hr: "Baze podataka", en: "Databases" }, 2]] },
    { group: { hr: "Osobne vještine", en: "Soft skills" }, items: [[{ hr: "Timski rad", en: "Teamwork" }, 5], [{ hr: "Rješavanje problema", en: "Problem solving" }, 4], [{ hr: "Organizacija vremena", en: "Time management" }, 4], [{ hr: "Rad pod pritiskom", en: "Working under pressure" }, 4]] }
  ],
  // CEFR razine: A1, A2, B1, B2, C1, C2, ili "native"
  languages: [
    { name: { hr: "Hrvatski", en: "Croatian" }, level: "native" },
    { name: { hr: "Engleski", en: "English" },  level: "B2" }
  ],

  // category mora odgovarati jednom od ključeva u projectCategories
  projectCategories: {
    web:  { hr: "Web", en: "Web" },
    faks: { hr: "Fakultet", en: "University" }
  },
  projects: [
    {
      title: "Osobni portfolio", category: "web", year: "2026", hue: 222,
      summary: { hr: "Ova stranica: dvojezični portfolio i životopis sa svijetlom i tamnom temom.", en: "This site: a bilingual portfolio and CV with light and dark themes." },
      problem: { hr: "Trebala mi je profesionalna stranica koja pokazuje tko sam i što učim.", en: "I needed a professional site that shows who I am and what I'm learning." },
      solution: { hr: "Stranica od nule u HTML-u, CSS-u i JavaScriptu, prilagođena mobitelu, s HR/EN prijevodom.", en: "A site built from scratch in HTML, CSS and JavaScript, mobile-friendly, with HR/EN translation." },
      result: { hr: "Prvi završeni web projekt i temelj za buduće radove.", en: "My first finished web project and a base for future work." },
      stack: ["HTML", "CSS", "JavaScript"],
      links: []
    },
    {
      title: { hr: "Sljedeći projekt", en: "Next project" }, category: "faks", year: "2026", hue: 160,
      summary: { hr: "U izradi. Ovdje će doći moj sljedeći projekt s fakulteta ili vlastiti projekt.", en: "In progress. My next university or personal project will go here." },
      problem: { hr: "Uskoro.", en: "Coming soon." },
      solution: { hr: "Uskoro.", en: "Coming soon." },
      result: { hr: "Uskoro.", en: "Coming soon." },
      stack: ["JavaScript"],
      links: []
    }
  ],

  // Dodaj preporuke kad ih dobiješ (profesor, poslodavac). Prazna lista sakriva odjeljak.
  testimonials: []
};
