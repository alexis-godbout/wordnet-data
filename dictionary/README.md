# README

This project requires an exhaustive list of adjectives and nouns to produce quality results so we're using [Wordnet](https://wordnet.princeton.edu/) data. Considering that Wordnet is a fullblown lexical database, we're trimming what we don't need via [scripts.js](./script.js).

For reference, the Wordnet data structure is documented [here](https://wordnet.princeton.edu/documentation/wndb5wn).

## Development

1. Make sure that node.js is installed
2. Navigate to the wordnet folder
2. Install the dependencies

```bash
npm install
```

3. Make necessary adjustments

4. Use eslint to review the code

```bash
npx eslint ./script.js
```