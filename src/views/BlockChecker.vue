<template>
  <div class="home-page">
    <!-- search card -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Search for Block</h6>
      </div>
      <div class="card-body">
        <div class="input-group">
          <input
            type="text"
            class="form-control bg-light border-0 small"
            placeholder="Block Number"
            v-model="query"
            @keydown.enter="search"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div class="input-group-append">
            <button @click="search" class="btn btn-primary" type="button">
              <i class="fas fa-search fa-sm"></i>
            </button>
          </div>
        </div>
        <div v-for="error in errors" class="text-danger">{{ error }}</div>
      </div>
    </div>
    <!-- block card -->
    <div class="card shadow mb-4" v-if="block">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-success">Block Information</h6>
      </div>
      <div class="card-body">
        <!-- //browse buttons -->
        <div class="buttons m-3">
          <div class="btn btn-dark" @click="prev">Previous Block</div>
          <div class="btn btn-primary float-right" @click="next">
            Next Block
          </div>
        </div>
        <div class="block-details">
          <div class="cell f-800">Block Number</div>
          <div class="cell">{{ block.blockNum }}</div>

          <div class="cell f-800">Block Hash</div>
          <div class="cell">{{ block.blockHash }}</div>

          <div class="cell f-800">Previous Block Hash</div>
          <div class="cell">{{ block.prevBlockHash }}</div>

          <div class="cell f-800">Block TX Type</div>
          <div class="cell">{{ block.txType }}</div>

          <div class="cell f-800">Block Time</div>
          <div class="cell c-data">{{ block.txTime }}</div>

          <div class="cell f-800">Block Data</div>
          <div class="cell c-data" ref="blockData" contenteditable="true">
            {{ block.data }}
          </div>

          <div class="cell f-800">Government Signature</div>
          <div class="cell c-data">{{ block.gokSign }}</div>

          <div class="cell f-800">Peer Signatures</div>
          <div class="cell c-data">
            {{ block.peerSignatures }}
          </div>
        </div>
        <div @click="resetBlock" class="btn btn-primary float-left m-4">
          Reset Block
        </div>
        <div @click="verifyBlock" class="btn btn-success float-right m-4">
          Verify Block
        </div>
        <div class="block-details" v-if="verification.done">
          <div class="cell f-800">Hash Verification</div>
          <div v-if="!verification.hash" class="cell text-danger">FAILED</div>
          <div v-if="verification.hash" class="cell text-success">SUCCESS</div>

          <div class="cell f-800">GOK Verification</div>
          <div v-if="!verification.gok" class="cell text-danger">FAILED</div>
          <div v-if="verification.gok" class="cell text-success">SUCCESS</div>

          <div class="cell f-800">Peer Verification</div>
          <div class="cell">
            <div class="peer-cont" v-for="v in verification.peers">
              {{ v.peer.peerId }} :
              <span v-if="!v.validSignature" class="text-danger">FAILED</span>
              <span v-if="v.validSignature" class="text-success">SUCCESS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- data block -->
    <div class="card data-card shadow mb-4" v-if="block">
      <!-- Card Header - Accordion -->
      <a
        href="#collapseCardExample"
        class="d-block card-header py-3"
        data-toggle="collapse"
        role="button"
        aria-expanded="true"
        aria-controls="collapseCardExample"
      >
        <h6 class="m-0 font-weight-bold text-primary">Block Data</h6>
      </a>
      <!-- Card Content - Collapse -->
      <div class="collapse show" id="collapseCardExample">
        <div class="card-body">
          <!-- json data -->
          <vue-json-pretty :path="'res'" :data="JSON.parse(block.data)">
          </vue-json-pretty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import crypto from "crypto";
export default {
  data() {
    return {
      name: "",
      status: "",
      query: "",
      block: null,
      verification: {
        hash: null,
        gok: null,
        peers: [],
        done: false,
      },
      errors: [],
    };
  },
  components: {
    VueJsonPretty,
  },
  async mounted() {
    if (this.$route.params.query) {
      this.query = this.$route.params.query;
      this.search();
    }
  },
  methods: {
    getCoat() {
      return new Promise((resolve) => {
        var img = new Image();
        img.src = "/img/coat.png";
        img.onload = function () {
          resolve(img);
        };
      });
    },
    verifyBlock() {
      this.verification.done = true;
      this.verifyHash();
      this.verifyGOK();
      this.verifyPeers();
    },
    async verifyPeers() {
      let verify = crypto.createVerify("RSA-SHA256");
      let peerSignatures = this.block.peerSignatures;
      //get all peer public keys
      var response = await this.$axios.post(config.peer.peer.getAll, {});
      var peers = response.data.peers;

      var peerVerifications = [];
      //loop peer signatures
      peerSignatures.forEach((s) => {
        //get peer
        let peer = peers.filter((p) => p.peerId == s.peerId)[0];
        //chech peer signature
        let editedData = this.$refs.blockData.innerText;
        let block2 = {
          txType: this.block.txType,
          blockNum: this.block.blockNum,
          txTime: this.block.txTime,
          data: editedData,
          gokSign: this.block.gokSign,
        };
        verify.update(JSON.stringify(block2));
        verify.end();
        var validSignature = verify.verify(
          peer.publicKey,
          s.peerSignature,
          "base64"
        );
        peerVerifications.push({
          peer,
          validSignature,
        });
      });

      this.verification.peers = peerVerifications;
    },
    verifyGOK() {
      let verify = crypto.createVerify("RSA-SHA256");
      let publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAuvyF+uYWPiZChYyFT5gux6/YMHpcPx4cx83HlXdtJIsHclHT9LZe
n7OpbjS64q12+1mDkX3vnTeYG9TJob+kJCYrYkUrFkOM2OqKgVNHro4LJi14SYuc
RNKRa6n3TIKSI0CqMFEptOGlGHM9TmoyfieLcpeFSzFjbK7HjI/k/DclD2yCcIDR
eLw2Ff947m4/zqG7XV+TXnM0mtzvwvW/iypmZR84UICpSAwGsAei7lG4Fu3fnMlP
wk8HzBpGMipclNOY6BNNID1nPQkeNbIBuGGwDatAZrmOudJzIFLnoIhSgu5bg3yS
4XVBTOCdrssLCA8ebUBCkknhJRpXP/f0IQIDAQAB
-----END RSA PUBLIC KEY-----`;
      let editedData = this.$refs.blockData.innerText;
      let block2 = {
        txType: this.block.txType,
        blockNum: this.block.blockNum,
        txTime: this.block.txTime,
        data: editedData,
      };
      verify.update(JSON.stringify(block2));
      verify.end();

      var validSignature = verify.verify(
        publicKey,
        this.block.gokSign,
        "base64"
      );
      this.verification.gok = validSignature;
    },
    verifyHash() {
      let hash = crypto.createHash("sha256");

      let editedData = this.$refs.blockData.innerText;
      let block2 = {
        txType: this.block.txType,
        blockNum: this.block.blockNum,
        txTime: this.block.txTime,
        data: editedData,
        gokSign: this.block.gokSign,

        peerSignatures: this.block.peerSignatures,
      };

      hash.update(JSON.stringify(block2));
      hash = hash.digest("hex");

      if (this.block.blockHash == hash) {
        this.verification.hash = true;
      } else {
        this.verification.hash = false;
      }
    },
    async resetBlock() {
      this.block.data = null;
      this.verification.done = false;
      var response = await this.$axios.post(config.peer.block.search, {
        query: this.block.blockNum,
      });
      this.block = null;

      let errors = response.data.errors;
      if (errors.length == 0) {
        this.block = response.data.block;
      } else {
        this.errors = ["Block not found"];
      }
    },

    async next() {
      this.verification.done = false;
      var response = await this.$axios.post(config.peer.block.search, {
        query: this.block.blockNum + 1,
      });
      let errors = response.data.errors;
      if (errors.length == 0) {
        this.block = response.data.block;
      } else {
        this.errors = ["Block not found"];
      }
    },
    async prev() {
      this.verification.done = false;
      var response = await this.$axios.post(config.peer.block.search, {
        query: this.block.blockNum - 1,
      });
      let errors = response.data.errors;
      if (errors.length == 0) {
        this.block = response.data.block;
      } else {
        this.errors = ["Block not found"];
      }
    },
    async search() {
      this.verification.done = false;
      this.block = null;
      this.errors = [];
      this.result = null;
      var response = await this.$axios.post(config.peer.block.search, {
        query: this.query,
      });
      let errors = response.data.errors;
      if (errors.length == 0) {
        this.block = response.data.block;
      } else {
        this.errors = ["Block not found"];
      }
    },
  },
};
</script>

<style scoped>
.home-page {
  padding: 2em;
}
.block-details {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 70vw;
}
.block-details > div {
  border-bottom: solid silver 1px;
}
.data-card {
  max-width: 80vw;
}
.f-800 {
  font-weight: 800;
}
.cell {
  padding: 1em;
}
.c-data {
  max-width: 85vw;
  word-break: break-all;
}
</style>
