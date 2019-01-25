const assert = require('chai').assert;
const index = require('../lib/md-links.js');
const absolute = path.resolve('README.md');

describe('deberia encontrar un archivo .md', () =>{
  assert.equal(absolute, 'README.md');// comprueba su nombre
});