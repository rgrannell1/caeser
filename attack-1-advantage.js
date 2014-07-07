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




const freqOf = function (str) {

	const counts = ascii
		.split('')
		.map(function (toTabulate) {
			return str
				.split('')
				.filter(function (char) {
					return char === toTabulate
				})
				.length
		})

	const total = counts.reduce(function (a, b) {return a + b})

	return counts.map(function (count) {
		return count / total
	})
}
const log2 = function (num) {
	return Math.log(num) / Math.LN10
}






const shannonEntropy = function (freqs) {
	return freqs
		.filter(function (freq) {
			return freq > 0
		})
		.map(function (freq) {
			return freq * log2(freq)
		})
		.reduce(function (a, b) {return a + b}, 0) * -1
}




const oracles = {
	optimist: function (cypherTexts) {
		return cypherTexts.map(function (_) {return true})
	},
	pessamist: function (cypherTexts) {
		return cypherTexts.map(function (_) {return false})
	},

	dumn: function (cypherTexts) {
		/*
			dumb just guesses randomly.
			expected value of 1/2
		*/

		return cypherTexts.map(function (text) {
			return Math.random() >= 0.5
		})

	},

	distribution: function (cypherTexts) {
		/*
			get the shannon entropy of the cypher-texts;

			there should be uniform character distribution in
			the random plaintexts, but not the meaningful plaintexts.

		*/

		return cypherTexts.map(function (text) {

			const entropy = shannonEntropy(freqOf(text))

			// rather arbitrary bounds.
			return entropy < 1.35 || entropy < 1.1
		})

	}
}




const advantage = function (iters, oracles) {

	var cypherTexts = []
	var whichUsed   = []

	const emitters = [
		{which: true,  emit: yieldCipherText},
		{which: false, emit: yieldRandomCipherText}
	]

	for (var ith = 0; ith < iters; ith++) {

		var shift = Math.floor(Math.random() * 1000)

		var emitter = emitters[Math.floor(Math.random() * emitters.length)]
		cypherTexts.push(emitter.emit(shift))

		whichUsed.push(emitter.which)
	}

	const percentCorrect = Object.keys(oracles)
		.map(function (key) {

			const guesses = oracles[key](cypherTexts)

			const score = Object.keys(guesses)
				.map(function (ith) {
					ith = parseInt(ith)
					return guesses[ith] === whichUsed[ith]? 1: 0
				})
				.reduce(function (a, b) {return a + b})

			return [key, (score / iters) * 100]
		})

	console.log(percentCorrect)
}






advantage(10000, oracles)
