/**
 * LÓGICA DEL FORMULARIO DE RECLUTAMIENTO
 * Proyecto: Policía Nacional de Panamá
 */

document.addEventListener('DOMContentLoaded', () => {


    // --- LÓGICA SECCIÓN X (CHECKBOXES CON SELECT) ---
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
                    // Opcional: Resetear el select al desmarcar
                    const select = divOpciones.querySelector('select');
                    if(select) select.value = "";
                }
            }
        });
    });
    
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
            
            // Ajuste por si no ha cumplido años en el año actual
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

    // --- 3. LÓGICA DE SALUD DINÁMICA (PÁGINA 2) ---
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
                    inputExplicacion.value = ""; // Limpia el texto al ocultar
                }
            }
        });
    });

});

// --- 4. FUNCIONES DE NAVEGACIÓN (Globales para vincular con onclick del HTML) ---

function cambiarPagina(n) {
    const p1 = document.getElementById('page-1');
    const p2 = document.getElementById('page-2');
    const p3 = document.getElementById('page-3'); // Por si creas una tercera página luego

    // Ocultamos todas primero para evitar solapamientos
    if(p1) p1.classList.add('d-none');
    if(p2) p2.classList.add('d-none');
    if(p3) p3.classList.add('d-none');

    // Mostramos la página solicitada
    if (n === 1 && p1) {
        p1.classList.remove('d-none');
    } else if (n === 2 && p2) {
        p2.classList.remove('d-none');
    } else if (n === 3 && p3) {
        p3.classList.remove('d-none');
    } else if (n === 3 && !p3) {
        // Si haces clic a la pág 3 pero no existe, avisamos o nos quedamos en la 2
        alert("Página 3 en desarrollo o próximamente.");
        if(p2) p2.classList.remove('d-none');
    }
    
    // Siempre subir al inicio de la pantalla al cambiar de página
    window.scrollTo(0, 0);
}

/**
 * Validación antes de pasar de página
 * @param {number} n - Número de página a la que se desea ir
 */
function validarYPasar(n) {
    const inputNombre = document.getElementById('inputNombre');
    const inputCedula = document.getElementById('inputCedula');

    // Validación básica de campos obligatorios en la página 1
    if (n === 2) {
        if (inputNombre.value.trim() === "" || inputCedula.value.trim() === "") {
            alert("⚠️ Por favor, complete el Nombre y la Cédula para poder continuar.");
            inputNombre.focus();
            return;
        }
    }

    // Si pasa la validación, cambiamos de página
    cambiarPagina(n);
}