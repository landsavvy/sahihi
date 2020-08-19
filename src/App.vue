<template>
  <div id="app">
    <div class="menu">
      <div class="menu-list list-group">
        <router-link to="/" class="list-group-item list-group-item-action">Home</router-link>
        <router-link to="/keygen" class="list-group-item list-group-item-action">Keygen</router-link>
        <router-link to="/public" class="list-group-item list-group-item-action">Change Public Key</router-link>
        <router-link to="/witness" class="list-group-item list-group-item-action">Change Witness</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    window.mainComp = this;
  },
};
</script>

<style scoped>
.menu {
  height: 100vh;
  display: grid;
}
.menu-list {
  align-self: center;
}
#app {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr;
}
</style>
