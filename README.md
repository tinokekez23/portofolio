# Tino Kekez: portfolio i životopis

Statična dvojezična stranica (HR na `/`, EN na `/en/`) koja se generira iz jedne datoteke s podacima, plus mala serverska funkcija za kontakt obrazac. Bez frameworka i bez ovisnosti.

## Struktura

```
content/profile.mjs      SAV sadržaj: ime, iskustvo, vještine, projekti… (HR i EN)
site.config.mjs          koji je dizajn aktivan na / (noc, cetina, sekvencer ili otpremnica)
src/designs/<dizajn>/    izgled svakog dizajna (page.mjs = HTML, style.css = stil)
src/shared/              zajednički dijelovi: tekstovi sučelja, <head>, obrazac, 404, site.js
api/contact.js           Vercel funkcija za kontakt obrazac (POST /api/contact)
lib/contact.mjs          provjera unosa, zaštita od spama, slanje e-pošte (Resend)
public/                  datoteke koje se kopiraju kakve jesu: cv.pdf, fontovi, slike, igra Arthur
scripts/build.mjs        generira dist/
scripts/dev.mjs          lokalni server sa stranicom i API-jem
tests/                   testovi za kontakt API i za izgrađenu stranicu (linkovi, SEO podaci)
```

## Naredbe

```
npm run dev     # izgradi i pokreni na http://localhost:3000
npm run build   # samo izgradi u dist/
npm test        # izgradi stranicu i pokreni sve testove
```

Treba samo Node.js 20 ili noviji, nema `npm install`.

## Promjena sadržaja

Uredi `content/profile.mjs`. Polja s `{ hr, en }` imaju obje verzije. Prazno polje (npr. `phone: ""`) ili prazna lista (npr. `testimonials: []`) sakriva taj dio stranice.

- **Fotografija:** stavi sliku u `public/img/` i upiši put u `photo` (npr. `"img/tino.webp"`).
- **GitHub / LinkedIn:** odkomentiraj retke u `socials`.
- **Novi projekt:** dodaj objekt u `projects`. Za sliku napravi dvije WebP verzije, `ime-640.webp` i `ime-1200.webp`, i upiši `image.src: "img/ime"`.
- **CV:** zamijeni `public/cv.pdf`.
- **Slika za dijeljenje linka:** `public/img/share/tino-kekez-hr.jpg` i `-en.jpg` (1200 × 630). Ako promijeniš glavnu rečenicu, napravi nove slike s istim tekstom.

## Dizajni

Svi dizajni koriste isti sadržaj i mogu se pregledati na `/designs/`. Aktivni se bira u `site.config.mjs`.

| Dizajn | Ideja |
| --- | --- |
| `noc` | Prvi, tamni dizajn dotjeran: ista baza i jantarna boja, bez ukrasa koji odaju AI; svijetla i tamna tema s prekidačem. |
| `cetina` (aktivan) | Mirno i ozbiljno: jedno pismo, vapnenac i zelenilo Cetine, jedna jasna rečenica na vrhu. |
| `sekvencer` | Vrh stranice je pravi bubanj-stroj sa 16 koraka (Web Audio) u bojama klasičnih ritam-mašina. |
| `otpremnica` | Stranica kao otpremna naljepnica, s pravim Code 128 barkodom koji vodi na stranicu. |

## Kontakt obrazac (backend)

`POST /api/contact` prima JSON (iz JavaScripta) ili običan obrazac (kad JavaScript ne radi, odgovara kratkom HTML stranicom). Provjerava polja, ima skriveno polje i minimalno vrijeme ispunjavanja protiv botova te ograničenje od 5 poruka u 10 minuta po IP adresi.

Da bi poruke stvarno stizale na e-poštu, u Vercelu (Project → Settings → Environment Variables) postavi:

| Varijabla | Vrijednost |
| --- | --- |
| `RESEND_API_KEY` | ključ s [resend.com](https://resend.com) (besplatni plan je dovoljan) |
| `CONTACT_TO_EMAIL` | adresa na koju stižu poruke (zadano: tinokekez23@gmail.com) |
| `CONTACT_FROM_EMAIL` | pošiljatelj s domene potvrđene u Resendu; bez nje se koristi Resendova testna adresa, koja dostavlja samo na e-poštu Resend računa |

Dok ključ nije postavljen, obrazac ne pada: posjetitelju ponudi da poruku pošalje iz svog programa za e-poštu.

## Objava

Projekt je spreman za Vercel: `vercel.json` pokreće `npm run build`, objavljuje `dist/`, postavlja sigurnosna zaglavlja (CSP i ostala) i dugo keširanje fontova i skripti (imena skripti u `dist/assets/` sadrže hash sadržaja, pa se nova verzija uvijek učita). Funkcija u `api/` objavljuje se automatski. Build sam napravi i `favicon.svg`, `site.webmanifest`, `sitemap.xml` i `404.html` za aktivni dizajn.

GitHub Actions (`.github/workflows/test.yml`) pokreće `npm test` na svakom pull requestu i pushu na `main`.

## Claude skillovi

U `.claude/skills/` su instalirani skillovi za izradu weba (dizajn, UX, pristupačnost, SEO, brzina, testiranje, planiranje, objava na Vercel). Učitavaju se sami kad otvoriš projekt u Claude Codeu. Popis i izvori su u `skills-lock.json`; novi se dodaju naredbom `npx skills add <autor>/<repozitorij>`.
