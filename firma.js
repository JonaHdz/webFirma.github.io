// obtenemos referencias a los elemmentos htm
const canvas = document.querySelector('canvas');
const form = document.querySelector('.firma-pad-form');
const botonLimpiar = document.querySelector('.boton-limpiar');
const botonImagen = document.querySelector('.boton-imagen');
const botonContrato = document.querySelector('.boton-contrato');

// obtenemos el contexto del canvas oara dubujar en 2
const ctx = canvas.getContext('2d');
// bandera que indica si ta coomenzamos a presionar el boton ddel mouse sin soltarlo
let modoEscritura = false;
// varibales para guaardar la posicion del cursor
let xAnterior = 0, yAnteerior = 0, xActual = 0, yActual = 0;
// variables de estilo
const COLOR = 'red';
const GROSOR = 2;

// bonton enviar del form
form.addEventListener('submit', (e) => {
    // previene que se envie el formulario
    e.preventDefault();

    // borramos la imagen anterior par aponer la nueva a enviar
    const resultadoContenedor = document.querySelector('.firma-resultado-contenedor');
    const imagenAnterior = document.querySelector('.firma-imagen');
    if (imagenAnterior)
        imagenAnterior.remove();

    // creamos la nueva imagen con lo que tenga el canvas
    const imagenURL = canvas.toDataURL();
    const imagen = document.createElement('img');
    imagen.src = imagenURL;
    imagen.height = canvas.height;
    imagen.width = canvas.width;
    imagen.classList.add('.firma-imagen');
    // agregamos la imagen al html
    resultadoContenedor.appendChild(imagen);
    // limpiamos el cavas
    limpiarPad();
});


const limpiarPad = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
limpiarPad();


// evento clic del link limpiar
botonLimpiar.addEventListener('click', (e) => {
    // previene que se ejcute el link
    e.preventDefault();
    limpiarPad();
});

// clic para descargar laimagen de la firm
botonImagen.addEventListener('click', (e) => {
    // previene que se ejecute el link
    e.preventDefault();

    const enlace = document.createElement('a');
    // titulo de la imagen
    enlace.download = "Firma.png";
    // convertir la firma a base64 y ponerlo en el enlace
    enlace.href = canvas.toDataURL();
    // clic en el enlace para descargar
    enlace.click();
});

// esta funcion es para ser accedida pro una ventana hijo
window.obtenerImagen = () => {
    return canvas.toDataURL();
};

botonContrato.addEventListener('click', (e) => {
    // previene que se ejecute el link
    e.preventDefault();
    // abre una nueva ventana hija
    const ventana = window.open('contrato.html');
});

//FALOS EN ESTE METODO
// obtiene la posicion del cursos
const obtenerPosicionCursor = (e) => {
    positionX = e.clientX - e.target.getBoundingClientRect().left;
    positionY = e.clientY - e.target.getBoundingClientRect().top;
    return [positionX, positionY];
}

// añ inciar el trazado, dibujamos un puntito
const onClicOToqueIniciado = (e) => {
    modoEscritura = true;
    [xActual, yActual] = obtenerPosicionCursor(e);

    ctx.beginPath();
    ctx.fillStyle = COLOR;
    ctx.fillRect(xActual, yActual, GROSOR, GROSOR);
    ctx.closePath();
}

// al movel el dedo o el mouse sin deoegarlo dibujamos las lineas
const OnMouseODedoMovido = (e) => {
    if (!modoEscritura) return;

    let target = e;
    if (e.type.includes("touch")) {
        // solo un dedo
        target = e.touches[0];
    }
    xAnterior = xActual;
    yAnteerior = yActual;
    [xActual, yActual] = obtenerPosicionCursor(target);
    ctx.beginPath();
    ctx.lineWidth = GROSOR;
    ctx.strokeStyle = COLOR;
    ctx.moveTo(xAnterior,yAnteerior);
    ctx.lineTo(xActual, yActual)
    ctx.stroke();
    ctx.closePath();
}

// al levnatar el deodo o el MouseEvent,dejamos de dibujar lineas
function OnClicDedoLevantado() {
    modoEscritura = false;
}
// eventos al inciar el trazado
['mousedown', 'touchstart'].forEach(nombreEventos => {
    canvas.addEventListener(nombreEventos, onClicOToqueIniciado, { passive: true });
});

// eventos al movel el mouse o dedo en el trazado
['mousemove', 'touchmove'].forEach(nombreEventos => {
    canvas.addEventListener(nombreEventos, OnMouseODedoMovido, { passive: true });
});

// al levantar el dedo o el mouse
['mouseup', 'touchend'].forEach(nombreEventos => {
    canvas.addEventListener(nombreEventos, OnClicDedoLevantado, { passive: true });
});