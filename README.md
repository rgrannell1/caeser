
Caeser
=================================================================

### Description

Caeser's Cypher (CC) is a simple single-letter substitution cypher. The cypher maps each letter in the domain alphabet `A_i`
onto a letter in a cyclically permuted codomain alphabet `A_j`, where `i`, `j` are indices of `A`. Since the codomain `A_j` is a
cylic-permutation of `A_i`, the ordering of characters is cyclically preserved, and the frequency of each element `a_i`  will give
the frequency of the element `a_j`.

These properties make CC very easy to detect and reverse.

### Breaking Cyphertext-indistinguishability

As mentioned above, a key weakness in single-letter substitution cyphers is that they map non-uniform character distributions
onto non-uniform character output distributions. This means that biases towards certain characters are reflected in the
cyphertexts of the caeser cypher. All spoken languages have biases towards certain letters; in English, vowels are common and
letters near the end of the alphabet are scarcely used.

One simple attack uses the Shannon entropy of a cyphertext to capture the information content of a cyphertext, based on the
assumption that the information content of a random string will differ from that of an English sentence to be reliably detected.
In this way the cyphertext of an English sentence should be distinguisable from the cyphertext of a random string, which
violates Cyphertext-indistinguishability. [1]

```js
// attack-1-advantage.js

{ optimist: 50.07,
  pessamist: 49.93,
  dumn: 50.260000000000005,
  characterEntropy: 88
}
```

~30,000 plaintext matching sentences from War & Peace (a suitably large book) were encrypted with CC, as were a
roughly equal number of random ascii-strings. Using genetic algorithm to approximate what range of entropies a non-random
cyphertext holds, an attacker can break semantic security with roughly ~90% advantage. This failure alone is enough to make CC
insecure, but there are several others that are fun to exploit.

### Decrypting the Message

By finding the pre-image and image of any character in any plaintext/Cyphertext pair we can completely break CC; CC cyclically
permutes `A_i` to` A_j`, and for any cyclic permutation `a_i = a_(j+c)` implies `A_i = A_(j+c)`, and the shift `c` is `i-j`.
In other words, finding the mapping of a single character of our choice gives us the decryption key to the CC cypher.

If we have access to a large number of cyphertexts of English-language plain-texts we can again use the non-uniform distribution
of characters in CC cyphertexts to out advantage. Lowercase 'e' is the most common letter in English, so for

```js

```

[1] A less fun attack would be to compare the cyphertexts of the plaintexts {'a', 'aa', ...} to
those of {'ab', 'aba', ...}, which be easily detectable with 100% advantage.

