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
          <div class="cell c-data" contenteditable="true">{{ block.data }}</div>

          <div class="cell f-800">Government Signature</div>
          <div class="cell c-data">{{ block.gokSign }}</div>

          <div class="cell f-800">Peer Signatures</div>
          <div class="cell c-data">
            {{ block.peerSignatures }}
          </div>
        </div>

        <div @click="verifyBlock" class="btn btn-success float-right m-4">
          Verify Block
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
export default {
  data() {
    return {
      name: "",
      status: "",
      query: "",
      block: null,
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

    async verifyBlock() {},
    async next() {
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
