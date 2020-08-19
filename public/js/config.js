var port = 80
var production = 0
var hoster = "http://localhost:" + port
var socketHoster = "http://localhost:" + port
// var hoster = "http://192.168.43.170:" + port
// var socketHoster = "http://192.168.43.170:" + port
if (production) {
  hoster = "https://api.nani.chat"
  socketHoster = "https://api.nani.chat"
}
var config = {
  url: {
    user: {
      login: hoster + "/api/v1/user/login",
      signup: hoster + "/api/v1/user/signup"
    },
    witness: {
      add: hoster + "/api/v1/witness/add"
    },
    peer: {
      add: hoster + "/api/v1/peer/add"
    },
    owner: {
      add: hoster + "/api/v1/owner/add"
    },
    title: {
      add: hoster + "/api/v1/title/add"
    },
    block: {
      getConfirmedStatus: hoster + "/api/v1/block/getConfirmedStatus"
    },

  },
  premium: false,
  version: 20
}
