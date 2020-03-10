const chars = 'ntesiroahdjglpufywqbkvmcxz'

const correctSound = new Audio('assets/click.wav')
const incorrectSound = new Audio('assets/clack.wav')
const levelUpSound = new Audio('assets/ding.wav')

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
      peripheralCharLength: 6,
      level: 9,
      correctStreak: 0,
      streakToLevelUp: 20
    }
  },
  computed: {
    alphabet () {
      return Object.values(this.charSets).join('').split('').slice(0, this.level).map(value => {
        return { value }
      })
    },
    history () {
      return this.fullHistory.slice(1).slice(-this.peripheralCharLength)
    }
  },
  created () {
    document.addEventListener('keyup', this.handleKeypress);
    this.currentChar = this.alphabet[0]
    for(let i=0; i<this.peripheralCharLength; i++) {
      this.futureChars.push(this.getRandomChar())
    }
  },
  methods: {
    getRandomChar () {
      return this.alphabet[Math.floor(Math.random() * this.alphabet.length)]
    },
    handleKeypress ({ key }) {
      // ignore any key that's not part of the alphabet
      // this is mainly to handle modifier keys
      if (!this.alphabet.some(c => c.value == key)) {
        return
      }
      //TODO: play sound and flash background based on if the key is correct
      if (key === this.currentChar.value) {
        this.fullHistory.push({correct: true, pressed: key, ...this.currentChar})
        this.correctStreak += 1
      } else {
        this.fullHistory.push({correct: false, pressed: key, ...this.currentChar})
        this.correctStreak = 0
      }
      this.currentChar = this.futureChars.shift()
      this.futureChars.push(this.getRandomChar())
      if (this.correctStreak === this.streakToLevelUp) {
        this.correctStreak = 0
        this.levelUp()
      }
    },
    flashBackground (color) {
      this.$el.style.opacity = 0.4
      this.$el.style.backgroundColor = color
      setTimeout(() => {
        this.$el.style.backgroundColor = 'transparent'
        this.$el.style.opacity = 1
      }, 100)
    },
    levelUp () {
      levelUpSound.play()
      this.flashBackground('green')
      this.level += 1
    }
  },
  watch: {
    fullHistory (newValue) {
      const newElement = newValue[newValue.length-1]
      if (newElement.correct) {
        correctSound.play()
      } else {
        incorrectSound.play()
        this.flashBackground('red')
      }
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
