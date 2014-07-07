#!/usr/bin/env node

const ascii = require('./data/ascii')
const fs    = require('fs')






const letterFreqs = JSON
	.parse(
		fs.readFileSync('./data/letter-frequencies.json', {
			encoding: 'UTF-8'
		})
	)

const asciiKeys =
	Object.keys(letterFreqs)
	.filter(function (key) {
		const code = key.charCodeAt(key)
		return code >= 31 && code <= 128
	})

const asciiFreqs = ( function () {

	var self = {}

	asciiKeys.forEach(function (key) {
		self[key] = letterFreqs[key]
	})

	return self

} )()





const Oracle = {
	dumn: function (cypherText) {
		return Math.random() >= 0.5
	},
	distribution: function (cypherText) {

	}
}



console.log(asciiFreqs)