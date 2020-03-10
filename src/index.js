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
        streakToLevelUp: 16
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
    },
    characterStats () {
      let stats = {}
      for(let { correct, pressed, value } of this.state.fullHistory) {
        if (stats[value] === undefined) {
          stats[value] = {
            value,
            total: 1,
            correct: correct ? 1 : 0
          }
        } else {
          stats[value].total += 1
          stats[value].correct += correct ? 1 : 0
        }
      }
      return stats;
    },
    highestErrorRateCharacters () {
      return Object.values(this.characterStats).sort((a, b) => {
        const aRate = a.correct / a.total
        const bRate = b.correct / b.total
        return aRate - bRate
      }).filter(c => c.total > c.correct)
    },
    overallAccuracy () {
      const total = this.state.fullHistory
      const correct = this.state.fullHistory.filter(h => h.correct === true)
      return correct.length / total.length
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
    getRandomArrayElement (arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    },
    getRandomChar () {
      const randomVal = Math.random()
      let char = undefined
      if (randomVal <= 0.2) {
        const currentChar = this.alphabet[this.state.level - 1]
        if (currentChar !== undefined) {
          return { value: currentChar.value }
        }
      }
      const missed = this.state.fullHistory.filter(char => char.correct === false)
      if (randomVal <= 0.5 && char !== undefined && missed.length > 0) {
        const randomMissed = this.getRandomArrayElement(missed)
        if (randomMissed !== undefined) {
          return { value: randomMissed.value }
        }
      }
      const randomChar = this.getRandomArrayElement(this.alphabet)
      return { value: randomChar.value }
    },
    handleKeypress ({ key }) {
      // ignore any key that's not part of the alphabet
      // this is mainly to handle modifier keys
      if (!this.charSetAsArray.some(c => c.value == key)) {
        return
      }
      const correct = key === this.state.currentChar.value
      if (!correct) {
        console.log({ key, currentChar: this.state.currentChar })
      }
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
    },
    percentDisplay (percent) {
      if (isNaN(percent)) return '-'
      return `${(percent * 100).toFixed(2)}%`
    }
  }
})
