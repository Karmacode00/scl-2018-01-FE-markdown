#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
const mdLinks = require('./lib/md-links.js');
const [,, ...args] = process.argv;
const inputFile = args[0];
const absolute = path.resolve(inputFile);

mdLinks(absolute);