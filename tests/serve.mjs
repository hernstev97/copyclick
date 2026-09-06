// Production artifact server for browser checks; applies the configured hosting headers.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
};
createServer(async (request, response) => {
    try {
        const path = decodeURIComponent(
            new URL(request.url, 'http://localhost').pathname
        );
        const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
        if (!file.startsWith(root + sep)) {
            response.writeHead(403).end();
            return;
        }
        for (const header of config.headers[0].headers)
            response.setHeader(header.key, header.value);
        response.setHeader(
            'Content-Type',
            types[extname(file)] ?? 'application/octet-stream'
        );
        response.end(await readFile(file));
    } catch {
        response.writeHead(404).end('Not found');
    }
}).listen(5196, '127.0.0.1');
