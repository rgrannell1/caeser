#!/usr/bin/env node

const ascii                 = require('./data/ascii')

const freqOf                = require('./js/flotsam').freqOf
const log2                  = require('./js/flotsam').log2

const yieldPlainText        = require('./js/flotsam').yieldPlainText
const yieldRandomText       = require('./js/flotsam').yieldRandomText
const yieldCypherText       = require('./js/flotsam').yieldCypherText
const yieldRandomCypherText = require('./js/flotsam').yieldRandomCypherText

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




















const decryptCipher = function (yieldCypherText, iters) {

	const chooseImage = function (iters) {

		var cypherTexts = []

		for (var ith = 0; ith < iters; ith++) {
			cypherTexts.push(yieldCypherText)
		}

		const cypherFreqs = ascii
			.split('')
			.map(function (toTabulate) {

				const count = cypherTexts
					.join('')
					.split('')
					.filter(function (char) {
						return char === toTabulate
					})
					.length

				return[toTabulate, count]
			})

		return cypherFreqs.
			reduce(function (acc, current) {
				return current[1] > acc[1]?
					current:
					acc
			}, ['', -Infinity])
	}

	const getShift = function (image) {

		const preimage = Object.keys(asciiFreqs)
			.reduce(function (acc, current) {
				return asciiFreqs[current] > acc[1]?
					[current, asciiFreqs[current]]:
					acc
			}, ['', -Infinity])[0]

		const ith = ascii.indexOf(preimage)
		const jth = ascii.indexOf(image[0])

		return ith - jth
	}

	return getShift(chooseImage(iters))
}






const E = function (shift) {
	return yieldCypherText(shift)
}

const D = function (cypherText) {

	return asciiDecrypt(
		cypherText,
		console.log(decryptCipher(E, 100))
	)
}

const crack = function (shift) {
	return D(E(shift))
}


crack(100)