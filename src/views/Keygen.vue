<template>
  <div class>
    <form class="col-12" action>
      <div class="text-center text-primary">
        <h2>Generate Public-Private Key Pair</h2>
        <div class="help">Please do not share your private key</div>
        <div class="m-4 btn btn-success" @click="generate">Generate</div>

        <div class="m-4 btn btn-danger" @click="save">Export</div>
      </div>
      <div class="public-key keys">{{publicKey}}</div>
      <div class="private-key keys">{{privateKey}}</div>
    </form>
  </div>
</template>

<script>
const crypto = require("crypto");
const fs = require("fs");

const path = require("path");
const { dialog } = require("electron").remote;
export default {
  data() {
    return {
      username: "",
      loading: false,
      publicKey: "",
      privateKey: "",
    };
  },
  methods: {
    async save() {
      if (this.publicKey == "") {
        swal({
          title: "Alert",
          text: `Generate keys first`,
          icon: "warning",
        });
        return;
      }
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      var filepath = result.filePaths[0];

      fs.writeFileSync(path.join(filepath, "PrivateKey.pem"), this.privateKey);
      fs.writeFileSync(path.join(filepath, "PublicKey.pem"), this.publicKey);
      swal({
        title: "Saved Keys",
        text: `Saved to : ${filepath}`,
        icon: "success",
        button: "Dismiss",
      });
      console.log(filepath);
    },
    async generate() {
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
      });
      // Handle errors and use the generated key pair.
      this.publicKey = publicKey.export({ type: "pkcs1", format: "pem" });
      this.privateKey = privateKey.export({ type: "pkcs1", format: "pem" });
    },
  },
};
</script>

<style scoped>
.keys {
  border-radius: 1em;
  background: #ebf9fa;
  margin: 1em;
  padding: 1em;
}
</style>
