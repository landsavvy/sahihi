<template>
  <div class="home-page">
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Title Transfer</h6>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for>Title number</label>
          <input
            v-model="titleNum"
            type="text"
            name
            id
            class="form-control"
            placeholder
            aria-describedby="helpId"
          />
          <small id="helpId" class="text-muted">Title Number</small>
        </div>
        <div class="form-group">
          <label for>Current Owner ID :</label>
          <input
            v-model="currentOwnerId"
            type="text"
            name
            id
            class="form-control"
            placeholder
            aria-describedby="helpId"
          />
          <small id="helpId" class="text-muted"
            >Owner ID, of the person owning the title</small
          >
        </div>
        <div class="form-group">
          <label for>New Owner(s) ID :</label>
          <input
            v-model="newOwnerIds"
            type="text"
            name
            id
            class="form-control"
            placeholder
            aria-describedby="helpId"
          />
          <small id="helpId" class="text-muted"
            >Owner ID, of person title to be transfered to</small
          >
        </div>
        <div class="form-group custom-file">
          <input
            ref="fileInput"
            type="file"
            @change="fileOpened"
            class="custom-file-input"
            id="customFile"
          />
          <label class="custom-file-label" for="customFile">Choose file</label>
          <small id="helpId" class="text-muted"
            >Private Key of current owner (For cotenancy and joint tenancy, both
            parties should use their own private keys)
          </small>
        </div>
        <button @click="sign" class="float-right mt-4 btn btn-success">
          Sign
        </button>
      </div>
    </div>
    <!-- signature card -->
    <div class="card shadow mb-4" v-if="signed">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Signature</h6>
      </div>
      <div class="card-body">
        <div class="help">
          Export the digital signature and send it to Karani offices. Signature
          expires in 14days
        </div>
        <div class="signature">{{ finalFile.signature }}</div>
        <button
          @click="exportSignature"
          class="float-right mt-4 btn btn-danger"
        >
          Export
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const fs = require("fs");
const path = require("path");
const { dialog } = require("electron").remote;
import crypto from "crypto";
export default {
  data() {
    return {
      signed: false,
      newOwnerIds: "",
      currentOwnerId: "",
      titleNum: "",
      finalFile: {},
      privateKey: "",
    };
  },
  mounted() {
    $(".custom-file-input").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
    });
  },
  methods: {
    async exportSignature() {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      var filepath = result.filePaths[0];
      var exportText = JSON.stringify(this.finalFile);
      fs.writeFileSync(
        path.join(filepath, "TitleTransferSignature.json"),
        exportText
      );
      swal({
        title: "Saved",
        text: `Saved to : ${filepath}`,
        icon: "success",
        button: "Dismiss",
      });
    },
    getPrivateKey() {
      return new Promise((resolve) => {
        var fileInput = this.$refs.fileInput;
        var file = fileInput.files[0];

        var reader = new FileReader();

        reader.onload = function (e) {
          var content = reader.result;
          //Here the content has been read successfuly
          resolve(content);
        };
        reader.readAsText(file);
      });
    },
    async sign() {
      //get output for saving file
      this.privateKey = await this.getPrivateKey();
      console.log(this.privateKey);
      var signer = crypto.createSign("RSA-SHA256");
      var data = {
        newOwnerIds: this.newOwnerIds,
        currentOwnerId: this.currentOwnerId,
        timestamp: Date.now(),
        titleNum: this.titleNum,
      };
      var stringData = JSON.stringify(data);
      signer.update(stringData);
      signer.end();
      var signature = signer.sign(this.privateKey, "base64");
      var finalFile = {
        signature,
        stringData,
      };
      this.finalFile = finalFile;
      this.signed = true;
      console.log(finalFile);
    },
    openRepo() {
      shell.openExternal("https://github.com/landsavvy/");
    },
    fileOpened() {
      console.log("file opened");
    },
  },
};
</script>

<style scoped>
.home-page {
  padding: 2em;
}
.signature {
  overflow-wrap: anywhere;
  font-size: 0.8em;
  color: #043b0b;
  padding: 1em;
  background: #7ff8f24d;
  border-radius: 1em;
  margin: 1em;
}
</style>
