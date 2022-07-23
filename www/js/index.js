
const API_URL = "https://api.mercadolibre.com/";
const SITES_URL = API_URL + "sites/MLU/";
const ITEMS_URL = API_URL + "items/";
const USER_URL = "http://api.bitxia.tech/dapps/users/";

const $nav = document.querySelector("ion-nav");
const $menu = document.querySelector("ion-menu");
const handlerOutput = document.querySelector('#handlerResult');
const roleOutput = document.querySelector('#roleResult');
let productos = null
let producto = null
let carrito = []
let comprandoCarrito = false


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
  if (filtros != null) {
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
  producto = productos[i]
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
  carrito = []
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

function filtroProductos(categoria, filtro) {
  let busqueda = document.querySelector("#buscador").value.toLowerCase()
  let filtros = `${categoria}=${filtro}`
  cargarListadoProductos(busqueda, filtros)
}

// CARRITO

function agregarAlCarrito() {
  console.log("hola")
  let cantidad = document.querySelector("#cantidadSeleccionada").value;
  let productoCarritoNuevo = new Producto(producto.id, producto.pictures[0].url, producto.title, producto.price, cantidad)
  carrito.push(productoCarritoNuevo);
  console.log(carrito)
  presentAlert()
}

class Producto {
  constructor(idP, fotoP, nombreP, precioP, cantidadP) {
    this.id = idP;
    this.foto = fotoP;
    this.nombre = nombreP;
    this.precio = precioP;
    this.cantidad = cantidadP;
  }
}


function presentAlert() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Tu producto se ha agregado con éxito!';
  alert.buttons = [
    {
      text: 'Seguir comprando',
      role: 'Seguir comprando',
      handler: () => {
        navegar('page-listado')
      }
    },
    {
      text: 'Ir a Carrito',
      role: 'Ir a Carrito',
      handler: () => {
        navegar('page-carrito')

      }
    }
  ];

  document.body.appendChild(alert);
  alert.present();

}

function comprarProducto() {
  comprandoCarrito = false
  navegar('page-tarjeta')
}

function pagoElegido() {
console.log("hola")
  let finalizar = document.querySelector("#finalizarPago");
  let datosDeTarjeta = document.querySelector("#completarDatosTarjeta");
  let escanearCodigo = document.querySelector("#escanearCodigo");
  let selPago = document.querySelector("#selPago").value;

  if (selPago === "debito" || selPago === "credito") {
    datosDeTarjeta.style.display = "block"
    escanearCodigo.style.display = "none"
    finalizar.style.display = "block"
    
  }
  else {

    datosDeTarjeta.style.display = "none"
    escanearCodigo.style.display = "block"
    finalizar.style.display = "block"
  }
}

function finalizarPago() {
  if(comprandoCarrito){
    carrito = []
  }
  else {
    producto = null
  }
  nuevaNavegacion('page-pago-finalizado')

}