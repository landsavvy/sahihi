import sck from "../socket/socket";

const local = {
  async initSocket() {
    const socket = io(socketHoster, {
      transports: ['websocket'],
    });
    window.socket = socket;
    sck.init();
    console.log("initialise socket")
  },
  async saveToken(token) {
    state.authToken = token
    axios.defaults.headers.common = {
      Authorization: `Bearer ${token}`
    }
    localStorage.setItem("authToken", token)
    console.log("init token", atob(state.authToken.split(".")[1]))
    state.user.id = JSON.parse(atob(state.authToken.split(".")[1]))._id
    state.user.username = JSON.parse(atob(state.authToken.split(".")[1])).username
  }
}
window.local = local
export default local
