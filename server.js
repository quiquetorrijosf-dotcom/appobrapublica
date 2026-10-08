// Servidor estático sin dependencias (solo Node estándar). Uso: node server.js [puerto]
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = Number(process.argv[2] || process.env.PORT || 8000);
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(__dirname, urlPath === "/" ? "index.html" : urlPath.slice(1));
  if (!file.startsWith(__dirname)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.stat(file, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("No encontrado. ¿Existe index.html en esta carpeta?"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log(`ObraGest en http://localhost:${PORT}`));
