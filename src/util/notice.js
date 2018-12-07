const popup = {
  error (message, vm, timeout = 1000) {
    vm.$message({
      message: message,
      type: 'error',
      duration: timeout
    })
  },
  success (message, vm, timeout = 1000) {
    vm.$message({
      message: message,
      type: 'success',
      duration: timeout
    })
  }
}

export default popup
