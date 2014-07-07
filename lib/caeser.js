
const ascii = require('./ascii')






const toChars = function (str) {
	return str.split('')
}

const fromChars = function (str) {
	return str.join('')
}

const shiftChar = function (char, alphabet, shift) {

	const mod = function (num, modulus) {
		return ((num % modulus) + modulus) % modulus
	}

	return alphabet.charAt(
		mod(alphabet.indexOf(char) + shift, alphabet.length))
}

const caeserEncrypt = function (str, alphabet, shift) {
	return fromChars(
		toChars(str).
		map(function (char) {
			return shiftChar(char, alphabet, shift)
		})
	)
}

const caeserDecrypt = function (str, alphabet, shift) {
	return caeserEncrypt(str, alphabet, -shift)
}

const asciiEncrypt = function (str, shift) {
	return caeserEncrypt(str, ascii, shift)
}

const asciiDecrypt = function (str, shift) {
	return caeserDecrypt(str, ascii, shift)
}










module.exports = {
	caeserEncrypt: caeserEncrypt,
	caeserDecrypt: caeserDecrypt,

	asciiEncrypt : asciiEncrypt,
	asciiDecrypt : asciiDecrypt
}
