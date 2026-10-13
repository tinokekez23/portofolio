# Portfolio i CV stranica (demo)

Statična stranica bez build koraka: `index.html`, `styles.css`, `app.js`, `data.js`.

## Kako zamijeniti sadržaj
Sav osobni sadržaj (ime, uloga, kontakt, iskustvo, obrazovanje, vještine, jezici, projekti, preporuke) nalazi se u **`data.js`**. Vrijednosti označene s `// PLACEHOLDER` su primjeri.
Kad završiš, postavi `showPlaceholderNotice: false` da se sakrije traka "Demo sadržaj".
Ime i opis za tražilice promijeni i u `<head>` dijelu `index.html` (title, meta description, og:, JSON-LD).

## CV u PDF-u
Stavi svoj životopis kao `cv.pdf` u ovu mapu (ili promijeni `cvFile` u `data.js`). Ispis stranice (Ctrl+P) daje čisti jednostupčani CV.

## Mogućnosti
- Hrvatski / engleski (gumb HR/EN), svijetla i tamna tema, pamti izbor
- Responzivno (mobitel, tablet, desktop), izbornik za mobitel
- Filtriranje projekata i prozor s detaljima (problem, rješenje, rezultat)
- Kontakt obrazac s provjerom unosa (demo: ne šalje poruku; za stvarno slanje spoji npr. Formspree ili Netlify Forms)
- Pristupačnost: skip link, vidljiv fokus, ARIA oznake, poštuje "reduced motion"
- SEO: meta opisi, Open Graph, schema.org Person

## Pokretanje i objava
Otvori `index.html` u pregledniku. Za objavu kopiraj mapu na bilo koji statički hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
