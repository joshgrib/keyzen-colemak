const charSet = ' ntesiroahdjglpufywqbkvmcxz1234567890\'\",.!?:;/@$%&#*()_~+-={}|^<>`[]\\ABCDEFGHIJKLMNOPQRSTUVWXYZ';

var app = new Vue({
  el: '#app',
  computed: {
    alphabet () {
      return charSet.split('').map(value => {
        return {
          value
        }
      })
    },
    currentChars () {
      return this.alphabet.slice(0, 8)
    }
  },
  filters: {
    charDisplay (char) {
      const renameMap = {' ': '⎵'}
      return renameMap[char] || char
    }
  }
})
