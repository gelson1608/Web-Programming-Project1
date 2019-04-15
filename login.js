//VARIABLES GLOBALES

//Login:
var jsonUsuario={"usuario":"", "contrasenia":""};
//CrearUsuario:
var jsonUsuarioNew = {"usuario":"", "correo":"", "contrasenia":""};
var estado = [];
var indexD, indexP;
/*---------------------------------------------*/

//ASIGNACION DE BOTONES
var botonesLogin = function(){
  document.getElementById("ingresar").addEventListener("click",verificarUsuario);
}
//Botones que validan y crean el usuario
var botonesCrearUsuario = function(){
  document.getElementById("check").addEventListener("click",validarCheckbox);
  document.getElementById('correo').addEventListener('keyup',validarCorreoBD );
  document.getElementById('correo').addEventListener('keyup',validarCorreoRepetir);
  document.getElementById("correoRepetir").addEventListener("blur",validarCorreoRepetir);
  document.getElementById('usuario').addEventListener('keyup',validarUsuarioBD);
  document.getElementById('pass').addEventListener('keyup',validarContraRepetir);
  document.getElementById("passRepetir").addEventListener("blur",validarContraRepetir);
  document.getElementById("correo").addEventListener("keyup",validateEmail);
  document.getElementById("guardar").addEventListener("click",crearUsuario);
}
/*-------------------------------------------*/


//FUNCIONES DE LOGIN Y VALIDACION DEL USUARIO
var verificarUsuario = function() {
  jsonUsuario.usuario=document.getElementById("nombre").value;
  jsonUsuario.contrasenia=document.getElementById("contra").value;
  if (jsonUsuario.contrasenia == "" || jsonUsuario.usuario == "") {
    document.getElementById("mensaje").innerHTML="Usuario o contraseña incorrecta";
  }else{
    var jsonContra = {"texto":document.getElementById("contra").value};
    var req = new XMLHttpRequest(); //Solicitar un servicio
    var url = "http://45.55.64.102/g4/cipher/encode";
    req.open("POST", url);
    req.onreadystatechange = respuestaPassword; //funcion respuesta
    req.send(JSON.stringify(jsonContra));
  }
};
var respuestaPassword = function(evt){
  if (evt.target.readyState == 4 && evt.target.status == 200){
    jsonUsuario.contrasenia=JSON.parse(evt.target.responseText).mensaje[0];;
    var req = new XMLHttpRequest();
    var url = "http://45.55.64.102/g4/usuario/validar";
    req.open("POST", url);
    req.onreadystatechange = respuestaTotal;
    req.send(JSON.stringify(jsonUsuario));
  }
};

var respuestaTotal=function(evt) {
  if (evt.target.readyState == 4 && evt.target.status == 200){
    var json=JSON.parse(evt.target.responseText);
      if (json.mensaje[0] == 1) {
        window.location="mantenimiento.html";
      }
      else {
        document.getElementById("mensaje").innerHTML="Usuario o contraseña no valida";
      }
    }
};

//FUNCIONES CREARUSUARIO:

//Inicio validaciones
//Funcion que habilita la creacion del usuario si el checkbox es marcado
var validarCheckbox = function (){
  if (document.getElementById("check").checked == true){
      document.getElementById("correo").disabled = false;
      document.getElementById("correoRepetir").disabled = false;
      document.getElementById("usuario").disabled = false;
      document.getElementById("pass").disabled = false;
      document.getElementById("passRepetir").disabled = false;
      document.getElementById("guardar").disabled = false;
  }else{
        document.getElementById("correo").disabled = true;
        document.getElementById("correoRepetir").disabled = true;
        document.getElementById("usuario").disabled = true;
        document.getElementById("pass").disabled = true;
        document.getElementById("passRepetir").disabled = true;
        document.getElementById("guardar").disabled = true;
  }
}

//Funcion que permite validar que el correo sea ingresado con el formato adecuado
//Caso contrario, se manda el mensaje correspondiente
var validateEmail = function(){
    var reg =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var correo = reg.test(document.getElementById("correo").value);
    console.log("status correo: "+ correo);
    if(correo == false){
      document.getElementById("mensaje_correo2").className = "rojito";
      document.getElementById('mensaje_correo2').innerHTML="correo erroneo";
      estado[0] = "incorrecto";
    }else{
      document.getElementById("mensaje_correo2").className = "";
      document.getElementById('mensaje_correo2').innerHTML="";
      estado[0] = "correcto"
    }
return correo;}

//Funcion que da a conocer si el correo se ha ingresado nuevamente y si coinciden
//Caso contrario, se manda el mensaje correspondiente
var validarCorreoRepetir = function(){
if(document.getElementById('correoRepetir').value!=""){
  if (document.getElementById("correoRepetir").value != document.getElementById("correo").value){
    document.getElementById("mensaje_correoRepetir").className = "rojito";
    estado[2] = "incorrecto";
  }else{
    document.getElementById("mensaje_correoRepetir").className = "";
    estado[2] = "correcto";
  }
 }
}

//Funcion que da a conocer si la contraseña se ha ingresado nuevamente y si coinciden
//Caso contrario, se manda el mensaje correspondiente
var validarContraRepetir = function (){
if(document.getElementById('passRepetir').value!=""){
  if(document.getElementById("passRepetir").value!=document.getElementById("pass").value){
    document.getElementById("mensaje_passRepetir").className = "rojito";
    estado[4]="incorrecto";
  }else{
    document.getElementById("mensaje_passRepetir").className = "";
    estado[4]="correcto";
  }
 }
}
//Funciones que validan si el correo ingresado ya esta registrado
var onServicioDevuelto = function(evt){
  //Termino de la comunicacion
  if (evt.target.readyState == 4){
    if (evt.target.status == 200){
        /*var json=JSON.parse(evt.target.responseText);
        if (json.tipo_mensaje=="success") {
          window.location="ajax.html";
        }*/
        var mensaje=evt.target.responseText;
        console.log(mensaje);
        var respuestaServicio=JSON.parse(mensaje);
        var cantRepetidos=respuestaServicio.mensaje;


        console.log(evt);
        console.log("sfda: "+cantRepetidos);
        if (cantRepetidos!=0) {
          document.getElementById("mensaje_correo2").className = "rojito";
          document.getElementById("mensaje_correo2").innerHTML = "correo ya usado";
          estado[3] = "incorrecto";

        }else if(cantRepetidos==0 && validateEmail()==true){
          document.getElementById("mensaje_correo2").className = "";
          document.getElementById("mensaje_correo2").innerHTML = "";
          estado[3] = "correcto";
        }console.log("estado en correo: "+ estado[3]);

      }
    }
}
var validarCorreoBD=function(){
  //Nos vamos a comunicar con el servicio
  var jsonCorreo = {};
  jsonCorreo.correo = document.getElementById("correo").value;
  var req = new XMLHttpRequest();
  var url = "http://45.55.64.102/g4/usuario/correo_repetido";
  req.open("POST",url,true);
  console.log('dfgsdfgsdfg');
  req.onreadystatechange =onServicioDevuelto;
  req.send(JSON.stringify(jsonCorreo));
}

//Funciones que validan si el usuario ingresado ya esta repetido
var onUsuarioDevuelto = function (evt){
  //Termino de la comunicacion
  if (evt.target.readyState == 4){
    if (evt.target.status == 200){
        var usuarioBD=evt.target.responseText;
        console.log("c: "+usuarioBD);
        var respuestaUsuarioBD=JSON.parse(usuarioBD);
        var cantRepetidos=respuestaUsuarioBD.mensaje;

        if (cantRepetidos!=0) {
        document.getElementById("mensaje_usuario").className = "rojito";
        document.getElementById("mensaje_usuario").innerHTML = "Usuario ya usado";
        estado[1] = "incorrecto";
        console.log("estado en usuario: "+ estado[3]);

      }else if(cantRepetidos==0){
            document.getElementById("mensaje_usuario").className = "";
            document.getElementById("mensaje_usuario").innerHTML = "";
            estado[1] = "correcto";
        }
    }console.log("estado en usuario: "+ estado[3]);
  }
}
var validarUsuarioBD = function (){
  //Nos vamos a comunicar con el servicio
  var jsonUsuarioBD = {};
  jsonUsuarioBD.usuario = document.getElementById("usuario").value;
  var req = new XMLHttpRequest();
  var url ="http://45.55.64.102/g4/usuario/usuario_repetido";
  req.open("POST",url,true);
  req.onreadystatechange = onUsuarioDevuelto;
  req.send(JSON.stringify(jsonUsuarioBD));
}
//Fin validaciones

//Inicio ajax
//Funcion que valida si todos los datos ingresados estan correctos
//Caso contrario, se manda el mensaje correspondiente
var crearUsuario = function() {
  var todoBien;
  for (var i = 0; i < estado.length; i++) {
    console.log("estado "+i+" :"+estado[i]);
    if (estado[i] == "correcto") {
      todoBien = true;
    }
    else{
      todoBien = false;
      break;
    }
  }

  if (todoBien == true) {
    //Nos vamos a comunicar con el servicio
    var jsonContra = {"texto":document.getElementById("pass").value};
    var req = new XMLHttpRequest();
    var url = "http://45.55.64.102/g4/cipher/encode";
    req.open("POST",url);
    req.onreadystatechange = respuestaContra;
    req.send(JSON.stringify(jsonContra));
  }
  else{
      document.getElementById("mensajeGeneral").innerHTML = "Faltan datos";
  }
}

      var respuestaContra = function(evt) {
        //Termino de la comunicacion
        if (evt.target.readyState == 4 && evt.target.status == 200) {
            jsonUsuarioNew.usuario = document.getElementById("usuario").value;
            jsonUsuarioNew.correo = document.getElementById("correo").value;
            jsonUsuarioNew.contrasenia = JSON.parse(evt.target.responseText).mensaje[0];
            //Inicio de comunicacion con el servicio guardarUsuario
            var req=new XMLHttpRequest();
            var url="http://45.55.64.102/g4/usuario/guardar";
            req.open("POST",url);
            req.onreadystatechange = respuestaGeneral;
            req.send(JSON.stringify(jsonUsuarioNew));
        }
      }

            var respuestaGeneral = function(evt) {
              //Termino de comunicacion
              //Si se crea correctamente, este te manda a la pantalla principal(login)
              //Caso contrario, se manda el mensaje respectivo
              if (evt.target.readyState == 4 && evt.target.status == 200) {
                  if (JSON.parse(evt.target.responseText).tipo_mensaje == "success") {
                    window.location = "login.html";
                  }
                  else{
                    document.getElementById("mensajeGeneral").innerHTML = "Faltan datos";
                  }
              }
            }
// Fin ajax

/*---------------------------------------------*/
//Funciones que permiten al usuario observar los departamentos
var listarDepartamentos = function(){
//Nos va a comunicar con el servicio
  var req = new XMLHttpRequest();
  var url = "http://45.55.64.102/g4/departamento/listar";
  req.open("GET", url, true);  //asincrona
  req.onreadystatechange = obtenerListaDepa;
  req.send();
};

var obtenerListaDepa = function(evt){
  //Termina la comunicacion
  document.getElementById("tablaDe").innerHTML="";
  if (evt.target.readyState == 4) {
    if (evt.target.status == 200) {
      var listaDep = JSON.parse(evt.target.responseText);
      for (var i = 0; i < listaDep.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.innerHTML = listaDep[i].nombre;
        var td2 = document.createElement("td");
        operaciones(listaDep[i].id, listaDep[i].nombre, td2,"departamento");
        tr.appendChild(td1);
        tr.appendChild(td2);
        //el primer hijo de td2 es el boton listar
        td2.firstChild.onclick = function(){
                                  document.getElementById("tablaDi").innerHTML="";
                                  var id = this.id.split("_");
                                  listarProvincias(id[2]);
                                };
        document.getElementById("tablaDe").appendChild(tr);
      }
      //Crear boton al final de la tabla para agregar
      document.getElementById("tabla1").removeChild(document.getElementById("tabla1").lastChild);
      var div = document.createElement("div");
      var button = document.createElement("button");
      button.id="agregar_departamento";
      button.onclick=agregar;
      button.className="btn btn-success form-control";
      button.innerHTML="Agregar departamento";
      div.appendChild(button);
      document.getElementById("tabla1").appendChild(div);

    }
  }
};

var listarProvincias = function(id){
  //Iniciar comunicacion con el servicio de listarProvincias
  var req = new XMLHttpRequest();
  var url = "http://45.55.64.102/g4/provincia/listar/"+id;
  req.open("GET", url, true);  //asincrona
  req.onreadystatechange = obtenerListaProv;
  req.send();
  indexD=id;
};

var obtenerListaProv = function(evt){
  //Termino de la comunicacion con el servicio
  document.getElementById("tablaP").innerHTML="";
  if (evt.target.readyState == 4) {
    if (evt.target.status == 200) {
      var listaProv = JSON.parse(evt.target.responseText);
      console.log(listaProv.length);
      for (var i = 0; i < listaProv.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.innerHTML = listaProv[i].nombre;
        var td2 = document.createElement("td");
        operaciones(listaProv[i].id, listaProv[i].nombre, td2,"provincia");
        tr.appendChild(td1);
        tr.appendChild(td2);
        //el primer hijo de td2 es el boton listar
        td2.firstChild.onclick = function(){
                                  var id = this.id.split("_");
                                  listarDistritos(id[2]);
                                };
        document.getElementById("tablaP").appendChild(tr);
      }
      //Crear boton al final de la tabla para agregar provincias
      document.getElementById("tabla2").removeChild(document.getElementById("tabla2").lastChild);
      var div = document.createElement("div");
      div.id="div1";
      var button = document.createElement("button");
      button.id="agregar_provincia"+"_"+indexD;
      button.className="btn btn-success form-control";
      button.onclick=agregar;
      div.appendChild(button);
      button.innerHTML="Agregar provincia";
      document.getElementById("tabla2").appendChild(div);
    }
  }
};

var listarDistritos = function(id){
  //Iniciar comunicacion con el servicio listarDistritos
    var req = new XMLHttpRequest();
    var url = "http://45.55.64.102/g4/distrito/listar/"+id;
    req.open("GET", url, true);  //asincrona
    req.onreadystatechange = obtenerListaDist;
    req.send();
    indexP=id;
};

var obtenerListaDist = function(evt){
  //Fin de la comunicacion con el servicio
  document.getElementById("tablaDi").innerHTML="";
  if (evt.target.readyState == 4) {
    if (evt.target.status == 200) {
      var listaDis = JSON.parse(evt.target.responseText);
      for (var i = 0; i < listaDis.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.innerHTML = listaDis[i].nombre;
        var td2 = document.createElement("td");
        operaciones(listaDis[i].id, listaDis[i].nombre, td2,"distrito");
        //la función listar es diferente para cada tabla
        tr.appendChild(td1);
        tr.appendChild(td2);
        td2.removeChild(td2.firstChild);//aca no hay función listar
        document.getElementById("tablaDi").appendChild(tr);
      }
      //Crear boton al final de la tabla para agregar distritos

      document.getElementById("tabla3").removeChild(document.getElementById("tabla3").lastChild);
      var div = document.createElement("div");
      div.id="div2";
      var button = document.createElement("button");
      button.id="agregar_distrito"+"_"+indexP;
      button.onclick=agregar;
      button.className="btn btn-success form-control";
      button.innerHTML="Agregar distrito";
      div.appendChild(button);
      document.getElementById("tabla3").appendChild(div);

    }
  }
};
//Creacion de botones de la base de datos por cada departamento, provincia y distrito creado
var operaciones = function(id, procedencia, td, string){
  //i listar
  var b1 = document.createElement("i");
  b1.className = "fa fa-search-plus";
  b1.setAttribute("aria-hidden","true");
  b1.id = 1+"_"+procedencia+"_"+id+"_"+string;
  //i editar
  var b2 = document.createElement("i");
  b2.className = "fa fa-pencil";
  b2.setAttribute("aria-hidden","true");
  b2.id = 2+"_"+procedencia+"_"+id+"_"+string;
  b2.onclick = editar;
  //i eliminar
  var b3 = document.createElement("i");
  b3.className = "fa fa-remove";
  b3.id = 3+"_"+procedencia+"_"+id+"_"+string;
  b3.setAttribute("aria-hidden","true");
  b3.onclick = eliminar;

  td.appendChild(b1);
  td.appendChild(b2);
  td.appendChild(b3);
};

//Funcion que permite agregar un departamento, provincia o distrito
var agregar = function(evt){
  //se divide de acuedo el id puesto en cada boton que contiene información de cada celda
  //al momento de tocar el boton de agregar, se crea un tr con sus dos celdas respectivas
  //La primera celda tendrá el input
  //En la segunda celda, se tendra los iconos de "plus" y "remove"
  var id = evt.target.id.split("_");
  var input = document.createElement("input");
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var b2 = document.createElement("i");
  b2.setAttribute("aria-hidden","true");//plus
  b2.className = "fa fa-plus";
  var b3 = document.createElement("i");
  b3.className = "fa fa-remove";//remove
  b3.setAttribute("aria-hidden","true");
  td1.appendChild(input);
  tr.appendChild(td1);
  tr.appendChild(td2);
  td2.appendChild(b2);
  td2.appendChild(b3);
  //de acuerdo al tipo de procedencia, se agrega a su tabla
  if (id[1] == "departamento") {
      document.getElementById("tablaDe").appendChild(tr);
  }else if (id[1] == "provincia") {
      document.getElementById("tablaP").appendChild(tr);
  }else{
    document.getElementById("tablaDi").appendChild(tr);
  }
  //si se le remove, se elimina el "tr" que se creo desde un inicio
  b3.onclick = function(evt){
                  var posEliminar = evt.target.parentElement.parentElement;
                  var pos = evt.target.parentElement.parentElement.parentElement;
                  pos.removeChild(posEliminar);
                };
  //se agrega la función
  b2.onclick = function(evt){
                //se manda la solicitud
                var req = new XMLHttpRequest();
                var url = "http://45.55.64.102/g4/"+id[1]+"/crear";
                req.open("POST", url, true);  //asincrona
                //de acuerdo al tiṕo de procedencia, se cambia el mensaje
                if (id[1] == "departamento") { //mensaje para departamento
                  var mensaje = {
                                   "nombre" : input.value
                                };
                document.getElementById('showDep').className="creado";
                document.getElementById('showDep').innerHTML="Se ha creado un departamento";
                //mensaje para distrito y provincia
              }else if (id[1] == "provincia") {
                  var mensaje = {
                                   "departamento_id" : indexD,
                                   "id" : 0,
                                   "nombre" : input.value
                                };
                document.getElementById('showProv').className="creado";
                document.getElementById('showProv').innerHTML="Se ha creado una provincia";
                }else{
                  var mensaje = {
                                   "provincia_id" : indexP,
                                   "id" : 0,
                                   "nombre" : input.value
                                };
                document.getElementById("showDist").className="creado";
                document.getElementById('showDist').innerHTML="Se ha creado un distrito";

                }
                req.send(JSON.stringify(mensaje));
                //en el readyState se llama a la función listar de cada tabla de acuerod a su procedencia
                req.onreadystatechange = function(evt){
                                          // se valida
                                          if (evt.target.readyState == 4) {
                                            if (evt.target.status == 200) {
                                              //se divide de acuerdo a su procedencia
                                              if (id[1] == "departamento") {
                                                listarDepartamentos();
                                              }else if (id[1] == "provincia") {
                                                listarProvincias(indexD);
                                              }else{
                                                listarDistritos(indexP);
                                              }
                                            }
                                          }
                                        };

              };
};

//Funcion que permite editar un departamento, provincia o distrito
var editar = function (evt){
  //cuando se le da onclick en editar, se agrega un input a la primera celda
  var input = document.createElement("input");
  var celda = evt.target.parentElement.parentElement.firstChild;
  var id=evt.target.id.split("_");
  celda.innerHTML = "";
  celda.appendChild(input);
  //se agrega el evento keypress para registrar todo los input del teclado
  input.addEventListener("keypress",
                        function(evt){
                          //cuando se ingresa el boton "enter" puede ejecutar el función
                          if(evt.keyCode == 13){
                            var nuevoNombre = this.value;
                            celda.innerHTML = "";
                            celda.innerHTML = nuevoNombre;
                            var req = new XMLHttpRequest();
                            var url = "http://45.55.64.102/g4/"+id[3]+"/editar";
                            req.open("POST", url, true);  //asincrona
                            //se envía el mensaje
                            var mensaje = {
                          	                 "id" : id[2], //id del boton que contiene la celda para buscar en la base de datos
                                             "nombre" : nuevoNombre
                                          };
                            req.send(JSON.stringify(mensaje));
                            //se llama a la función listar
                            req.onreadystatechange = function(evt){
                                                      if (evt.target.readyState == 4) {
                                                        if (evt.target.status == 200) {

                                                          if (id[3] == "departamento") {
                                                            listarDepartamentos();
                                                            document.getElementById('showDep').className="creado";
                                                            document.getElementById('showDep').innerHTML="Se ha modificado un departamento";
                                                          }else if (id[3] == "provincia") {
                                                            listarProvincias(indexD);
                                                            document.getElementById('showProv').className="creado";
                                                            document.getElementById('showProv').innerHTML="Se ha modificado una provincia";
                                                          }else{
                                                            listarDistritos(indexP);
                                                            document.getElementById('showDist').className="creado";
                                                            document.getElementById('showDist').innerHTML="Se ha modificado un distrito";
                                                          }
                                                        }
                                                      }
                                                    };

                          }
                        }
        );
};
//Funcion que permite eliminar un departamento, provincia o distrito
var eliminar = function(evt){
  var req = new XMLHttpRequest();
  var id=evt.target.id.split("_");
  var url = "http://45.55.64.102/g4/"+id[3]+"/eliminar";
  req.open("POST", url, true);  //asincrona
  console.log(id[2]);
  var mensaje = {
	                 "id" : id[2]
                };
                //se crea el mensaje de envío
  req.send(JSON.stringify(mensaje));
  req.onreadystatechange = function(evt){
                            if (evt.target.readyState == 4) {
                              if (evt.target.status == 200) {
                                //cuando se haya concretado la comunicación exitosamente
                                console.log(id[3]);
                                //se valida el tipo eliminación
                                if (id[3] == "departamento") {
                                  document.getElementById("tablaP").innerHTML="";
                                  document.getElementById("tablaDi").innerHTML="";
                                  //se borra algunos botones al eliminar; para dar forma
                                  if (document.getElementById("div1") != undefined && document.getElementById("div2") != undefined) {
                                    document.getElementById("div1").innerHTML="";
                                    document.getElementById("div2").innerHTML="";
                                  }else if (document.getElementById("div1") != undefined) {
                                    document.getElementById("div1").innerHTML="";
                                  }else if (document.getElementById("div2") != undefined) {
                                    document.getElementById("div1").innerHTML="";
                                  }
                                  //se llama a la función que llama a la lista de departamentos
                                  listarDepartamentos();
                                  document.getElementById('showDep').className="creado";
                                  document.getElementById('showDep').innerHTML="Se ha eliminado un departamento";
                                  //se valida si es provincia
                                }else if (id[3] == "provincia") {
                                  document.getElementById("tablaDi").innerHTML="";
                                  document.getElementById("div2").innerHTML="";
                                  listarProvincias(indexD);
                                  document.getElementById('showProv').className="creado";
                                  document.getElementById('showProv').innerHTML="Se ha eliminado una provincia";
                                }else{
                                  //se valida si es distrito
                                  listarDistritos(indexP);
                                  document.getElementById('showDist').className="creado";
                                  document.getElementById('showDist').innerHTML="Se ha eliminado un distrito";
                                }
                              }
                            }
                          };

};


//Funcion main que habilita las demas funciones
var main = function() {
  if (document.getElementById("ingresar") != null) {
    botonesLogin();
  }
  if (document.getElementById("check") != null) {
    botonesCrearUsuario();
  }
if(document.getElementById('tablaP')!=null){
  listarDepartamentos();

}

}
//Llamada de la funcion main cuando la pagina web es cargada
window.onload = main;
