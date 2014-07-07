#!/usr/bin/env node

const ascii = require('./data/ascii')
const fs    = require('fs')

const letterFreqs = JSON.parse(
	fs.readFileSync('./data/letter-frequencies.json', {
		encoding: 'UTF-8'
	}))
