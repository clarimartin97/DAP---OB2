const API_URL = "https://api.mercadolibre.com/";
const SITES_URL = API_URL + "sites/MLU/";
const ITEMS_URL = API_URL + "items/";
const USER_URL = "http://api.bitxia.tech/dapps/users/";

const $nav = document.querySelector("ion-nav");
const $menu = document.querySelector("ion-menu");
let productos = null


///FUNCIONES


function navegar(page) {
  $nav.push(page);
}

function resetearNavegacion() {
  $nav.popToRoot();
}

function nuevaNavegacion(page) {
  $nav.setRoot(page);
}

function navegarMenu(page) {
  nuevaNavegacion(page);
  cerrarMenu();
}

function cerrarMenu() {
  $menu.close();
}

function handleInput(event) {
  cargarListadoProductos(event.target.value.toLowerCase())
}
///PRODUCTOS
function cargarListadoProductos(busqueda = "", filtros = null) {
  document.querySelector("#buscador").disabled = true;
  document.querySelector("page-listado #listado-productos").innerHTML = ""

  let endpoint = SITES_URL + `search?q=${busqueda}&official_store_id=456`
  if(filtros != null) {
    endpoint += `&${filtros}`
  }
  console.log(endpoint)
  document.querySelector("#loader").style.display = "block";
  fetch(endpoint)
    .then((res) => res.json())
    .then((apiRes) => {
      productos = apiRes.results;
      mostrarProductos();
      console.log(apiRes)
    })
    .catch(console.error);

}

async function mostrarProductos() {
  let html = ""
  for (let i = 0; i < productos.length; i++) {
    let producto = productos[i]
    await fetch(ITEMS_URL + producto.id)
      .then((res) => res.json())
      .then((apiRes) => {
        producto.pictures = apiRes.pictures
        producto.available_quantity = apiRes.available_quantity
        producto.sold_quantity = apiRes.sold_quantity
        producto.warranty = apiRes.warranty

          html += /*html*/ `
          <ion-card button onclick="ampliarProducto(${i})">
            <img src="${producto.pictures[0].url}" />
            <ion-card-header>
              <ion-card-subtitle> $  ${producto.price}</ion-card-subtitle>
              <ion-card-title>${producto.title}</ion-card-title>
            </ion-card-header>
          </ion-card>
      `;
      })
  }
  document.querySelector("#loader").style.display = "none";

  const listadoHtml = document.querySelector("page-listado #listado-productos")
  if (listadoHtml != null) {
    listadoHtml.innerHTML = html
  }
  document.querySelector("#buscador").disabled = false;
}

function ampliarProducto(i) {
  let producto = productos[i]
  $nav.push("page-producto-ampliado", { producto })
}

///REGISTRO

function registrarUsuario() {
  let inputRegistroUsuario = document.querySelector("#ingresaEmail").value;
  let inputRegistroContraseña = document.querySelector("#crearContraseña").value;

  /*   if (nuevoNombreIngresado === null || nuevoNombreIngresado.length < 4) {
      alert("Tu usuario debe contener al menos 3 letras");
      return;
  }
  if (passIngresada === null || passIngresada.length < 4) {
      alert("Tu contraseña debe contener al menos 3 letras");
      return;
  
  } */
  fetch(USER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "REGISTER",
      email: inputRegistroUsuario,
      pass: inputRegistroContraseña
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      console.log(datos)
      if (datos.status !== 201) {
        alert(datos.message);
        return
      }
      localStorage.setItem("emailUsuario", inputRegistroUsuario)
      localStorage.setItem("contraseñaUsuario", inputRegistroContraseña)
      localStorage.setItem("idUsuario", datos.user)
      ////
      nuevaNavegacion('page-listado')

    })
}


///INICIO DE SESIÓN

function iniciarSesion() {
  let inputIngresoUsuario = document.querySelector("#ingresoEmail").value;
  let inputIngresoContraseña = document.querySelector("#ingresoContraseña").value;
  fetch(USER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "LOGIN",
      email: inputIngresoUsuario,
      pass: inputIngresoContraseña
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      console.log(datos)
      if (datos.status !== 200) {
        alert(datos.message);
        return
      }
      localStorage.setItem("emailUsuario", inputIngresoUsuario)
      localStorage.setItem("contraseñaUsuario", inputIngresoContraseña)
      localStorage.setItem("idUsuario", datos.user)
      ////
      nuevaNavegacion('page-listado')

    })
}


/// CERRAR SESIÓN

function cerrarSesion() {
  localStorage.clear()
  ///limpiar carrito
  document.querySelector("#menusin").close()
  nuevaNavegacion('page-onboarding')
}


//// MANTENER INICIADA UNA SESION

function sesionActiva() {
  let usuarioEmail = localStorage.getItem("emailUsuario");
  let usuarioContraseña = localStorage.getItem("contraseñaUsuario");
  let usuarioId = localStorage.getItem("idUsuario");

  if (usuarioEmail !== null && usuarioContraseña !== null && usuarioId !== null) {
    nuevaNavegacion('page-listado')
  }
}


///FILTROS DE PRODUCTOS

function filtroProductos(categoria, filtro){
  let busqueda = document.querySelector("#buscador").value.toLowerCase()
  let filtros = `${categoria}=${filtro}`
  cargarListadoProductos(busqueda, filtros)
}
