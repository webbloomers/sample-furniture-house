# Oakline Furnishing: sample furniture website

A sample project by **webbloomers**: a fast, mobile-first catalogue website for a fictional furniture shop, built to show clients what we can deliver.

**Live site:** https://sample-furniture-house.netlify.app

> Oakline Furnishing is a fictional business. All names, prices, contact details and photos are sample content.

## What the site does

- **4 pages:** Home, Catalogue (with category filters), Product, and Contact
- **8 products** in 4 categories: bed, sofa, dining table, tv cabinet
- **Enquiry form** on the product flow, with validation and email delivery (Formspree)
- **Custom-order form** on the Contact page, with a spam-protection honeypot
- **WhatsApp button** that pre-fills the product name
- Product data comes from one file, `data/products.json`, which is generated from a Google Sheet
- Analytics (Google Analytics 4), sitemap, robots.txt and cache headers

## Tech stack

| Part | What we use |
|---|---|
| Site | Plain HTML, CSS and JavaScript (no framework, no build step) |
| Product data | Google Sheet, converted to `data/products.json` by a small Node script |
| Forms | Formspree |
| Hosting | Netlify (deploys automatically from the `main` branch) |
| Analytics | Google Analytics 4 |
| Local preview | `npx serve` |

## Project structure

```
sample-furniture-house/
├── index.html            Home page
├── products.html         Catalogue page (filters)
├── product.html          Product page (opened as product.html?slug=...)
├── contact.html          Contact page with the custom-order form
├── css/style.css         All styles
├── js/
│   ├── data.js           The only file that reads products.json
│   ├── main.js           Navbar and footer, shared on every page
│   ├── home.js           Home page: featured products
│   ├── catalogue.js      Catalogue cards and category filters
│   ├── product.js        Product page and image gallery
│   ├── enquiry.js        Enquiry form (validation, Formspree, WhatsApp)
│   ├── custom-order.js   Custom-order form
│   └── analytics.js      Google Analytics setup
├── data/
│   ├── products.csv      Exported from the Google Sheet
│   └── products.json     Generated from the CSV (do not edit by hand)
├── images/               Product photos
├── scripts/csv-to-json.mjs   Converts the CSV to JSON and checks it
├── _headers              Netlify cache settings
├── robots.txt
└── sitemap.xml
```

## Run it locally

You need [Node.js](https://nodejs.org) installed.

```bash
git clone https://github.com/webbloomers/sample-furniture-house.git
cd sample-furniture-house
npx serve
```

Open the `localhost` address that `npx serve` prints. **Always view the site through this address.** Opening the HTML files by double-clicking them does not work, because the browser blocks loading `products.json` from `file://`.

Note: `npx serve` removes the `.html` from addresses and can drop the `?slug=` part when you type `product.html?slug=...`. If a product page does not open the right product locally, type the address without `.html`, for example `localhost:3000/product?slug=oak-sofa-3-seater`.

## How to update the products

The Google Sheet is the source of truth. Never edit `data/products.json` by hand, because the next conversion overwrites it.

### 1. Edit the Google Sheet

Row 1 holds the column headings and must not change:

| Column | What goes in | Rule |
|---|---|---|
| `slug` | `oak-sofa-3-seater` | Lowercase letters, numbers and hyphens only. Must be unique. It becomes the product's web address. |
| `name` | Oakwood 3-Seater Sofa | Required |
| `category` | sofa | Dropdown: `bed`, `sofa`, `dining table`, `tv cabinet` |
| `price` | 42000 | Plain number, no ₹ and no commas |
| `material` | Sheesham wood, linen upholstery | Free text |
| `width`, `depth`, `height` | 210, 90, 85 | Numbers, in cm |
| `description` | One or two sentences | Free text |
| `images` | `oak-sofa-1.jpg\|oak-sofa-2.jpg\|oak-sofa-3.jpg` | File names separated by `\|`. Each file must exist in `images/`. |
| `featured` | tick the box | Ticked products appear in "Featured products" on the Home page |

### 2. Prepare the images

- Add the photos to the `images/` folder **before** running the script.
- Product page photos: **1200 × 800 px** (3:2 landscape), `.jpg`, under 150 KB.
- Name them `slug-1.jpg`, `slug-2.jpg`, `slug-3.jpg`, in lowercase, matching the slug in the Sheet exactly.
- 2 to 4 images per product. The first image is the one shown on the catalogue cards.
- Compress images with [squoosh.app](https://squoosh.app) or [tinypng.com](https://tinypng.com).

### 3. Export the Sheet and convert it

1. In the Sheet, choose **File → Download → Comma-separated values (.csv)**.
2. Rename the file to `products.csv` and put it in the `data/` folder, replacing the old one.
3. From the project's top-level folder, run:
   ```bash
   node scripts/csv-to-json.mjs
   ```
4. You should see `Wrote N products to data/products.json`. If you see `Fix these before converting:`, each line names the Sheet row and the problem. Fix the Sheet, export again, and rerun.

The script checks the slug format, duplicate slugs, the category list, numeric price and size, and that every image file exists.

### 4. Check it, then publish

1. Run `npx serve` and check the Catalogue and the new product pages.
2. Commit and publish with the workflow below.

Adding a new category means three changes: the dropdown in the Sheet, the `CATEGORIES` list at the top of `scripts/csv-to-json.mjs`, and the filter buttons on the Catalogue page.

## Team workflow (Git)

Nobody pushes directly to `main`. Every change goes through a branch and a pull request.

```bash
git checkout main
git pull origin main
git checkout -b your-initial-short-task    # for example s-catalogue-update
# ...make your changes...
git add <the files you changed>
git commit -m "Short description of what changed"
git push origin your-initial-short-task
```

Then open a **pull request** on GitHub and ask a teammate to review and merge it. Netlify redeploys the live site automatically after the merge, usually within a minute.

## Settings that live in the code

| What | Where |
|---|---|
| Formspree form address | `FORMSPREE_URL` at the top of `js/enquiry.js` and `js/custom-order.js` |
| WhatsApp number (country code, no `+`) | `WHATSAPP_NUMBER` at the top of `js/enquiry.js` |
| Google Analytics ID | `GA_ID` in `js/analytics.js` |
| Cache rules | `_headers` |

When reusing this project for a client, replace all of these with the client's own accounts and details.

## Testing and quality

- **Test pages:** `test-data.html`, `enquiry-test.html` and `custom-order-test.html` are for development only. Remove them before handing a site to a client (they are also excluded from search engines in `robots.txt`).
- **Lighthouse (mobile, live site):** Accessibility and Best Practices are in the green on every page. Performance is mainly limited by photo weight, so keep images small.
- **Forms:** after changing a form, send a test enquiry on the live site and confirm the email arrives.

## Credits

Built by the webbloomers team: frontend, backend and content/marketing.