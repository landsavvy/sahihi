var port = 80
var production = 0
var hoster = "http://localhost:" + port
var socketHoster = "http://localhost:" + port
var peerHoster = "http://localhost:1201"
// var socketHoster = "http://192.168.43.170:" + port
if (production) {
  hoster = "https://api.nani.chat"
  socketHoster = "https://api.nani.chat"
}
var config = {
  peer: {
    title: {
      exists: peerHoster + "/api/v1/title/exists",
      search: peerHoster + "/api/v1/title/search",
      getTitle: peerHoster + "/api/v1/title/getTitle",
    },
    block: {
      search: peerHoster + "/api/v1/block/search",
      lastBlock: peerHoster + "/api/v1/block/lastBlock",
    },
    peer: {
      getAll: peerHoster + "/api/v1/peer/getAll",
    }
  },
  url: {
    user: {
      login: hoster + "/api/v1/user/login",
      signup: hoster + "/api/v1/user/signup"
    },
    witness: {
      add: hoster + "/api/v1/witness/add"
    },
    peer: {
      add: hoster + "/api/v1/peer/add",
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
