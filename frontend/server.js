// import { serve } from "bun";
// import { readFile } from "fs/promises";
// import path from "path";
// import { stat } from "fs";

// const port = 4000;
// const publicDir = path.resolve("/usr/share/nginx/html");

// serve({
//   port,
//   async fetch(req) {
//     let url = new URL(req.url).pathname;

//     if (url === "/") url = "/index.html";

//     const filePath = path.join(publicDir, url);

//     try {
//       await new Promise((resolve, reject) => {
//         stat(filePath, (err, stats) => {
//           if (err || !stats.isFile()) reject('File not found');
//           else resolve();
//         });
//       });

//       const fileContent = await readFile(filePath);
//       return new Response(fileContent, {
//         headers: { "Content-Type": getContentType(filePath) }
//       });

//     } catch (err) {
//       console.error(`Error: ${err}`);
//       return new Response('Not Found', { status: 404 });
//     }
//   },
// });

// console.log(`🚀 Server running at http://localhost:${port}`);

// function getContentType(filePath) {
//   const ext = path.extname(filePath);
//   const contentTypes = {
//     ".html": "text/html",
//     ".js": "application/javascript",
//     ".css": "text/css",
//     ".json": "application/json",
//     ".png": "image/png",
//     ".jpg": "image/jpeg",
//     ".jpeg": "image/jpeg",
//     ".svg": "image/svg+xml",
//     ".ico": "image/x-icon",
//     ".woff": "font/woff",
//     ".woff2": "font/woff2",
//     ".ttf": "font/ttf",
//     ".otf": "font/otf"
//   };
//   return contentTypes[ext] || "application/octet-stream";
// }
