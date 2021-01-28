#!/usr/bin/env node
var safe = require('json-stringify-safe')
var find = require('./find-rss')
process.stdin.pipe(find(safe)).pipe(process.stdout)
