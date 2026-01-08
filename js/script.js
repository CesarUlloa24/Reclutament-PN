/**
 * LÓGICA DEL FORMULARIO DE RECLUTAMIENTO - POLICÍA NACIONAL DE PANAMÁ
 * Versión Final con Conexión a Firebase
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CÁLCULO AUTOMÁTICO DE EDAD ---
    const txtFechaNac = document.getElementById('txtFechaNac');
    const txtEdad = document.getElementById('txtEdad');

    if(txtFechaNac && txtEdad) {
        txtFechaNac.addEventListener('change', () => {
            const fechaValor = txtFechaNac.value;
            if (!fechaValor) return;

            const hoy = new Date();
            const cumple = new Date(fechaValor);
            let edad = hoy.getFullYear() - cumple.getFullYear();
            const m = hoy.getMonth() - cumple.getMonth();
            
            if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
                edad--;
            }
            txtEdad.value = edad >= 0 ? edad : 0;
        });
    }

    // --- 2. LÓGICA VIVE CON PADRES (PÁGINA 1) ---
    const selVivePadres = document.getElementById('selVivePadres');
    const divConQuien = document.getElementById('divConQuien');

    if(selVivePadres && divConQuien) {
        selVivePadres.addEventListener('change', () => {
            if (selVivePadres.value === "no") {
                divConQuien.classList.remove('d-none');
            } else {
                divConQuien.classList.add('d-none');
            }
        });
    }

    // --- 3. LÓGICA SECCIÓN X (CHECKBOXES DE SALUD FAMILIAR) ---
    const checksFamiliares = document.querySelectorAll('.check-salud-fam');
    
    checksFamiliares.forEach(check => {
        check.addEventListener('change', function() {
            const targetId = this.getAttribute('data-target');
            const divOpciones = document.getElementById(targetId);
            
            if (divOpciones) {
                if (this.checked) {
                    divOpciones.classList.remove('d-none');
                } else {
                    divOpciones.classList.add('d-none');
                    const select = divOpciones.querySelector('select');
                    if(select) select.value = "";
                }
            }
        });
    });

    // --- 4. LÓGICA DE SALUD DINÁMICA (SELECTS SÍ/NO - PÁGINA 2 Y 3) ---
    const selectoresSalud = document.querySelectorAll('.sel-salud');
    
    selectoresSalud.forEach(selector => {
        selector.addEventListener('change', function() {
            const targetId = this.getAttribute('data-target');
            const inputExplicacion = document.getElementById(targetId);
            
            if (inputExplicacion) {
                if (this.value === "si") {
                    inputExplicacion.classList.remove('d-none');
                    inputExplicacion.focus();
                } else {
                    inputExplicacion.classList.add('d-none');
                    inputExplicacion.value = ""; 
                }
            }
        });
    });

});

// --- 5. FUNCIONES DE NAVEGACIÓN (Globales para botones HTML) ---

function cambiarPagina(n) {
    const p1 = document.getElementById('page-1');
    const p2 = document.getElementById('page-2');
    const p3 = document.getElementById('page-3');
    const success = document.getElementById('success-screen');

    // Ocultamos todas las secciones
    if(p1) p1.classList.add('d-none');
    if(p2) p2.classList.add('d-none');
    if(p3) p3.classList.add('d-none');
    if(success) success.classList.add('d-none');

    // Mostramos la página solicitada
    if (n === 1 && p1) p1.classList.remove('d-none');
    if (n === 2 && p2) p2.classList.remove('d-none');
    if (n === 3 && p3) p3.classList.remove('d-none');
    
    window.scrollTo(0, 0);
}

function validarYPasar(n) {
    const inputNombre = document.getElementById('inputNombre');
    const inputCedula = document.getElementById('inputCedula');

    // Validación obligatoria en la Página 1 para poder avanzar
    if (n === 2 || n === 3) {
        if (!inputNombre.value.trim() || !inputCedula.value.trim()) {
            alert("⚠️ Por favor, complete el Nombre y la Cédula en la Página 1 para continuar.");
            cambiarPagina(1);
            inputNombre.focus();
            return;
        }
    }

    cambiarPagina(n);
}

// --- 6. FUNCIÓN FINALIZAR Y GUARDAR EN FIREBASE ---

function finalizarFormulario() {

        // 1. Identificar el botón que lanzó el evento
    // Buscamos el botón de finalizar por su texto o clase para deshabilitarlo
    const btnFinalizar = document.querySelector('button[onclick="finalizarFormulario()"]');

    // 2. Si el botón ya está deshabilitado, salimos de la función (evita el doble clic)
    if (btnFinalizar.disabled) return;

    console.log("Iniciando captura de datos...");
    const urlScript = "https://script.google.com/macros/s/AKfycbzVpJ1Z6j9eI0-o9WMJ44Gw1HD1D_iXmnBaZdoDv59fBaKXwJaUiqEF-1JFcrF60EBF/exec"; 

    // 3. Deshabilitar el botón y mostrar estado de carga
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando datos...';

    // Función auxiliar para obtener valor sin errores
    const v = (id) => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn("⚠️ No se encontró el ID: " + id);
            return ""; 
        }
        return el.value;
    };

    const datos = {
        fechaPostulacion: v('fechaPostulacion'),
        postulacionCargo: v('postulacionCargo'),
        apellido1: v('apellido1'),
        apellido2: v('apellido2'),
        nombre1: v('inputNombre'),
        nombre2: v('nombre2'),
        cedula: v('inputCedula'),
        apodo: v('inputApodo'),
        religion: v('inputReligion'),
        fechaNac: v('txtFechaNac'),
        edad: v('txtEdad'),
        tipaje: v('inputTipaje'),
        estadoCivil: v('selEstadoCivil'),
        idioma: v('inputIdioma'),
        provincia: v('resProvincia'),
        distrito: v('resDistrito'),
        corregimiento: v('resCorregimiento'),
        casaColor: v('resCasaColor'),
        tiempoResidencia: v('resTiempoResidencia'),
        telefonos: v('resTelefonos'),
        direccionAnterior: v('resDireccionAnterior'),
        padreNombre: v('padreNombre'),
        padreProfesion: v('padreProfesion'),
        padreDireccion: v('padreDireccion'),
        padreTelefono: v('padreTelefono'),
        madreNombre: v('madreNombre'),
        madreProfesion: v('madreProfesion'),
        madreDireccion: v('madreDireccion'),
        madreTelefono: v('madreTelefono'),
        padrastroNombre: v('padrastroNombre'),
        madrastraNombre: v('madrastraNombre'),
        viveConPadres: v('selVivePadres'),
        emergenciaNombre: v('emergenciaNombre'),
        emergenciaTelefono: v('emergenciaTelefono'),
        ingresoFamiliar: v('ingresoFamiliar')
    };

    console.log("Datos capturados listos para enviar:", datos);

    fetch(urlScript, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => {
        document.getElementById('page-3').classList.add('d-none');
        document.getElementById('success-screen').classList.remove('d-none');
        window.scrollTo(0, 0);
    })
    .catch(error => console.error("Error al enviar:", error));
 }
