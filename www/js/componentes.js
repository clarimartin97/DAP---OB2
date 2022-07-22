customElements.define(
  "page-onboarding",
  class extends HTMLElement {
    connectedCallback() {
      sesionActiva()
      this.innerHTML = document.getElementById("page-onboarding.html").innerHTML;
    }
  }
);

customElements.define(
  "page-login",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-login.html").innerHTML;

    }
  }
);

customElements.define(
  "page-tarjeta",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-tarjeta.html").innerHTML;
      document.querySelector("#completarDatosTarjeta").style.display = "none"
      document.querySelector("#escanearCodigo").style.display = "none"
      document.querySelector("#selPago").addEventListener("ionChange", pagoElegido)

    }
  }
);


customElements.define(
  "page-registro",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-registro.html").innerHTML;
    }
  }
);

customElements.define(
  "skeleton-producto",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById(
        "skeleton-producto.html"
      ).innerHTML;
    }
  }
);
customElements.define(
  "page-producto-ampliado",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML =/*html*/`
  <ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-buttons slot="end">
      <ion-menu-button menu="menu-principal"></ion-menu-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <h1 class="ion-padding-horizontal">${this.producto.title}</h1>
  <ion-card>
    <img src="${this.producto.pictures[0].url}" />
    <ion-card-header>
      <ion-card-title> $ ${this.producto.price}</ion-card-title>
      <ion-card-title>${this.producto.title}</ion-card-title>
      <ion-card-p>Disponibles a la venta: ${this.producto.available_quantity}</ion-card-p>
      <ion-card-p>Cantidad vendida: ${this.producto.sold_quantity}</ion-card-p>
      <ion-card-header>
      <ion-card-title> ${this.producto.warranty}</ion-card-title> 
      <ion-item>
      <ion-label>Cantidad:</ion-label>
      <ion-input id="cantidadSeleccionada" value="1" min="1" max="${this.producto.available_quantity}" type="number"></ion-input>
    </ion-item>
      <ion-button color="danger" onclick="agregarAlCarrito()">Agregar al carrito</ion-button>
      <ion-button onclick="comprarProducto()" >Comprar ahora</ion-button>
      </ion-card-header>
    </ion-card-header>
  </ion-card>
</ion-content>    
      `;
    }
  }
);


customElements.define(
  "page-usuario",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-usuario.html").innerHTML;
    }
  }
);

customElements.define(
  "page-carrito",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-carrito.html").innerHTML;
    }
  }
);

customElements.define(
  "page-listado",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-listado.html").innerHTML;


      const buscador = document.querySelector("#buscador");

      buscador.addEventListener("search", handleInput)
      cargarListadoProductos();
    }
  }
);
