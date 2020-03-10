var app = new Vue({
  el: '#app',
  data () {
    return {
      message: 'Hello!',
      alphabet: ' ntesiroahdjglpufywqbkvmcxz1234567890\'\",.!?:;/@$%&#*()_~+-={}|^<>`[]\\ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
  },
  computed: {
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
