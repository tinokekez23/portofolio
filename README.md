# Tino Kekez: portfolio i životopis

Statična dvojezična stranica (HR na `/`, EN na `/en/`) koja se generira iz jedne datoteke s podacima, plus mala serverska funkcija za kontakt obrazac. Bez frameworka i bez ovisnosti.

## Struktura

```
content/profile.mjs      SAV sadržaj: ime, iskustvo, vještine, projekti… (HR i EN)
site.config.mjs          koji je dizajn aktivan na / (sekvencer, otpremnica ili cetina)
src/designs/<dizajn>/    izgled svakog dizajna (page.mjs = HTML, style.css = stil)
src/shared/              zajednički dijelovi: tekstovi sučelja, <head>, obrazac, site.js
api/contact.js           Vercel funkcija za kontakt obrazac (POST /api/contact)
lib/contact.mjs          provjera unosa, zaštita od spama, slanje e-pošte (Resend)
public/                  datoteke koje se kopiraju kakve jesu: cv.pdf, fontovi, slike
scripts/build.mjs        generira dist/
scripts/dev.mjs          lokalni server sa stranicom i API-jem
tests/                   testovi za kontakt API
```

## Naredbe

```
npm run dev     # izgradi i pokreni na http://localhost:3000
npm run build   # samo izgradi u dist/
npm test        # testovi kontakt API-ja
```

Treba samo Node.js 20 ili noviji, nema `npm install`.

## Promjena sadržaja

Uredi `content/profile.mjs`. Polja s `{ hr, en }` imaju obje verzije. Prazno polje (npr. `phone: ""`) ili prazna lista (npr. `testimonials: []`) sakriva taj dio stranice.

- **Fotografija:** stavi sliku u `public/img/` i upiši put u `photo` (npr. `"img/tino.webp"`).
- **GitHub / LinkedIn:** odkomentiraj retke u `socials`.
- **Novi projekt:** dodaj objekt u `projects`. Za sliku napravi dvije WebP verzije, `ime-640.webp` i `ime-1200.webp`, i upiši `image.src: "img/ime"`.
- **CV:** zamijeni `public/cv.pdf`.

## Dizajni

Sva tri dizajna koriste isti sadržaj i mogu se pregledati na `/designs/`. Aktivni se bira u `site.config.mjs`.

| Dizajn | Ideja |
| --- | --- |
| `cetina` | Mirno i ozbiljno: jedno pismo, vapnenac i zelenilo Cetine, jedna jasna rečenica na vrhu. |
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

Projekt je spreman za Vercel: `vercel.json` pokreće `npm run build`, objavljuje `dist/`, postavlja sigurnosna zaglavlja (CSP i ostala) i dugo keširanje fontova. Funkcija u `api/` objavljuje se automatski.
