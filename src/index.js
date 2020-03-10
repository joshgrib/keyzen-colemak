const chars = 'ntesiroahdjglpufywqbkvmcxz'

const correctSound = new Audio('assets/click.wav')
const incorrectSound = new Audio('assets/clack.wav')
const levelUpSound = new Audio('assets/ding.wav')

// key for localStorage
const LS_KEY = 'keyzen-colemak-joshgrib'

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
      config: {
        peripheralCharLength: 6,
        streakToLevelUp: 20
      },
      state: {
        fullHistory: [],
        currentChar: undefined,
        futureChars: [],
        level: 9,
        streak: 0
      }
    }
  },
  computed: {
    charSetAsArray () {
      return Object.values(this.charSets).join('').split('').map(value => {
        return { value }
      })
    },
    alphabet () {
      return this.charSetAsArray.slice(0, this.state.level)
    },
    history () {
      return this.state.fullHistory.slice(1).slice(-this.config.peripheralCharLength)
    }
  },
  created () {
    document.addEventListener('keyup', this.handleKeypress);
    const persistedState = localStorage.getItem(LS_KEY)
    if (persistedState === null) {
      this.state.currentChar = this.alphabet[0]
      this.refreshFutureChars()
    } else {
      for(let [key, value] of Object.entries(JSON.parse(persistedState))) {
        this.state[key] = value
      }
    }
    
  },
  methods: {
    refreshFutureChars () {
      this.state.futureChars.length = 0
      for(let i=0; i<this.config.peripheralCharLength; i++) {
        this.state.futureChars.push(this.getRandomChar())
      }
    },
    getRandomChar () {
      return this.alphabet[Math.floor(Math.random() * this.alphabet.length)]
    },
    handleKeypress ({ key }) {
      // ignore any key that's not part of the alphabet
      // this is mainly to handle modifier keys
      if (!this.alphabet.some(c => c.value == key)) {
        return
      }
      const correct = key === this.state.currentChar.value
      this.state.fullHistory.push({correct, pressed: key, ...this.state.currentChar})
      this.state.streak = correct ? this.state.streak + 1 : 0
      this.state.currentChar = this.state.futureChars.shift()
      this.state.futureChars.push(this.getRandomChar())
      if (this.state.streak === this.config.streakToLevelUp) {
        this.state.streak = 0
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
      this.state.level += 1
    },
    setLevel (newLevel) {
      this.state.level = newLevel
      this.refreshFutureChars()
    },
    clearStorage () {
      localStorage.removeItem(LS_KEY)
      location.reload()
    }
  },
  watch: {
    'state.fullHistory': {
      handler (newValue) {
        const newElement = newValue[newValue.length-1]
        if (newElement.correct) {
          correctSound.play()
        } else {
          incorrectSound.play()
          this.flashBackground('red')
        }
      }
    },
    state: {
      deep: true,
      handler (newValue) {
        localStorage.setItem(LS_KEY, JSON.stringify(newValue))
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
