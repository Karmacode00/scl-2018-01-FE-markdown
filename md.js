#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
const colors = require('colors');
const linksMd = require('./lib/md-links.js');
const [, , ...args] = process.argv;
const options = require('./index.js');

// mdLinks.validateFile(args[0]);
// let currentDirectory = process.cwd();
// let cwdToString = Buffer.from(currentDirectory);
// console.log(`Current working directory: ${process.cwd()}`.magenta);

// Ruta actual del directorio (Current Working Directory)
const mdLinks = function fileReading(relativeToAbsolute) {
  fs.readdir(cwdToString, (error, files) => {
    options.validate = process.argv[3];
    console.log('Ruta' + JSON.stringify(process.argv).blue);


    //  Lee los contenidos del directorio
    // fs.readdir(cwdToString, (error, files) => {
    // Selecciona los archivos con extensión .md
    // files.forEach(relativeToAbsolute => {
    if (path.extname(relativeToAbsolute).toLowerCase() === '.md') {
      // Leer contenido del archivo
      fs.readFile(relativeToAbsolute, 'utf8', (err, data) => {
        if (error) {
          console.log(error);
        } else {
          let getLine = data.split('\n').map((element, index) => linksMd(element, index + 1));
          if (getLine !== null) {
            getLineNumber = getLine.filter(element => element.length !== 0);
            let lineNumber = getLineNumber.reduce((firstValue, secondValue) => firstValue.concat(secondValue), []);
            lineNumber.forEach(element => {
              if (options.validate === '--validate') {
                fetch(`${element.href}`).then((response) => {
                  console.log('Ruta:' + response.url.magenta, response.status, response.statusText.red);
                }).catch((err) => {
                  console.error('No se pudo encontrar ningún link' + error);
                });
              } else {
                console.log('Archivo:' + relativeToAbsolute.cyan, 'Link:' + element.href.green, 'Texto:' + element.text.blue, 'Línea:' + element.getLine);
              };
            });
          };
        };
      });
    };
  });
};

module.exports = mdLinks;