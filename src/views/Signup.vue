<template>
  <div class="mx-auto">
    <form class="col-12" action>
      <div class="mx-auto logo">Logo</div>
      <div class="text-danger">
        <p v-for="error in errors">{{ translate(error) }}</p>
      </div>
      <div class="text-center text-primary">
        <p>Sign Up</p>
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control input-line"
          v-model="username"
          id="username"
          aria-describedby="helpId"
          placeholder="username"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control input-line"
          @keyup.13="login"
          v-model="password"
          id="password"
          aria-describedby="helpId"
          placeholder="password"
        />
      </div>
      <small class="text-center">
        <a href="https://nani.chat/web/forgot">Forgot Password</a>
      </small>
      <div class="mt-5">
        <div @click="goToLogin" class="d-inline m-2 help-text">
          Have an Account? Login
        </div>
        <button
          v-if="!loading"
          type="button"
          @click="signUp"
          class="float-right btn btn-outline-dark"
        >
          Next
        </button>
        <div v-if="loading" class="float-right loading-btn">Loading</div>
      </div>
    </form>
  </div>
</template>

<script>
import local from "../store/local";
export default {
  data() {
    return {
      username: "",
      loading: false,
      password: "",
      errors: [],
    };
  },
  methods: {
    goToLogin() {
      return this.$router.push({ name: "login" });
    },
    async signUp() {
      console.log("sign up");
      this.loading = true;
      this.errors = [];
      try {
        var response = await this.$axios.post(config.url.user.signup, {
          username: this.username,
          password: this.password,
        });
      } catch (ex) {
        console.error(ex);
        this.loading = false;
        return;
      }

      let errors = response.data.errors;
      this.errors = errors;
      console.log(errors);
      if (this.errors.length != 0) {
        this.loading = false;
        return;
      }
      state.authToken = response.data.token;
      if (state.authToken && state.authToken != "") {
        //save token =
        await local.saveToken(state.authToken);
        if (state.user.role == "admin") {
          return this.$router.push({ name: "adminHome" });
        }
        return this.$router.push({ name: "userHome" });
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
body {
  background-color: #4e73df;
  /* background-image: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
  background-size: cover; */
}
.loading-btn {
  color: #007bff;
  background-color: transparent;
  background-image: none;
  border: 1px solid #007bff;
  border-radius: 0.25rem;
  padding: 0.25em;
  padding-left: 1em;
  padding-right: 1em;
  display: grid;
}
.spinner {
  transform: scale(0.8);
  align-self: center;
}
</style>
