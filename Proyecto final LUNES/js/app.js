
/* --------------------------  Selectors   --------------------------------------*/

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const listaProductos = document.querySelector("#lista-productos");
const vaciarCarrito = document.querySelector("#vaciar-carrito");

let articulosCarrito = [];

let dataProductos;


/* ---------------------------- Listeners ----------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {
	articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
	insertarCarritoHTML();

/*--------------   Llamada a BD local con Fetch - Async Function   ---------------*/
	cargarBd();

});

listaProductos.addEventListener("click", agregarProducto);

$("#carrito").click(carrito, quitarProducto);

$("#vaciar-carrito").click(vaciarCarrito, borrarCarrito);


/* ---------------------------------   Funciones   ------------------------------------*/


/* -------------- llamada a BD local con Fetch - async Function  ----------------------*/
async function consultarBd() {
	const resultado = await fetch("/js/api.json");
	let datos = await resultado.json();
	dataProductos = datos;
}

function cargarBd() {
	consultarBd();
}


function agregarProducto(e) {
	e.preventDefault();

	if (e.target.classList.contains("agregar-carrito")) {
		const productoSeleccionado = e.target.parentElement.parentElement;
		obtenerDatos(productoSeleccionado);
	}
}

function borrarCarrito() {
	limpiarCarrito();
	articulosCarrito = [];
	guardarStorage();
}

function quitarProducto(e) {
	e.preventDefault();

	if (e.target.classList.contains(`borrar-producto`)) {
		Swal.fire({
			position: "top-center",
			icon: "error",
			title: "El producto fue quitado",
			showConfirmButton: false,
			timer: 1700,
		});
		const productoId = e.target.getAttribute("data-id");
		articulosCarrito = articulosCarrito.filter((producto) => producto.id != productoId);
		insertarCarritoHTML();
		guardarStorage();
	}
}

function obtenerDatos(producto) {
	const productoAgregado = {
		nombre: producto.querySelector("h4").textContent,
		precio: producto.querySelector(".precio span").textContent,
		id: producto.querySelector("a").getAttribute("data-id"),
		cantidad: 1,
	};
	function comprobar() {
		Swal.fire({
			position: "top-center",
			icon: "success",
			title: "El producto fue agregado al carrito",
			showConfirmButton: false,
			timer: 1500,
		});
		const existe = articulosCarrito.some((producto) => producto.id == productoAgregado.id);
		if (existe) {
			/* Producto ya existente */
			const productos = articulosCarrito.map((producto) => {
				if (producto.id === productoAgregado.id) {
					producto.cantidad++;
					return producto;
				} else{
					return producto;
				}
			});
			articulosCarrito = [...productos];
		} else {
			/* Agrego el producto al carrito */
			articulosCarrito.push(productoAgregado);
		}
	}
	comprobar();
	insertarCarritoHTML();
	guardarStorage();
}

function guardarStorage() {
	localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function insertarCarritoHTML() {
	/* Borra el contenido del carrito */
	limpiarCarrito();



	/* Inserta los productos del carrito en el HTML */
	articulosCarrito.forEach((producto) => {
		
		const { nombre, precio, cantidad, id } = producto;

		const row = document.createElement("tr");
		row.innerHTML = `
			<td>
				${nombre}
			</td>
			<td>
				${precio}
			</td>
			<td>
				${cantidad}
			</td>
			<td>
				<a href="#" class="" > <i class="far fa-trash-alt borrar-producto rojo" data-id="${id}"></i> </a>
			</td>
		`;

		contenedorCarrito.appendChild(row);
	});
}

function limpiarCarrito() {
	while (contenedorCarrito.firstChild) {
		contenedorCarrito.removeChild(contenedorCarrito.firstChild);
	}
}

function limpiarProductos() {
	while (listaProductos.firstChild) {
		listaProductos.removeChild(listaProductos.firstChild);
	}
}




/* ----------- Cuenta Regresiva Sorteo  ------------------------*/
$('.contador').countdown('2023/02/20 10:00:00', function(event){
    $('#dias').html(event.strftime('%D'));
    $('#horas').html(event.strftime('%H'));
    $('#minutos').html(event.strftime('%M'));
    $('#segundos').html(event.strftime('%S'));
});