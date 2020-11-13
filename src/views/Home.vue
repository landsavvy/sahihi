<template>
  <div class="home-page">
    <div class="text-center">
      <h1>Sahihi App</h1>
    </div>
    <div class="help">
      Sahihi app allows you to digitally sign documents required for land
      registry procedures. This software enables you to have a self-sovereign
      identity.
      <b>This software should be only downloaded from a trusted source.</b>
      Advanced users are encouraged to look at its code, to ensure no malicious
      code was added.
      <div class="text-primary" @click="openRepo">More info here.</div>
    </div>
    <div class="list m-4">
      <b>Use side menu to:</b>
      <ul>
        <li>Generate new key pairs</li>
        <li>Change Witness</li>
        <li>Sign Land Transfer Drafts</li>
        <li>Sign Land Subdivsions Drafts</li>
        <li>Explore the blockchain</li>
        <li>Verify Blocks</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { shell } from "electron";
export default {
  methods: {
    openRepo() {
      shell.openExternal("https://github.com/landsavvy/");
    },
  },
};
</script>

<style scoped>
.home-page {
  padding: 2em;
}
</style>
