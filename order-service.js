const http = require('http');
const url = require('url');

const menus = ['Nasi Goreng', 'Mie Goreng', 'Mie rebus ', 'Es Teh', 'Teh Tawar'];
const MISSING = 3;

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    let id = pathname.match(/^\/(\d+)$/);

    if (!id) {
        res.statusCode = 400;
        return void res.end();
    }

    id = Number(id[1]);

    if (id === MISSING) {
        res.statusCode = 404;
        return void res.end();
    }

    ressetHeader('Content-Type', 'application/json');

    res.end(JSON.stringify({
        id,
        menu: menus[id % menus.length],
    }));
});

server.listen(process.env.PORT || 0, () => {
    const { port } = serer.address();
    console.log(`Order service listening on ${port}`);
});