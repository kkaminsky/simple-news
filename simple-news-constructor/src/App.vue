<template>
  <v-app>
    <v-app-bar app>
      <router-link to="/" style="text-decoration: none; color: black">
        <v-toolbar-title class="headline text-uppercase" >
          <span>SIMPLE</span>
          <span class="font-weight-light">CONSTRUCTOR</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-img v-if=isLoading src="https://ui-ex.com/images/transparent-background-loading.gif" height="50px">
      </v-img>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-btn v-if=!enable
             text
             to="/signin"
      >
        <span class="mr-2">Вход</span>
      </v-btn>
      <v-btn v-if=enable text color="error" to="/" @click="clear">
        Sign Out
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import HelloWorld from './components/HelloWorld';

  export default {
    name: 'App',
    components: {
      HelloWorld,
    },
    data: () => ({
      refCount: 0,
      isLoading: false,

    }),
    computed:{
      enable(){
        return localStorage.getItem("username")!=null
      }
    },
    created() {


      let vm = this
      this.$http.interceptors.request.use((config) => {
        vm.setLoading(true)
        return config;
      }, (error) => {
        vm.setLoading(false)
        return Promise.reject(error);
      });

      this.$http.interceptors.response.use((response) => {
        vm.setLoading(false)
        return response;
      }, (error) => {
        vm.setLoading(false)
        return Promise.reject(error);
      });
    },
    methods:{
      setLoading(isLoading) {
        if (isLoading) {
          this.refCount++;
          this.isLoading = true;
        } else if (this.refCount > 0) {
          this.refCount--;
          this.isLoading = (this.refCount > 0);
        }
      },
      clear(){
        localStorage.clear()
        location.reload()
      }
    }
  };
</script>
<style scoped>
</style>
