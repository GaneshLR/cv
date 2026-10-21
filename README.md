# Ganesh Rathod — portfolio

Personal portfolio site, live at **https://ganeshlr.github.io/cv/** (GitHub Pages, `main` branch).

Plain HTML, CSS and a small vanilla JavaScript file. No build step and no dependencies.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | All page content and metadata (title, description, social-share tags) |
| `css/main.css` | Design system: colour/type/spacing tokens at the top, then components and sections |
| `scripts/main.js` | Theme toggle, mobile menu, active-section nav, scroll reveal, contact form |
| `resume/Ganesh_Rathod_Technical_Delivery_Manager.pdf` | Leadership résumé (linked from the *Roles* section) |
| `resume/Ganesh_Rathod_Resume_SFMC.pdf` | Salesforce Marketing Cloud résumé (linked from the *Roles* section) |
| `images/ganeshrathod.png` | Portrait |
| `images/og-image.png` | 1200×630 preview image used when the link is shared |
| `favicon.svg`, `favicon.ico`, `images/favicon-32.png`, `images/apple-touch-icon.png` | Site icons |

## Editing

- **Text:** edit `index.html` directly.
- **Colours / fonts / spacing:** change the tokens in the `:root` block at the top of `css/main.css`
  (dark-mode colours are in the two blocks just below it).
- **Add a project:** copy an `<article class="project">` block in the *Selected work* section.
  To use a screenshot instead of the pattern cover, follow the comment above the project list.
- **Contact form:** posts to Formspree (`https://formspree.io/f/mdoyyave`).
- **Update a résumé:** replace the PDF in `resume/`, keeping the same file name so the links keep working.
- **When the SFMC certification is awarded:** search `index.html` for "in progress" and update the
  three mentions (Profile, Roles card, Recognition).

After changing CSS or JS, bump the `?v=` number on the `<link>` / `<script>` tags in `index.html`
so browsers fetch the new files.

## Preview locally

```bash
python -m http.server 8765
```

Then open http://localhost:8765.
