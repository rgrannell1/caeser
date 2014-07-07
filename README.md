
Caeser
=================================================================

### Description

Caeser's Cypher is a simple single-letter substitution cypher. The cypher maps each letter in the domain alphabet A_i
onto a letter in a cyclically permuted codomain alphabet A_j, where i, j are indices of A. Since the codomain A_j is a
permutation of A_i the ordering of characters is cyclically preserved, and the frequency of each element a_i  will give
the frequency of the element a_j.

These properties make caeser's cypher very easy to detect and reverse.

### Breaking Cyphertext-indistinguishability

As mentioned above, a key weakness in single-letter substitution cyphers is that they map non-uniform character distributions
onto non-uniform character output distributions. This means that biases towards certain characters are reflected in the
cyphertexts of the caeser cypher. All spoken languages have biases towards certain letters; in English, vowels are common and
letters near the end of the alphabet are scarcely used.

One simple attack uses the Shannon Entropy of a cyphertext to capture the information content of a cyphertext, based on the
assumption that the information content of a random string will differ from that of an English sentence to be reliably detected.

```js
// attack-1-advantage.js

{ optimist: 50.07,
  pessamist: 49.93,
  dumn: 50.260000000000005,
  characterEntropy: 88
}
```

~30,000 plaintext matching sentences from War & Peace (a suitably large book) were encrypted with Caeser's cypher, as were a
roughly equal number of random ascii-strings. Using genetic algorithm to approximate what range of entropies a non-random
cyphertext holds, an attacker can break semantic security with roughly ~90% advantage. This failure alone is enough to make Caeser's
cypher insecure, but there are several others that are fun to exploit.


