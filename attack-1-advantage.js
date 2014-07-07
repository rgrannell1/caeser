#!/usr/bin/env node

const ascii      = require('./data/ascii')

const fs    = require('fs')

const caeserEncrypt = require('./js/caeser').caeserEncrypt
const caeserDecrypt = require('./js/caeser').caeserDecrypt
const asciiEncrypt  = require('./js/caeser').asciiEncrypt
const asciiDecrypt  = require('./js/caeser').asciiDecrypt




const letterFreqs = JSON
	.parse(
		fs.readFileSync('./data/letter-frequencies.json', {
			encoding: 'UTF-8'
		})
	)

const plainTexts = JSON
	.parse(
		fs.readFileSync('./data/plain-texts.json', {
			encoding: 'ascii'
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









const yieldPlainText  = function () {
	return plainTexts[Math.floor(Math.random() * plainTexts.length)]
}

const yieldRandomText = function () {

	const len = yieldPlainText().length

	var out = ''
	for (var ith = 0; ith < len; ith++) {
		out += ascii[Math.floor(Math.random() * ascii.length)]
	}
	return out
}

const yieldCipherText = function (shift) {
	return asciiEncrypt(yieldPlainText(), shift)
}

const yieldRandomCipherText = function (shift) {
	return asciiEncrypt(yieldRandomText(), shift)
}




const oracles = {
	dumn: function (cypherText) {
		return Math.random() >= 0.5
	},
	distribution: function (cypherText) {

	}
}


console.log( yieldPlainText() )

const advantage = function (iterations, oracles) {

}

advantage(10000, oracles)
