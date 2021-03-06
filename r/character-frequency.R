#!/usr/bin/Rscript

require(rjson)
require(devtools)

install_github('rgrannell1/kiwi', ref = 'v0.30.0')

require(kiwi)

OUTDIR <- '/home/ryan/Code/caeser.js/data/letter-frequencies.json'







message('downloading war and peace...')

book_con <- url('http://www.gutenberg.org/cache/epub/2600/pg2600.txt')
	war_and_peace <- readLines(book_con)
close(book_con)









message('calculating the letter frequencies...')

letter_count_  <- x_(war_and_peace) $ xMap(xToChars()) $ xFlatten(1) $ xTabulate()
total_count    <- x_(letter_count_) $ xMap(xAt(2)) $ x_Reduce(`+`)

letter_frequency <- letter_count_ $ xMap(pair_ := {
	pair_ $ x_SecondAs(
		xSecondOf(pair) / total_count)
}) $
x_ZipKeys()




message('writing json...')

xWrite(OUTDIR, toJSON(letter_frequency))
