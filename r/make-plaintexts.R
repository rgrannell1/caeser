#!/usr/bin/Rscript

require(rjson)
require(devtools)

install_github('rgrannell1/kiwi', ref = 'v0.30.0')

require(kiwi)

OUTDIR <- '/home/ryan/Code/caeser.js/data/plain-texts.json'







message('downloading war and peace...')

book_con <- url('http://www.gutenberg.org/cache/epub/2600/pg2600.txt')
	war_and_peace <- readLines(book_con)
	Encoding(war_and_peace) <- 'latin1'
close(book_con)









message('sanitising war and peace...')

war_and_peace <- iconv(war_and_peace, "latin1", "ASCII", sub="")









# a good approximation for real messages.
sentences <- x_(war_and_peace) $ xFromLines() $ x_Explode('[.]')


message('writing json...')

xWrite(OUTDIR, toJSON(sentences))
