/** Variables Globales */
let USUARIOS ={
    admin: "admin123",
    usuario: "1234",
    demo: "demo"
};

let usuarioActual = null;
let peliculasGlobales = [];
let peliculaEnEdicion= null;

/** Inicializacion de App */
document.addEventListener("DOMContentLoaded", ()=>{
    inicializarApp(); //cargar app
    eventos(); //cargar eventos
})

function inicializarApp(){

    //cargar usuarios registrados desde localStorage
     cargarUsuariosRegistrados();
    //verificar usuario logeado 
    let userLogged = localStorage.getItem("usuarioLogueado");
    if(userLogged){
        usuarioActual = JSON.parse(userLogged);
        mostarDashboard();
    }
    else{
        mostarLogin();
    }

    //cargar peliculas de ejemplo
    if(!localStorage.getItem("peliculas")){
        cargarDatosEjemplo();
    }
    
}

function cargarUsuariosRegistrados(){
    //obtener usuarios registrados desde localStorage
    let usuarioRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados"));
       if(usuarioRegistrados){
        Object.assign(USUARIOS, usuarioRegistrados);
       }

}

/** eventos del usuario */
function eventos(){
    //boton login
    document.querySelector("#formLogin").addEventListener("submit", login);

    //boton logout
    document.querySelector("#btnSalir").addEventListener("click", logout);

    //boton register
    document.querySelector("#formRegistro").addEventListener("submit", register);

    //boton guardar pelicula
    document.querySelector("#btnGuardarPelicula").addEventListener("click", guardarPelicula);

    //buscar peliculas
    document.querySelector("#inputBuscar").addEventListener("input", buscarPeliculas);
    
    //filtrar por genero
    document.querySelector("#selectGenero").addEventListener("change", buscarPeliculas);

}

    

function login(e){
    e.preventDefault();
        let user = document.querySelector("#inputUser").value;
        let password = document.querySelector("#inputPassword").value;
        if(USUARIOS[user] && USUARIOS [user] === password){
            usuarioActual = user;
            localStorage.setItem("usuarioLogueado",JSON.stringify(user));
            mostarDashboard();
            document.querySelector("#formLogin").reset();
        }

        else{
            alert ("El usuario no existe");
        }
}

//mostrarDashboard
function mostarDashboard(){
    document.querySelector("#loginSection").style.display ="none";
    document.querySelector("#btnEntrar").style.display ="none";
    document.querySelector("#mainContent").style.display ="block";
    document.querySelector("#btnSalir").style.display ="block";
    document.querySelector("#btnAgregar").style.display ="block";
    document.querySelector(".userLogged").textContent = usuarioActual;

    /**cargar peliculas */
    cargarPeliculas();
}

function mostarLogin(){
    document.querySelector("#loginSection").style.display ="flex";
    document.querySelector("#btnEntrar").style.display ="block";
    document.querySelector("#mainContent").style.display ="none";
    document.querySelector("#dashboard").style.display ="none";
    document.querySelector("#btnSalir").style.display ="none";
    document.querySelector("#btnAgregar").style.display ="none";
}
function logout(){
    let confirmacion = confirm("¿Desea cerrar sesión?");
    if(confirmacion){
        usuarioActual = null;
        localStorage.removeItem("usuarioLogueado");
        mostarLogin();
        document.querySelector("#formLogin").reset();
    }

}

/** Registro de usuarios */
function register(e){
    e.preventDefault();
    let nombre = document.querySelector("#inputNombre").value.trim();
    let email = document.querySelector("#inputEmail").value.trim();
    let usuario = document.querySelector("#inputUserReg").value.trim();
    let password = document.querySelector("#inputPasswordReg").value.trim();
    let confirmPassword = document.querySelector("#inputConfirmPassword").value.trim();

    //validaciones

    if(nombre && email && usuario && password && confirmPassword){
        if(USUARIOS[usuario]){
            alert("El usuario ya existe, por favor elija otro");
            return;}
        USUARIOS[usuario] =password;
        //guardar en localStorage
        let usuarioRegistrado = JSON.parse(localStorage.getItem("usuariosRegistrados")) || {};
        usuarioRegistrado[usuario] = password;
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarioRegistrado));
        //exito
        alert("Registro exitoso " + usuario+ "✅");
    
        //limpiar el formulario
        document.querySelector("#formRegistro").reset();

        //tab se dirija al login
        document.querySelector("#login-tab").click();
        
    }
    

    else{
        alert("Por favor, complete todos los campos");
        return;}

    if(usuario.length < 4 ){
        alert("El usuario debe tener al menos 4 caracteres");
        return; }

    if(password.length < 6 ){
        alert("La contraseña debe tener minimo 6 caracteres");
        return; }

    if(password !== confirmPassword){ 
        alert("Las contraseñas no coinciden");
        return; }

}

/** Logica de las peliculas  */

/** peliculas de ejemplo */
function cargarDatosEjemplo(){
    let peliculasEjemplo = [
    {
        id: 1,
        titulo: "Y donde estan las rubias?",
        genero: "Comedia",
        director: "Keenen Ivory Wayans",
        ano: 2004,
        calificacion: 10,
        descripcion: "Dos agentes del FBI se infiltran en una escuela privada para investigar la desaparición de dos hermanas gemelas.",
        imagen: "https://m.media-amazon.com/images/S/pv-target-images/34b2d39ed55f6df09da8871919da835dba6e86d68af01079ab75635836f00200.jpg"
        
          }
    ];

    /** guardar las peliciulas en localStorage */
 localStorage.setItem("peliculas", JSON.stringify(peliculasEjemplo));
}

/**cargar peliculas de ejemplo */
function cargarPeliculas(){
    let peliculas = localStorage.getItem("peliculas");
    peliculasGlobales = peliculas ? JSON.parse(peliculas) : [];

    renderizarGrid(peliculasGlobales);
    renderizarSlider();
}

/** renderizar las películas */
function renderizarGrid(pelis){
    let grid = document.querySelector("#gridPeliculas");
    let sinResultados= document.querySelector("#sinResultados");
{}
    if(pelis.length === 0){
        grid.innerHTML = "";
        sinResultados.style.display = "block";
        return;
    }
    sinResultados.style.display = "none";
    grid.innerHTML = pelis.map( p =>
        `<div class="col-md-6 col-lg-4 col-xl-3"> 
        <div class="movie-card"> 
             <img src="${p.imagen}" class="movie-image" onerror="this.src='https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg'">
              <div class="movie-content"> 
                 <h5 class="movie-title">${p.titulo}</h5>
                    <span class="movie-genero">${p.genero}</span>
                    <div class="movie-meta"> <b>${p.ano}</b> - ${p.director} </div>
                    <div class="movie-ranting"> ⭐${p.calificacion}/10</div>
                    <div class="movie-description"> ${p.descripcion}</div>

                 
                    <div class="movie-actions">
                    <button class="btn btn-info" onclick="verDetalles(${p.id})"><i class="bi bi-eye"></i> Ver detalles</button>
                    <button class="btn btn-warning" onclick="editarPelicula(${p.id})"><i class="bi bi-pencil-square"></i> Editar</button>
                    <button class="btn btn-danger" onclick="eliminarPelicula(${p.id})"><i class="bi bi-trash3"></i> Eliminar</button>
                     </div>

                 </div>
              </div>
        
        </div>`
    ).join("");
}

/**agregar peliculas */
function guardarPelicula(){
    //obtener datos del formulario
    let titulo = document.querySelector("#inputTitulo").value;
    let genero = document.querySelector("#inputGenero").value;
    let director = document.querySelector("#inputDirector").value;
    let ano = parseInt (document.querySelector("#inputAno").value);
    let calificacion = parseFloat (document.querySelector("#inputCalificacion").value);
    let descripcion = document.querySelector("#inputDescripcion").value;
    let imagen = document.querySelector("#inputImagen").value;

    /**validar si estamos editando o agregando */


    if(peliculaEnEdicion){
        //editando pelidula
        //buscar la posicion de la pelicula en el array
       let index= peliculasGlobales.findIndex((p)=> p.id === peliculaEnEdicion.id);

       //mirar si se encontro la pelicula
       if(index !== -1){
         peliculasGlobales[index] = {
            //hacer una copia de la pelicula
            ...peliculaEnEdicion[index],
            //actualizar los datos
            titulo,genero, director, ano, calificacion, descripcion, imagen
         }

         alert("pelicula actualizada con exito ✅");

       }


    }
    else{
        //agregando una pelicula
        //crear objeto para guardar los datos de la pelicula
        let nuevaPelicula={
            id : Date.now(),
            titulo,genero, director, ano, calificacion, descripcion, imagen,
            fecha:new Date()
       
        }
        //agregar pelicula a la lista de peliculas 
        peliculasGlobales.unshift(nuevaPelicula);
        alert("pelicula agregada con exito ✅");
    }
    

    //guardar en localStorage
    localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));

    //limpiar pelicula en edicion
    peliculaEnEdicion = null; //limpiar variable en edicion

    //cargar pelicula en el dashboard
    cargarPeliculas();

    //cerrar modal
    bootstrap.Modal.getInstance(document.querySelector("#modalPelicula")).hide();

    //borrar los datos del modal
    document.querySelector("#formPelicula").reset();
}

/** editar pelicula */
function editarPelicula(id){
    //encontrar la pelicula para editar
    let pelicula = peliculasGlobales.find((p)=> p.id === id);

    //si se encuentra la pelicula llenamos los datos en el formulario

    if(pelicula){
        peliculaEnEdicion = pelicula; //actualizar la variable global 

        //seleccionar los campos del formulario
        let titulo = document.querySelector("#inputTitulo").valuer = pelicula.titulo;
        let genero = document.querySelector("#inputGenero").value = pelicula.genero;
        let director = document.querySelector("#inputDirector").value = pelicula.director;
        let ano = document.querySelector("#inputAno").value = pelicula.ano;
        let calificacion = document.querySelector("#inputCalificacion").value = pelicula.calificacion;
        let descripcion = document.querySelector("#inputDescripcion").value = pelicula.descripcion;
        let imagen = document.querySelector("#inputImagen").value = pelicula.imagen;

        //cambiar los datos del modal
        document.querySelector("#modalTitulo").textContent = "Editar Pelicula";

        //mostrar el modal
        let modal = new bootstrap.Modal(document.querySelector("#modalPelicula"));
        modal.show();
    }
}

/** eliminar pelicula */
function eliminarPelicula(id){
    //en una variable confirmar si desea eliminar la pelicula
    let confirmar = confirm("¿Desea eliminar esta pelicula?");

    if(confirmar){
        //buscar las peliculas que no tengan el id seleccionado 

        peliculasGlobales = peliculasGlobales.filter((p) => p.id !== id);

        //guardar las peliculas
        localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));

        //actualizar el dashboard
        cargarPeliculas();
        //mostrar condirmacipn de eliminacion
        alert("pelicula eliminada con exito ✅");
    }
}

//ver detalles de la pelicula
function verDetalles(id){
    //encontrar la pelicula para ver los detalles
    let pelicula = peliculasGlobales.find((p)=> p.id === id);

    //verificar si se encontro la pelicula
    if(pelicula){
        document.querySelector("#detallesTitulo").textContent = pelicula.titulo;
        document.querySelector("#detallesGenero").textContent = pelicula.genero;
        document.querySelector("#detallesDirector").textContent = pelicula.director;
        document.querySelector("#detallesAno").textContent = pelicula.ano;
        document.querySelector("#detallesCalificacion").textContent = pelicula.calificacion;
        document.querySelector("#detallesDescripcion").textContent = pelicula.descripcion;
        document.querySelector("#detallesImagen").src = pelicula.imagen;

        //mostrar el modal de detalles
        let modal = new bootstrap.Modal(document.querySelector("#modalDetalles"));
        modal.show();
    }
}

//carusel
//carousel
function renderizarSlider(){
    let carrusel = document.querySelector("#carouselMovies");
    carrusel.innerHTML = "";
    //mostrar las peliculas recientes
    let recientes = peliculasGlobales.slice(0,5);
    recientes.forEach(p =>{
        let card = document.createElement("div");
        card.className = "slider-movie-card";
        card.innerHTML = `<img src="${p.imagen}" onerror="this.src='https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg'">
        <div class="slider-movie-info"> 
          <h6>${p.titulo}</h6>
          <small class="text-muted">${p.ano}</small>
        </div>
        `;
        card.addEventListener("click", () => verDetalles(p.id));
        carrusel.appendChild(card);
    });
}

//scroll del carrusel
function scrollSlider(direccion){
    let slider = document.querySelector("#carouselMovies");
    let scroll= 200;
    slider.scrollBy({
    left: direccion * scroll,
    behavior: "smooth"
    });

}

//busqueda de peliculas y filtrado por genero
function buscarPeliculas(){
    let query = document.querySelector("#inputBuscar").value.trim().toLowerCase();
    let generoSeleccionado = document.querySelector("#selectGenero").value;
    
    let peliculasFiltradas = peliculasGlobales.filter((p) => {
        let cumpleBusqueda = p.titulo.toLowerCase().includes(query);
        let cumpleGenero = generoSeleccionado === "" || p.genero === generoSeleccionado;
        return cumpleBusqueda && cumpleGenero;
    });
    
    renderizarGrid(peliculasFiltradas);
}