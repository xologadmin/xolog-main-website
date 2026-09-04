const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const failures = [];

function walk(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walk(target, extension);
    }
    return entry.name.endsWith(extension) ? [target] : [];
  });
}

function resolveLocalReference(sourceFile, reference) {
  const cleanReference = reference.split(/[?#]/)[0];
  if (!cleanReference || /^(?:[a-z]+:|\/\/|#)/i.test(reference)) {
    return null;
  }

  const decoded = decodeURIComponent(cleanReference);
  const target = decoded.startsWith("/")
    ? path.join(root, decoded.slice(1))
    : path.resolve(path.dirname(sourceFile), decoded);

  if (decoded.endsWith("/")) {
    return path.join(target, "index.html");
  }
  return target;
}

function checkReference(sourceFile, reference) {
  const target = resolveLocalReference(sourceFile, reference);
  if (target && !fs.existsSync(target)) {
    failures.push(`${path.relative(root, sourceFile)}: missing ${reference}`);
  }
}

const htmlFiles = walk(root, ".html");
const redirectPattern = /<meta[^>]+http-equiv=["']refresh["']/i;

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const isRedirect = redirectPattern.test(html);

  if (!isRedirect) {
    for (const marker of ["data-xolog-header", "data-xolog-footer", "/css/components.css", "/js/components.js"]) {
      if (!html.includes(marker)) {
        failures.push(`${path.relative(root, htmlFile)}: missing ${marker}`);
      }
    }
  }

  for (const match of html.matchAll(/\b(?:href|src|data-src)=["']([^"']+)["']/gi)) {
    checkReference(htmlFile, match[1]);
  }

  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(",")) {
      checkReference(htmlFile, candidate.trim().split(/\s+/)[0]);
    }
  }
}

const componentsJs = fs.readFileSync(path.join(root, "js", "components.js"), "utf8");
for (const match of componentsJs.matchAll(/href:\s*["']([^"']+)["']/g)) {
  checkReference(path.join(root, "index.html"), match[1]);
}

const logoSources = [...componentsJs.matchAll(/<img\s+src=["']([^"']+)["'][^>]*alt=["']XOLOG["']/g)].map((match) => match[1]);
if (logoSources.length !== 2 || logoSources.some((source) => source !== "/images/logo.png")) {
  failures.push("js/components.js: header and footer logos must use /images/logo.png");
}

const componentsCss = fs.readFileSync(path.join(root, "css", "components.css"), "utf8");
if (!/#footer-wrapper\s*{[^}]*background:\s*#fff\s*!important/s.test(componentsCss)
  || !/\.xolog-site-footer\s*{[^}]*background:\s*#fff\s*;/s.test(componentsCss)) {
  failures.push("css/components.css: footer does not enforce a white background");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, shared navigation routes, local assets, logos, and footer styling.`);