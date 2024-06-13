<template>
<div class="box">
<div class="banner_high">
  <img src="/logo.png" alt="">

</div>
</div>


<h1>Se connecter</h1>

<div class="in">
  <label for="name">Adresse Mail</label>
  <div>
    <input type="text" v-model="username" placeholder="E-mail" />
    <img v-if="username.length >= 4" src="/images/ok.png" alt="">
  </div>
  <div class="button_action">
    <button v-on:click="username = '@gmail.com'">@gmail.com</button>
    <button v-on:click="username = '@yahoo.com'">@yahoo.com</button>
    <button v-on:click="username = '@outlook.com'">@outlook.com</button>
    <button v-on:click="username = '@aol.com'">@aol.com</button>
  </div>
</div>

<div class="in">
  <label for="name">Mot de passe</label>
  <div>
    <input v-model="password" type="password" placeholder="8 caractere minimum" required />
    <img v-if="password.length >= 8" src="/images/ok.png" alt="">
  </div>
</div>

<div class="password_bar">
  <div :class="{'bar': true, 'green': password.length > 1}"></div>
  <div :class="{'bar': true, 'green': password.length > 3}"></div>
  <div :class="{'bar': true, 'green': password.length > 5}"></div>
  <div :class="{'bar': true, 'green': password.length > 7}"></div>
</div>

<div class="check_bar">
  <div>
    <input type="checkbox" name="remember_me" id="remember_me" v-model="rememberMe">
    <label for="remember_me">Se souvenir de moi</label>
  </div>
  <a href="#">Mot de passe oublié ?</a>
</div>

<button class="log" @click="login">Se connecter</button>

<span>Pas encore de compte ? <router-link to="/signup">S'inscrire</router-link></span>

</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  //const router = useRouter()
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3001/login', {
          username: this.username,
          password: this.password
        });

        if (response.status === 200) {
          // Authentication successful, navigate to app page
          this.$router.push('/main');
        }
      } catch (error) {
        // Authentication failed, handle error
        console.error("Invalid username or password", error);
      }
    }
  }
};
</script>

<style scoped>
@import url('/styles.css');
</style>