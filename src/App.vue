<template>
  <div id="app">
    <div class="menu">
      <div class="menu-list list-group">
        <router-link
          :class="{active: isOn('home')}"
          to="/"
          class="list-group-item list-group-item-action"
        >Home</router-link>
        <router-link
          :class="{active: isOn('keygen')}"
          to="/keygen"
          class="list-group-item list-group-item-action"
        >Keygen</router-link>
        <router-link
          :class="{active: isOn('changeKey')}"
          to="/changeKey"
          class="list-group-item list-group-item-action"
        >Change Public Key</router-link>
        <router-link
          :class="{active: isOn('changeWitness')}"
          :to="{name:'changeWitness'}"
          class="list-group-item list-group-item-action"
        >Change Witness</router-link>
        <router-link
          :class="{active: isOn('titleSubdivision')}"
          :to="{name:'titleSubdivision'}"
          class="list-group-item list-group-item-action"
        >Title Subdivision</router-link>
        <router-link
          :class="{active: isOn('titleTransfer')}"
          :to="{name:'titleTransfer'}"
          class="list-group-item list-group-item-action"
        >Title Transfer</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    isOn(page) {
      return this.$route.name == page;
    },
  },
  mounted() {
    window.mainComp = this;
  },
};
</script>

<style scoped>
.menu {
  height: 100vh;
  position: sticky;
  display: grid;
  top: 0;
}
.menu-list {
  margin: 1em;
  align-self: center;
}
#app {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr;
}
</style>
