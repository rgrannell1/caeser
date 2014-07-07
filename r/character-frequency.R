#!/usr/bin/Rscript

require(devtools)

install_github('rgrannell1/kiwi', ref = 'v0.30.0')
install_github("edwindj/docopt.R")

require(kiwi)
require(docopt)

'
usage: character-frequency.R <path>

options:
    <path> The path to output the character frequency json to.

' -> docs

opts <- docopt(docs)
print(opts)









asJSON <- freqs_ := {
	# a very limited json writing function.

	wrap <- (wrapper : str) := {
		xFromChars_(wrapper, str, wrapper)
	}

	freqs_ $
	xMap(pair := {
		xFromChars_('    ', wrap('"', xFirstOf(pair)), ': ',xSecondOf(paste(pair)) )
	}) $
	xReduce(xImplode_(',\n')) $
	x_Tap(body := {
		xFromChars_('{\n', body, '\n}\n')
	})
}





message('downloading war and peace...')

book_con <- url('http://www.gutenberg.org/cache/epub/2600/pg2600.txt')
	war_and_peace <- readLines(book_con)
close(book_con)









message('calculating the letter frequencies...')

letter_count_  <- x_(war_and_peace) $ xMap(xToChars()) $ xFlatten(1) $ xTabulate()
total_count    <- x_(letter_count_) $ xMap(xAt(2)) $ x_Reduce(`+`)

letter_frequency_ <- letter_count_ $ xMap(pair_ := {
	pair_ $ x_SecondAs(
		xSecondOf(pair) / total_count)
})




message('writing json...')
