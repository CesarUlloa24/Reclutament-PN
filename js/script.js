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
    console.log(">>> Intentando guardar datos en Firebase...");

    // Verificamos que la base de datos esté lista
    if (typeof db === 'undefined') {
        alert("Error: No se pudo conectar con la base de datos. Verifique su conexión.");
        return;
    }

    // Capturamos los datos básicos
    const nombre = document.getElementById('inputNombre').value;
    const cedula = document.getElementById('inputCedula').value;

    if (!nombre || !cedula) {
        alert("⚠️ Faltan datos críticos. Por favor revise la Página 1.");
        cambiarPagina(1);
        return;
    }

    // Creamos el objeto con la información a guardar
    const datosPostulante = {
        nombre: nombre,
        cedula: cedula,
        fechaRegistro: new Date().toLocaleString(),
        estado: "Pendiente"
    };

    // Guardamos en la colección "postulantes" de Firestore
    db.collection("postulantes").add(datosPostulante)
    .then((docRef) => {
        console.log("¡Registro guardado con éxito! ID:", docRef.id);
        
        // Ocultamos la página actual y mostramos la pantalla de éxito
        const p3 = document.getElementById('page-3');
        const successScreen = document.getElementById('success-screen');
        
        if (p3) p3.classList.add('d-none');
        if (successScreen) successScreen.classList.remove('d-none');
        
        window.scrollTo(0, 0);
    })
    .catch((error) => {
        console.error("Error al guardar:", error);
        alert("Hubo un error al enviar el formulario: " + error.message);
    });
}