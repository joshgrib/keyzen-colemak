const chars = 'ntesiroahdjglpufywqbkvmcxz'

var app = new Vue({
  el: '#app',
  data () {
    return {
      charSets: {
        space: ' ',
        lowercase: chars,
        numbers: '0123456789',
        symbols: '\'\",.!?:;/@$%&#*()_~+-={}|^<>`[]\\',
        uppercase: chars.toUpperCase()
      },
      currentChar: undefined,
      fullHistory: [],
      futureChars: [],
      peripheralCharLength: 6
    }
  },
  computed: {
    alphabet () {
      return Object.values(this.charSets).join('').split('').map(value => {
        return { value }
      })
    },
    history () {
      return this.fullHistory.slice(1).slice(-this.peripheralCharLength)
    }
  },
  mounted () {
    document.addEventListener('keyup', this.handleKeypress);
    this.currentChar = this.alphabet[0]
    this.futureChars = this.alphabet.slice(0, this.peripheralCharLength)
  },
  methods: {
    handleKeypress ({ key }) {
      // ignore any key that's not part of the alphabet
      // this is mainly to handle modifier keys
      if (!this.alphabet.some(c => c.value == key)) {
        return
      }
      //TODO: play sound and flash background based on if the key is correct
      this.fullHistory.push({
        correct: key === this.currentChar.value,
        ...this.currentChar
      })
      this.currentChar = this.futureChars.shift()
      this.futureChars.push({
        value: this.alphabet[Math.floor(Math.random() * this.alphabet.length)]
      })
    }
  },
  filters: {
    charDisplay (char) {
      if (typeof char === 'object' && char.value !== undefined) {
        char = char.value
      }
      const renameMap = {' ': '⎵'}
      return renameMap[char] || char
    }
  }
})
