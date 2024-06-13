<template>
  <div class="box">
    <div class="banner_high">
      <img src="/logo.png" alt="">

    </div>

    <h1>S'inscrire</h1>

    <div class="in">
      <label for="username">Pseudo</label>
      <div>
        <input type="text" v-model="username" placeholder="Entrer votre pseudo" />
        <img v-if="username.length >= 5" src="/images/ok.png" alt="">
      </div>
    </div>

    <div class="in">
      <label for="email">Adresse Mail</label>
      <div>
        <input type="email" v-model="email" placeholder="Entrer votre adresse mail" />
        <img v-if="email.length >= 6" src="/images/ok.png" alt="">
      </div>
      <div class="button_action">
        <button @click="email = '@gmail.com'">@gmail.com</button>
        <button @click="email = '@yahoo.com'">@yahoo.com</button>
        <button @click="email = '@outlook.com'">@outlook.com</button>
        <button @click="email = '@aol.com'">@aol.com</button>
      </div>
    </div>

    <div class="in">
      <label for="password">Mot de passe</label>
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

    <div class="in">
      <label for="password_confirm">Confirmer le mot de passe</label>
      <div>
        <input v-model="passwordConfirm" type="password" placeholder="Confirmer le mot de passe ..." required />
        <img v-if="!passwordConfirm" style="display: none;" src="/images/ok.png" alt="">
        <img v-else-if="password === passwordConfirm" src="/images/ok.png" alt="">
      </div>
    </div>

    <div class="check_bar">
      <div>
        <input type="checkbox" name="remember_me" id="remember_me" v-model="rememberMe">
        <label for="remember_me">Se souvenir de moi</label>
      </div>
      <a href="#">Mot de passe oublié ?</a>
    </div>

    <button class="log" @click="signup">S'inscrire</button>

    <span>Déjà inscrit ? <router-link to="/">Se connecter</router-link></span>
  </div>
</template>



<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      rememberMe: false,
      isActive: true
    };
  },
  methods: {
    async signup() {
      if (this.username === '' || this.email === '' || this.password === '' || this.passwordConfirm === '') {
        console.log('Please fill all the fields');
        return;
      }

      if (this.password !== this.passwordConfirm) {
        console.log('Passwords do not match');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3001/signup', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        if (response.status === 201) {
          // Signup successful, navigate to app page
          this.$router.push('/login'); // Change '/app' to your app's main route
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log('Username or email already exists');
        } else {
          console.error('Error signing up:', error);
        }
      }
    },
    appendDomain(domain) {
      this.email += domain;
    }
  }
};
</script>
<style scoped>
/* Import styles from styles.css */
@import url('/styles.css');
</style>




