module.exports = {
  normalize: function(vec) {
    var len = this.length(vec);
    switch(vec.length) {
      case 2:
        return [
          vec[0]/len,
          vec[1]/len
        ]
      case 3:
        return [
          vec[0]/len,
          vec[1]/len,
          vec[2]/len
        ]
    }
  },

  length: function(vec) {
    switch(vec.length) {
      case 2:
        return Math.sqrt(
            vec[0] * vec[0] +
            vec[1] * vec[1]);
      case 3:
        return Math.sqrt(
            vec[0] * vec[0] +
            vec[1] * vec[1] +
            vec[2] * vec[2]);
    }
  }
}
