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





const advantage = function (iters, oracles) {

	var cypherTexts = []
	var whichUsed   = []

	const emitters = [
		{which: true,  emit: yieldCypherText},
		{which: false, emit: yieldRandomCypherText}
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

	var out = {}
	percentCorrect.forEach(function (result) {
		out[result[0]] = result[1]
	})

	return out
}




const oracles = {
	optimist: function (cypherTexts) {
		return cypherTexts.map(function (_) {return true})
	},
	pessamist: function (cypherTexts) {
		return cypherTexts.map(function (_) {return false})
	},

	naive: function (cypherTexts) {
		/*
			just guesses randomly expected value of 1/2, plus or minus some noise.
		*/

		return cypherTexts.map(function (text) {
			return Math.random() >= 0.5
		})

	},

	characterEntropy: ( function () {
		/*
			get the shannon entropy of the cypher-texts;

			there should be uniform character distribution in
			the random plaintexts, but not the meaningful plaintexts.

			Use genetic algorithm to find ideal upper and lower bounds on entropy.
		*/

		const repeat = function (num, val) {
			var out = []
			for (var ith = 0; ith < num; ith++) {
				out.push(val)
			}
			return out
		}

		const mutate = function(ith) {
			return function (pair) {
				// slowly decreases with ith.
				const factor = 15 * (ith / Math.pow(ith, 1.25))
				return [pair[0] + Math.random() / 15, pair[1] + Math.random() / 15]
			}
		}

		const makeAdversary = function (pair) {
			return function (cypherTexts) {

				return cypherTexts.map(function (text) {
					const entropy = shannonEntropy(freqOf(text))
					return pair[0] > entropy && entropy < pair[1]
				})
			}
		}

		var best    = [0.5, 1.5]

		// maintain previous best approximations, to help factor out random error.

		var allBest = [best]

		for (var ith = 0; ith < 50; ith++) {

			allBest  = allBest.concat([best])

			if (ith === 29) {
				var population = allBest
			} else {
				var population =
					repeat(30, best)
					.map(mutate(ith))
					.concat([best])
			}

			var adversaries   = population.map(makeAdversary)
			var advantages    = advantage(600, adversaries)

			var bestAdvantage =
				Object.keys(advantages)
				.reduce(function (acc, current) {
					return advantages[current] > acc[1]?
						[current, advantages[current]]:
						acc
				}, ['will be dropped', -Infinity])

			var best = population[bestAdvantage[0]]
			console.log(bestAdvantage[1])
		}

		console.log('optimal solution was ' + JSON.stringify(best))
		return makeAdversary(best)

	} )()

}





console.log(advantage(10000, oracles))
