<template>
  <div class="container">
     <img class="img-flui mb-5" alt="Castores logo" src="../assets/logo.jpg">
     <h1 class="fst-italic mb-3">PORTAL DE NOTICIAS</h1>
      <div class="row justify-content-center">
        <form @submit="loguear">
          <div class="row justify-content-center">
            <div class="mb-3 col-5 align-self-center">
              <label for="" class="form-label">Id de usuario</label>
              <input v-model="idUsuario" type="text" class="form-control" id="" aria-describedby="">
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="mb-3 col-5 align-self-center">
              <label for="" class="f">Contraseña</label>
              <input v-model="password" type="password" class="form-control" id="">
            </div>
          </div>

          <button type="submit" class="btn btn-danger">Ingresar</button>

          <p class="mt-3">{{mensajeError}}</p>
        </form>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
//import router from '../router'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      idUsuario: Number,
      password: String,
      mensajeError:String
    }
  },
  created(){
     this.password="";
     this.idUsuario=null;
     this.mensajeError="";
  },
  methods:{
    loguear(e){
        e.preventDefault();

        console.log(this.idUsuario);
        console.log(this.password);

        const self = this;
        console.log(self);
        axios.post('http://127.0.0.1:8080/login/verificar',{id:this.idUsuario,contrasena:this.password})
        .then((result)=>{
        console.log(result);
        if (!result.data){
           this.mensajeError = "Intenta de nuevo con otro usuario"
           return
        }

          this.$router.push({name:"NoticiasInterno",params:{id:this.idUsuario,  esExterno: result.data.esExterno }})
        
        })
        .catch((error)=>{
        console.log(error);
        });       
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
