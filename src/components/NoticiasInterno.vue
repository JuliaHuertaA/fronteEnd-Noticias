<template>
  <div>
    <div v-if="!esExterno" class="container mb-3">
      <h1>Agregar Noticia</h1>
      <form @submit.prevent="agregarNoticia">
        <div class="form-group mb-2">
          <label for="">Encabezado</label>
          <input
            v-model="encabezado"
            type="text"
            class="form-control"
            id=""
            aria-describedby=""
          />
        </div>
        <div class="form-group mb-2">
          <label for="">Cuerpo de la noticia</label>
          <textarea
            v-model="cuerpo"
            class="form-control"
            id=""
            rows="3"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-warning mb-2">Agregar</button>
      </form>
    </div>
    <div>
        <h1>Portal de noticias</h1>
    </div>
    <div v-for="noticia in noticias" :key="noticia.idNoticia" class="card mb-5">
      <h5 class="card-header"></h5>

      <div class="card-body">
        <h3 class="card-title">{{ noticia.encabezado }}</h3>
        <img src="../assets/news.png" class="img-thumbnail" alt="..." />
        <p class="card-text">{{ noticia.cuerpo }}</p>
        <p class="card-text text-end">
        <b>Autor:</b>        
          {{
            `${noticia.idPerfil.idPersonal.nombre} ${noticia.idPerfil.idPersonal.apePaterno} ${noticia.idPerfil.idPersonal.apeMaterno}`
          }}
        </p>
        <p class="card-text text-end">
         <b>Fecha de publcacion: </b>{{ conversionFecha(noticia.fecha) }}
        </p>
      </div>
      <!--Noticias  -->
      <div class = " container" v-show="comentsNoticia[noticia.idNoticia]">
        <div
          v-for="comentario in comentsNoticia[noticia.idNoticia]"
          :key="comentario.idComentario"
          class="card"
        >
          <div class="card">
            <div class="card-body alert-warning">
              <div class="container">
                <div class="row text-start">
                    <div class="col d-flex justify-content-center">
                        <img src="../assets/user.png" width="70px" height="70px" alt="">
                    </div>
                    <div class="col">
                    <p v-if="comentario.perfil.esExterno === false">
                        <b> {{
                        `${comentario.perfil.idPersonal.nombre} ${comentario.perfil.idPersonal.apePaterno} ${comentario.perfil.idPersonal.apeMaterno}`
                        }}
                        (Usuario interno)
                        </b>
                    </p>
                    <p v-else>
                        <b>{{
                        `${comentario.perfil.idUsuario.nombre} ${comentario.perfil.idUsuario.apePaterno} ${comentario.perfil.idUsuario.apeMaterno}`
                        }}
                        (Usuario externo)
                        </b>
                    </p>
                    <p class="ml-5">{{ comentario.comentario }}</p>
                    </div>
                </div>
              </div>
              <p>Comentado el día {{ conversionFecha(comentario.fecha) }}</p>
              <div v-if="respuestasComentario[comentario.idComentario]">
                <div
                  v-for="respuesta in respuestasComentario[
                    comentario.idComentario
                  ]"
                  :key="respuesta.idRespuesta"
                >
                  <div class="row alert alert-light">
                    <div class="row">
                        <div class="col-4">
                            <img src="../assets/profile.png" width="70px" height="70px" alt="">
                        </div>
                        <div class="col-4">
                            <b><p>
                                {{
                                    `${respuesta.perfil.idPersonal.nombre} ${respuesta.perfil.idPersonal.apePaterno} ${respuesta.perfil.idPersonal.apePaterno}`
                                }}
                            </p></b>
                            <p>{{ respuesta.respuesta }}</p>
                            <p>{{ conversionFecha(respuesta.fecha) }}</p>                            
                        </div>
                        <div class="col-4">
                         <div class="row"> 
                            <div class="col-6">
                              <button v-on:click="eliminarRespuesta(respuesta.idRespuesta)" type="button" class="btn btn-danger">Eliminar</button>
                            </div>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              <div class="row justify-content-center">
                <form @submit.prevent="agregarRespuesta(comentario.idComentario)" class="row justify-content-center">
                  <div class="mb-3 mt-2 col-8">
                    <input v-model="respuestaComen" type="text" class="form-control" id="" />
                  </div>
                  <div class="mb-3 mt-2 col-4">
                    <button type="submit" class="btn btn btn-light">
                      Responder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3 mb-3">
            <form @submit.prevent="agregarComentario(noticia.idNoticia)">
                <div class="col-12">
                    <input
                    type="text"
                    class="form-control"
                    v-model="nuevoComentario"
                    />
                </div>
                <div class="col-12 mt-3">
                    <button type="submit" class="btn btn-dark">Comentar</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "NoticiasInterno",
  props: {
    msg: String,
    id: String,
    esExterno: Boolean,
  },
  data() {
    return {
      noticias: Object,
      comentsNoticia: Object,
      respuestasComentario: Object,
    };
  },
  async created() {
    this.nuevoComentario = "";
    this.comentarios ="";
    this.noticias = null;
    this.nuevaNoticia = null;
    this.encabezado = null;
    this.cuerpo = null;
    this.idNoticia = null;
    this.comentario = null;
    this.respuestaComen = ""
    this.respuestas =""

    const noticias = await axios.get("http://127.0.0.1:8080/noticias");
    this.noticias = noticias.data;

    const idsNoticias = this.noticias.map((noticia) => noticia.idNoticia);

    idsNoticias.forEach(async (idNoticia) => {
      const response = await axios.get(
        `http://127.0.0.1:8080/comentarios/obtenerComentarios?id=${idNoticia}`
      );

      this.comentsNoticia = {
        ...this.comentsNoticia,
        [idNoticia]: response.data,
      };

      const idsComentarios = response.data.map(
        (comentario) => comentario.idComentario
      );

      idsComentarios.forEach(async (idComentario) => {
        const respuestasComentarios = await axios.get(
          `http://127.0.0.1:8080/respuestas/obtenerRespuestas?id=${idComentario}`
        );
        this.respuestasComentario = {
          ...this.respuestasComentario,
          [idComentario]: respuestasComentarios.data,
        };
      });
    });
  },
  methods: {
    conversionFecha(fecha) {
      var d = new Date(fecha);
      return d.toLocaleString();
    },
    agregarNoticia: function () {
      console.log(this.encabezado);
      console.log(this.cuerpo);
      axios
        .post("http://127.0.0.1:8080/noticias/agregarNoticia", {
          encabezado: this.encabezado,
          cuerpo: this.cuerpo,
          perfil: this.id,
        })
        .then((result) => {
          console.log(result);
          this.noticias = [...this.noticias, result.data];
          this.encabezado = "";
          this.cuerpo = "";
        });
    },
    agregarRespuesta: function(idComentario){
        console.log(idComentario)
        console.log(this.respuestaComen)
        console.log(this.id)
        axios
        .post("http://127.0.0.1:8080/respuestas/agregarRespuesta", {
          idPerfil:this.id,
          idComentario:idComentario ,
          respuesta:this.respuestaComen
        })
        .then((result) => {
          console.log(result);
          this.respuestas = [...this.respuestas, result.data];
          this.respuestaComen = "";
          location.reload();
          this.$router.go(0);
        });
    },
    agregarComentario: function(idNoticia){
        console.log(this.nuevoComentario)
        console.log(idNoticia)
        console.log(this.id)
        axios
        .post("http://127.0.0.1:8080/comentarios/agregarComentario", {
         idNoticia:idNoticia,
         comentario:this.nuevoComentario,
         perfil:this.id
        })
        .then((result) => {
          console.log(result);
          this.come = [...this.comentarios, result.data];
          this.nuevoComentario = "";
          location.reload();
          this.$router.go(0);
        });
    },
    eliminarRespuesta: function(idRespuesta){
        console.log(idRespuesta)
        axios
        .get(`http://127.0.0.1:8080/respuestas/eliminarRespuesta?id=${idRespuesta}`)
        .then((result) => {
          console.log(result);
          location.reload();
          this.$router.go(0);
        });
    }
  }
}
</script>



