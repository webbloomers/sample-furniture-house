import fs from "node:fs";

const [, , input = "data/products.csv", output = "data/products.json"] = process.argv;
const CATEGORIES = ["bed", "sofa", "dining table", "tv cabinet"];
const MIN_IMAGES = 1; // raise to 2 once real photos are in

// Reads CSV properly, including commas and quotes inside fields
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      rows.push(row); row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

const text = fs.readFileSync(input, "utf8").replace(/^\uFEFF/, "");
const [header, ...allRows] = parseCSV(text);
// ignore empty rows at the end of the file
const rows = allRows.filter((r) => (r[0] ?? "").trim() || (r[1] ?? "").trim());
const cols = header.map((h) => h.trim());
const errors = [];
const seen = new Set();

const products = rows.map((r, i) => {
  const row = Object.fromEntries(cols.map((c, j) => [c, (r[j] ?? "").trim()]));
  const line = i + 2; // matches the row number in the sheet

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(row.slug))
    errors.push(`Row ${line}: bad slug "${row.slug}" (lowercase, hyphens only)`);
  if (seen.has(row.slug)) errors.push(`Row ${line}: duplicate slug "${row.slug}"`);
  seen.add(row.slug);

  if (!row.name) errors.push(`Row ${line}: name is empty`);
  if (!CATEGORIES.includes(row.category))
    errors.push(`Row ${line}: category "${row.category}" not in ${CATEGORIES.join(", ")}`);

  const price = Number(row.price);
  if (!(price > 0)) errors.push(`Row ${line}: price "${row.price}" must be a plain number`);

  const [width, depth, height] = [row.width, row.depth, row.height].map(Number);
  if (![width, depth, height].every((n) => n > 0))
    errors.push(`Row ${line}: width, depth and height must be numbers`);

  const images = row.images.split("|").map((s) => s.trim()).filter(Boolean);
  if (images.length < MIN_IMAGES || images.length > 4)
    errors.push(`Row ${line}: needs ${MIN_IMAGES} to 4 images, found ${images.length}`);
  for (const img of images)
    if (!fs.existsSync(`images/${img}`))
      errors.push(`Row ${line}: image not found: images/${img}`);

  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price,
    material: row.material,
    dimensions: { width, depth, height, unit: "cm" },
    description: row.description,
    images: images.map((img) => `images/${img}`),
    featured: row.featured.toLowerCase() === "true",
  };
});

if (errors.length) {
  console.error("Fix these before converting:\n" + errors.join("\n"));
  process.exit(1);
}

fs.writeFileSync(output, JSON.stringify(products, null, 2) + "\n");
console.log(`Wrote ${products.length} products to ${output}`);