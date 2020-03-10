# Modified `keyzen-colemak`

A fork I created to create a customized version, then I ended up fully rewriting it with Vue to make it easier to add new features

**[Use it here](https://joshgrib.github.io/keyzen-colemak/)**

The website is hosted from the `master` branch of this repo via [Github pages](https://pages.github.com/).

## Changes

### Completed

- [x] Reorder character to put symbols before capitals
- [x] Flash background red on errors and green on level up so you have feedback when the sound is off
- [x] Scrolling character tape instead of "word"s
- [x] Remake with Vue
    - [x] Alphabet progression display
    - [x] Past, current, and future character display
    - [x] Sound and light for feedback
    - [x] Level up and add more character to the alphabet
    - [x] Save state in `localStorage`
    - [x] Display full character set and allow skipping to levels

### Planned

- [ ] Add error counts for each character, maybe some charts
- [ ] Increase frequency of a letter if it has more errors than others

### Under consideration

- [ ] Add a way to store and choose from different "alphabets" to practice with
    - Maybe different orders of the characters, or to practice more on a subset
- [ ] Add a way to paste text (or ideally code with syntax highlighting) and practice with that
- [ ] Change to use an array of characters so you could put it entire words and practice with a set of words