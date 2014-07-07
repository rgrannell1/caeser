
const fs = require('fs')

const caeserEncrypt = require('./caeser').caeserEncrypt
const caeserDecrypt = require('./caeser').caeserDecrypt
const asciiEncrypt  = require('./caeser').asciiEncrypt
const asciiDecrypt  = require('./caeser').asciiDecrypt





const freqOf = function (str) {

	if (toString.call(str) === '[object String]') {
		str = str.split('')
	}

	const counts = ascii
		.split('')
		.map(function (toTabulate) {
			return str
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






const plainTexts = JSON
	.parse(
		fs.readFileSync('./data/plain-texts.json', {
			encoding: 'ascii'
		})
	)

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

const yieldCypherText = function (shift) {
	return asciiEncrypt(yieldPlainText(), shift)
}

const yieldRandomCypherText = function (shift) {
	return asciiEncrypt(yieldRandomText(), shift)
}






module.exports = {
	freqOf                : freqOf,
	log2                  : log2,
	yieldPlainText        : yieldPlainText,
	yieldRandomText       : yieldRandomText,
	yieldCypherText       : yieldCypherText,
	yieldRandomCypherText : yieldRandomCypherText
}