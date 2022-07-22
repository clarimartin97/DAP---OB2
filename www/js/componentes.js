customElements.define(
  "page-onboarding",
  class extends HTMLElement {
    connectedCallback() {
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
  "page-registro",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = document.getElementById("page-registro.html").innerHTML;
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
      
      </ion-card-header>
    </ion-card-header>
  </ion-card>
</ion-content>    
      `;
    }  /* averiguar por que el available quantity y el sold quantity da numeros que no parecen ser los correctos!! */
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
