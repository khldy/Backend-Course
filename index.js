const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
const { strict } = require('assert');

//////////////////////////////////
// FILES

// Read JSON data
const data = fs.readFileSync(`starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Read HTML templates
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);

//////////////////////////////////
// SERVER

const slugs = dataObj.map((el) => ({
  ...el,
  slug: slugify(el.productName, {
    lower: true,
    strict: true,
  }),
}));
console.log(slugs);

// const toSlug (str) => slugify(str, { lower: true, strict: true });
// const upadtedData = dataObj.map(el => {
//   return {
//     ...el,
//     id: toSlug(el.productName)
//   };
// });

console.log(slugify('Fresh Avocadoes', { lowerCase: true })); // fresh-avocadoes

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%', cardsHTML);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const product = dataObj[query.id]; // Replace with dynamic product data based on the request
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
