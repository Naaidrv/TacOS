//Declaración de constantes a utilizar en las funciones de flecha
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const tempcard = document.getElementById('tempcard').content
const tempfoo = document.getElementById('tempfoo').content
const tempcarrito = document.getElementById('tempcarrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

// Eventos
// El evento DOMContentLoaded (Solo se ejecuta una vez que el .html se haya terminado de cargar)
document.addEventListener('DOMContentLoaded', e => { fetchData() });
//Llamar a la función que agrega un platillo 
cards.addEventListener('click', e => { addCarrito(e) });
//Llamar a la que agrega o elimina un mismo platillo del carrito
items.addEventListener('click', e => { btnAE(e) })

// Traer productos de la API creada con el nombre 'apic'
const fetchData = async () => {
    const res = await fetch('apic.json');
    const data = await res.json()
   // console.log(data)
    printCards(data)
}

//Imprimir los datos obtenidos de la API en las 'Cards'
const printCards = data => {
    data.forEach(platillo => {
        //Se llama a la clase del .html con el "id=templateCard" y con query selector se seleccionan los elementos
        //Que mostraran cada dato traido de la API
        tempcard.querySelector('h5').textContent = platillo.title
        tempcard.querySelector('h6').textContent = platillo.desc
        tempcard.querySelector('p').textContent = platillo.precio
        tempcard.querySelector('img').setAttribute("src", platillo.thumbnailUrl)
        tempcard.querySelector('button').dataset.id = platillo.id
        tempcard.querySelector('#tit').textContent = platillo.title
        tempcard.querySelector('#descrip').textContent = platillo.desc
        tempcard.querySelector('#image').setAttribute("src", platillo.thumbnailUrl)
        const clone = tempcard.cloneNode(true)
        //Creación de un nodo para ayudar al DOM 
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Función para agregar losplatillos al carrito 
const addCarrito = e => {
    if (e.target.classList.contains('btn-success')) {
        // console.log(e.target.dataset.id)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//Función para leer los platillo agregados 
const setCarrito = item => {
    // console.log(item)
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
     console.log(producto)
     //Recorrer los platillos en caso de que se siga comprando
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    printCarrito()
}

//Nuevamente se leen los platillos agregados para imprimirlos dentro de la tabla
const printCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(platillos => {
        tempcarrito.querySelectorAll('td')[0].textContent = platillos.title
        tempcarrito.querySelectorAll('td')[1].textContent = platillos.cantidad
        tempcarrito.querySelector('span').textContent = platillos.precio * platillos.cantidad
        //Botones de acción
        tempcarrito.querySelector('.btn-success').dataset.id = platillos.id
        tempcarrito.querySelector('.btn-danger').dataset.id = platillos.id

        const clone = tempcarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    printFooter()
}

//Para imprimir el mensaje de texto en caso de que el carrito este vacio
const printFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Tu carrito está vacio :(</th>
        `
        return
    }
    
    //Suma de la cantidad de platillos agregados junto el monto a pagar
    const Cantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const Precio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    //Muestra el precio en la consola
    console.log(Precio)

    tempfoo.querySelectorAll('td')[0].textContent = Cantidad
    tempfoo.querySelector('span').textContent = Precio

    const clone = tempfoo.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //Botón para quitar todo los platillos agregados, regresa el carrito a un "array" vacio
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        printCarrito()
    })
}

//Boton para agregar el mismo platillo
const btnAE = e => {
    if (e.target.classList.contains('btn-success')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        printCarrito()
    }
//Sentencia en caso de que se de "click" en eliminar, quitar el mismo platillo del carrito
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        printCarrito()
    }
    e.stopPropagation()
}