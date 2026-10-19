# Tino Kekez: portfolio i životopis

Statična dvojezična stranica (HR na `/`, EN na `/en/`) koja se generira iz jedne datoteke s podacima, plus mala serverska funkcija za kontakt obrazac. Bez frameworka i bez ovisnosti.

## Struktura

```
content/profile.mjs      SAV sadržaj: ime, iskustvo, volontiranje, vještine, projekti… (HR i EN)
src/site/                izgled stranice (Cetina): home.mjs, project.mjs, layout.mjs, style.css; cv.mjs je CV za ispis
src/shared/              tekstovi sučelja, <head>, obrazac, 404, site.js
api/contact.js           Vercel funkcija za kontakt obrazac (POST /api/contact)
lib/contact.mjs          provjera unosa, zaštita od spama, slanje e-pošte (Resend)
public/                  datoteke koje se kopiraju kakve jesu: cv.pdf, fontovi, slike, igra Arthur
scripts/build.mjs        generira dist/
scripts/dev.mjs          lokalni server sa stranicom i API-jem
scripts/cv.mjs           ispisuje CV u PDF (npm run cv)
tests/                   testovi za kontakt API i za izgrađenu stranicu (linkovi, alt tekstovi, SEO podaci)
```

Stranice: naslovna (`/`, `/en/`), po jedna stranica za svaki projekt (`/projekti/<id>/`, `/en/projekti/<id>/`) i igra Arthur (`/projekti/arthur/igra/`).

## Naredbe

```
npm run dev     # izgradi i pokreni na http://localhost:3000
npm run build   # samo izgradi u dist/
npm test        # izgradi stranicu i pokreni sve testove
npm run cv      # napravi public/cv.pdf i public/cv-en.pdf iz content/profile.mjs
```

Treba samo Node.js 20 ili noviji, nema `npm install`.

## Promjena sadržaja

Uredi `content/profile.mjs`. Polja s `{ hr, en }` imaju obje verzije. Prazno polje (npr. `phone: ""`) ili prazna lista (npr. `testimonials: []`) sakriva taj dio stranice.

- **Fotografija:** stavi sliku u `public/img/` i upiši put u `photo` (npr. `"img/tino.webp"`).
- **GitHub / LinkedIn:** u `socials` (GitHub je upisan, LinkedIn odkomentiraj kad ga imaš). Linkovi se pojavljuju u kontaktu i u podacima za tražilice (`sameAs`).
- **Novi projekt:** dodaj objekt u `projects`; build mu sam napravi stranicu na `/projekti/<id>/`. Za sliku napravi dvije WebP verzije, `ime-640.webp` i `ime-1200.webp`, i upiši `image.src: "img/ime"`. `description` je opis za tražilice (140 do 160 znakova; bez njega se koristi `summary`), a `shareImage` slika za dijeljenje linka (1200 × 630, u `public/img/share/`; bez nje se koristi tvoja glavna).
- **CV:** radi se iz istih podataka kao stranica. Nakon izmjene `content/profile.mjs` pokreni `npm run cv`, pa commitaj `public/cv.pdf` (HR) i `public/cv-en.pdf` (EN). Za ispis treba Playwright (`npm i -g playwright`, pa `npx playwright install chromium`); bez njega skripta napravi samo `cv-print/cv-hr.html` i `cv-print/cv-en.html`, koje otvoriš u Chromeu i spremiš kao PDF (Ispis → Spremi kao PDF, A4, uključi pozadinske grafike).
- **Slika za dijeljenje linka:** `public/img/share/tino-kekez-hr.jpg` i `-en.jpg` (1200 × 630). Ako promijeniš glavnu rečenicu, napravi nove slike s istim tekstom.
- **Google Search Console:** dodaj svojstvo „Prefiks URL-a” za `https://tinokekez.vercel.app/`, odaberi potvrdu HTML oznakom i upiši samo vrijednost iz `content="..."` u `googleVerification`. Bing Webmaster Tools može svojstvo uvesti izravno iz Search Consolea.

## Kontakt obrazac (backend)

`POST /api/contact` prima JSON (iz JavaScripta) ili običan obrazac (kad JavaScript ne radi, odgovara kratkom HTML stranicom). Provjerava polja, ima skriveno polje i minimalno vrijeme ispunjavanja protiv botova te ograničenje od 5 poruka u 10 minuta po IP adresi.

Da bi poruke stvarno stizale na e-poštu, u Vercelu (Project → Settings → Environment Variables) postavi:

| Varijabla | Vrijednost |
| --- | --- |
| `RESEND_API_KEY` | ključ s [resend.com](https://resend.com) (besplatni plan je dovoljan) |
| `CONTACT_TO_EMAIL` | adresa na koju stižu poruke (zadano: tinokekez23@gmail.com) |
| `CONTACT_FROM_EMAIL` | pošiljatelj s domene potvrđene u Resendu; bez nje se koristi Resendova testna adresa, koja dostavlja samo na e-poštu Resend računa |

Dok ključ nije postavljen, obrazac se uopće ne prikazuje, nego samo adresa e-pošte. Kad postaviš ključ, pokreni novi deploy (Vercel → Deployments → Redeploy) i obrazac se pojavi.

## Objava

Projekt je spreman za Vercel: `vercel.json` pokreće `npm run build`, objavljuje `dist/`, postavlja sigurnosna zaglavlja (CSP i ostala) i dugo keširanje fontova i skripti (imena skripti u `dist/assets/` sadrže hash sadržaja, pa se nova verzija uvijek učita). Funkcija u `api/` objavljuje se automatski. Build sam napravi i `favicon.svg`, `site.webmanifest`, `sitemap.xml`, `llms.txt` i `404.html`.

## Tražilice i AI alati

- `sitemap.xml`: sve stranice s HR, EN i `x-default` alternativama; `lastmod` je datum zadnjeg commita koji je mijenjao sadržaj (bez git povijesti se izostavlja).
- `public/robots.txt`: sve je dopušteno osim `/api/`. AI botovi su navedeni po imenu u dvije skupine: pretraga i dohvat na zahtjev (ChatGPT, Claude, Perplexity) te prikupljanje za treniranje modela (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended). Za zabranu treniranja promijeni `Allow: /` u `Disallow: /` u drugoj skupini; na Google pretragu to ne utječe.
- `llms.txt`: kratak sažetak za AI alate, generira se iz `content/profile.mjs`. Eksperiment bez dokazanog učinka. Stare adrese `/designs/…` preusmjeravaju na naslovnu.

GitHub Actions (`.github/workflows/test.yml`) pokreće `npm test` na svakom pull requestu i pushu na `main`.

## Claude skillovi

U `.claude/skills/` su instalirani skillovi za izradu weba (dizajn, UX, pristupačnost, SEO, brzina, testiranje, planiranje, objava na Vercel). Učitavaju se sami kad otvoriš projekt u Claude Codeu. Popis i izvori su u `skills-lock.json`; novi se dodaju naredbom `npx skills add <autor>/<repozitorij>`.
