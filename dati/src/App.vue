<template>
  <center><h1>DATI-METEOCLIMATICI</h1></center>
  <nav>
    <div class="navbar">
      <button @click="goHome" :class="{ active: currentRoute === '/' }">TABELLE</button>
      <button @click="goGrafici" :class="{ active: currentRoute === '/grafici' }">GRAFICO TABELLE</button>  
      <button @click="goComunii" :class="{ active: currentRoute === '/comunii' }">10 COMUNI PIU CALDE</button>
      <button @click="goGraficii" :class="{ active: currentRoute === '/graficii' }">GRAFICO DEI 10 COMUNI PIU CALDE</button>
    </div>
  </nav>
  <router-view/>
</template>

<script>
export default {
  data() {
    return {
      currentRoute: ''
    };
  },
  created() {
    this.currentRoute = this.$route.path;
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    
    goGrafici() {
      this.$router.push('/grafici');
    },
    goComunii() {
      this.$router.push('/comunii');
    },
    goGraficii() {
      this.$router.push('/graficii');
    }
    
  },
  watch: {
    '$route'(to,) {
      this.currentRoute = to.path;
    }
  }
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.navbar button {
  font-weight: bold;
  color: #2c3e50;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 20px;
  margin-right: 10px;
}

.navbar button.active {
  color: #42b983;
  text-decoration: underline;
}
</style>
