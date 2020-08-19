const sck = {}

sck.init = function () {
  if (state.socket) {
    console.log("socket already created")
    return
  }

  state.socket = true
  socket.on("connect", async () => {
    console.log("Connected")
  })
  socket.on("welcome", data => {
    console.log(data)
  })
  socket.on("confirmStatus", async status => {
    console.log("confirming status")
    console.log(status)
    if (status.status == "confirmed") {
      mainComp.$router.push({ name: "blockConfirmed", params: { mixedId: status.mixedId } })
    } else {
      mainComp.$router.push({ name: "blockRejected", params: { mixedId: status.mixedId } })
    }

  })


}

export default sck
