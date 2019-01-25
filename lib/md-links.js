#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
const colors = require('colors');
const statusCode = require('url-status-code');
const [, , ...args] = process.argv;
const options = require('../index.js');

let currentDirectory = process.cwd();
let toString = Buffer.from(currentDirectory);
console.log(`Current working directory: ${process.cwd()}`.black.bgWhite);

const mdLinks = function fileReading(absolute) {
  fs.readdir(toString, (error, files) => {
    options.validate = process.argv[3];
    console.log('Ruta' + JSON.stringify(process.argv).cyan);
    if (path.extname(absolute) === '.md') {
      fs.readFile(absolute, 'utf8', (err, data) => {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          let line = data.split('\n').map((element, index) => linksExtractor(element, index + 1));
          if (line !== null) {
            let extractNumber = line.filter(element => element.length !== 0);
            let number = extractNumber.reduce((firstValue, secondValue) => firstValue.concat(secondValue), []);
            let promises = [];
            number.forEach(element => {
              if (options.validate === '--validate') {
                promises.push(fetch(`${element.href}`).then((response) => {
                  let link = element.href;
                  statusCode(link, (error, statusCode) => {  
                    if (error) {
                      return error;
                    } else {
                      console.log('Ruta:' + response.url.yellow, statusCode, response.statusText.cyan);
                    }
                  });
                }).catch((err) => {
                  console.error('No se ha encontrado ningún link ' + err);
                }));
              } else {
                console.log('Archivo:' + absolute.yellow + ':', element.line, 'Link:' + element.href.cyan, 'Texto:' + element.text.blue);
              };
            });
          };
        };
      });
    };
  });
};

linksExtractor = function markdownLinkExtractor(markdown, getLine) {
  const links = [];

  const renderer = new Marked.Renderer();

  // Taken from https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = (href, title, text, line) => {
    links.push({
      href: href,
      text: text,
      title: title,
      line: getLine
    });
  };
  renderer.image = (href, title, text, line) => {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      title: title,
      line: getLine
    });
  };
  Marked(markdown, { renderer: renderer });
  return links;
};

module.exports = mdLinks;
