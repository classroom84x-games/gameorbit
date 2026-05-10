const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require("fs");
const path = require("path");

const API_URL = "https://classroom84x.xyz/pull.json";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function run() {
  const res = await fetch(API_URL);
  const games = await res.json();

  // folders
  if (!fs.existsSync("game")) fs.mkdirSync("game");
  if (!fs.existsSync("category")) fs.mkdirSync("category");
  if (!fs.existsSync("data")) fs.mkdirSync("data");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  let indexCards = "";

  for (const game of games) {
    const slug = slugify(game.title);

    const filePath = `game/${slug}.html`;

    const html = `
<!DOCTYPE html>
<html>
<head>
<title>${game.title} - GameOrbit</title>
<meta name="description" content="Play ${game.title} free online in your browser. No downloads required.">
<meta name="robots" content="index, follow">
<style>
body{font-family:Arial;background:#0f1117;color:white;margin:0}
header{padding:15px;background:#151826;text-align:center}
.container{max-width:900px;margin:auto;padding:20px}
iframe{width:100%;height:500px;border:none;border-radius:10px}
a{color:#4da3ff}
</style>
</head>
<body>

<header>GameOrbit</header>

<div class="container">
<h1>${game.title}</h1>

<iframe src="${game.url}"></iframe>

<p>
Play ${game.title} instantly for free. No download required.
</p>

<h3>More Games</h3>
<a href="/">Back to Home</a>
</div>

</body>
</html>
`;

    fs.writeFileSync(filePath, html);

    sitemap += `<url><loc>https://your-site.github.io/${filePath}</loc></url>\n`;

    indexCards += `
<div onclick="location.href='${filePath}'">
  <h3>${game.title}</h3>
</div>`;
  }

  sitemap += "</urlset>";
  fs.writeFileSync("sitemap.xml", sitemap);

  // homepage
  const index = `
<!DOCTYPE html>
<html>
<head>
<title>GameOrbit</title>
<style>
body{font-family:Arial;background:#0f1117;color:white;margin:0}
header{padding:20px;text-align:center;background:#151826}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;padding:20px}
.grid div{background:#1b2030;padding:10px;border-radius:8px;cursor:pointer}
</style>
</head>
<body>

<header><h1>🎮 GameOrbit</h1></header>

<div class="grid">
${indexCards}
</div>

</body>
</html>
`;

  fs.writeFileSync("index.html", index);

  console.log("✅ Site generated successfully!");
}

run();