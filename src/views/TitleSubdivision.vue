<template>
  <div class="home-page">
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Change Witness</h6>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for>Parent Title Number</label>
          <input
            v-model="parentTitleNum"
            type="text"
            name
            id
            class="form-control"
            placeholder
            aria-describedby="helpId"
          />
        </div>
        <div class="form-group">
          <div for="subdivisions">Subdivisions Coordinates</div>
          <textarea
            @change="changeCoords"
            v-model="subCoords"
            class="form-control"
            id
            cols="30"
            rows="10"
          ></textarea>
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
          <small id="helpId" class="text-muted">Owner Private Key</small>
        </div>
        <button @click="sign" class="float-right mt-4 btn btn-success">Sign</button>
      </div>
    </div>
    <!-- signature card -->
    <div class="card shadow mb-4" v-if="signed">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Signature</h6>
      </div>
      <div class="card-body">
        <div
          class="help"
        >Export the digital signature and send it to Karani offices. Signature expires in 14days</div>
        <div class="signature">{{finalFile.signature}}</div>
        <button @click="exportSignature" class="float-right mt-4 btn btn-danger">Export</button>
      </div>
    </div>
    <!-- map card -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Map</h6>
      </div>
      <div class="card-body">
        <div id="map"></div>
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

      parentTitleNum: "",
      mapPolygons: [],
      subCoords: "",
      finalFile: {},
      privateKey: "",
    };
  },
  async mounted() {
    $(".custom-file-input").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
    });
    window.mark = this.createMarkers;
    window.singleMark = this.singleMark;
    await this.waitForGoogle();
    window.map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: -1.0882507,
        lng: 37.0148943,
      },
      zoom: 14,
    });
  },
  methods: {
    async singleMark(point) {
      var marker = new google.maps.Marker({
        position: point,
        label: "big",
        map: map,
      });
    },
    randomDark() {
      function randomInt(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }
      var red = randomInt(0, 150);
      var green = randomInt(0, 150);
      var blue = randomInt(0, 150);
      return `RGB(${red},${green},${blue})`;
    },
    async createMarkers() {
      var subdivisions = JSON.parse(this.subCoords);
      subdivisions.forEach((sub) => {
        sub.forEach((point, index) => {
          var marker = new google.maps.Marker({
            position: point,
            label: (index + 1).toString(),
            map: map,
          });
        });
      });
    },
    async changeCoords() {
      console.log("changed cords");
      var subdivisions = JSON.parse(this.subCoords);
      if (this.mapPolygons.length != 0) {
        this.mapPolygons.forEach((poly) => {
          poly.setMap(null);
        });
      }
      subdivisions.forEach((sub) => {
        var randomColor = this.randomDark();
        console.log("random color", randomColor);
        var mapPolygon = new google.maps.Polygon({
          paths: sub,
          strokeColor: randomColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: randomColor,
          fillOpacity: 0.35,
        });
        mapPolygon.setMap(map);
        this.mapPolygons.push(mapPolygon);
      });
    },
    async waitForGoogle() {
      if (window.google) {
        return;
      }
      await sleep(1000);
      return this.waitForGoogle();
    },
    async exportSignature() {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      var filepath = result.filePaths[0];
      var exportText = JSON.stringify(this.finalFile);
      fs.writeFileSync(
        path.join(filepath, "TitleSubdivisionRequest.json"),
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
        parentTitleNum: this.parentTitleNum,
        timestamp: Date.now(),
        subCoords: this.subCoords,
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
#map {
  height: 80vh;
  width: 100%;
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
