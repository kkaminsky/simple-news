<template>
  <div>
    <main-component></main-component>
  </div>

</template>

<script>
  import MainComponent from '../components/MainComponent'
    export default {
        name: "UserCabinet",
      components:{
          MainComponent
      },
      computed:{
        username(){
          return localStorage.getItem("username")
        },
        admin(){
          return localStorage.getItem("userRole")==="ROLE_ADMIN"
        }
      }

    }
</script>

<style scoped>

</style>
