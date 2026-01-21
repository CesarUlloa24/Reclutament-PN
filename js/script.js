/**
 * LÓGICA DEL FORMULARIO DE RECLUTAMIENTO - POLICÍA NACIONAL DE PANAMÁ
 * Versión Final con Conexión a Firebase
 */

let fotoBase64Global = ""; //variable global

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

document.addEventListener('DOMContentLoaded', () => {
    const cp = document.getElementById('cedProv');
    const ct = document.getElementById('cedTomo');
    const ca = document.getElementById('cedAsiento');
    const hiddenCedula = document.getElementById('inputCedula');

    function actualizarCedulaCompleta() {
        // Solo une las piezas si tienen contenido, para evitar guiones vacíos
        if (cp.value || ct.value || ca.value) {
            hiddenCedula.value = `${cp.value}-${ct.value}-${ca.value}`;
        } else {
            hiddenCedula.value = "";
        }
    }

    [cp, ct, ca].forEach((input, index, array) => {
        input.addEventListener('input', (e) => {
            // REFUERZO: Eliminar cualquier cosa que no sea número
            input.value = input.value.replace(/\D/g, '');
            
            actualizarCedulaCompleta();

            // Salto automático al siguiente cuadro
            if (input.value.length === input.maxLength && index < array.length - 1) {
                array[index + 1].focus();
            }
        });

        // Permitir retroceder al borrar
        input.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && input.value === "" && index > 0) {
                array[index - 1].focus();
            }
        });
    });
});

});

function validarProvincia(input) {
    // 1. Eliminar cualquier cosa que no sea número
    let val = input.value.replace(/\D/g, '');

    // 2. No permitir que empiece con 0
    if (val === '0') {
        val = '';
    }

    // 3. Convertir a número para validar el rango
    if (val.length > 0) {
        let num = parseInt(val);
        
        // Si el número es mayor a 13, nos quedamos solo con el primer dígito
        if (num > 13) {
            val = val.slice(0, 1);
        }
    }

    // 4. Asignar el valor limpio al campo
    input.value = val;
    
    // Llamar a la función que une la cédula completa (si la tienes definida)
    if (typeof actualizarCedulaCompleta === 'function') {
        actualizarCedulaCompleta();
    }
}

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
    const cedProv = document.getElementById('cedProv');
    const cedTomo = document.getElementById('cedTomo');
    const cedAsiento = document.getElementById('cedAsiento');

    // Validación para la Página 1 (Nombre y Cédula)
    if (n === 2) { // Si el destino es la página 2
        // Verificamos el nombre Y que los 3 campos de la cédula no estén vacíos
        if (inputNombre.value.trim() === "" || 
            cedProv.value.trim() === "" || 
            cedTomo.value.trim() === "" || 
            cedAsiento.value.trim() === "") 
        {
            alert("⚠️ Por favor, complete el Nombre y la Cédula en la Página 1 para continuar.");
            inputNombre.focus(); // Opcional: enfoca el campo de nombre si falta
            return; // Detiene la función y no pasa de página
        }
    }

    // Si todo está bien o si la validación es para otra página, cambiamos
    cambiarPagina(n);
}

function previsualizarFoto(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('photo-preview');
            // Reemplazamos el icono por la imagen real
            preview.innerHTML = `<img src="${e.target.result}" alt="Foto Recluta">`;
            
            // Opcional: Si quieres guardar la imagen en el objeto 'datos' para mandarla al Excel (en formato Base64)
            // Aunque recuerda que Excel tiene un límite de caracteres por celda.
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

function previsualizarFoto(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            fotoBase64Global = e.target.result; // Aquí llenamos la variable global
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// --- 6. FUNCIÓN FINALIZAR 

function finalizarFormulario() {

        // 1. Identificar el botón que lanzó el evento
    // Buscamos el botón de finalizar por su texto o clase para deshabilitarlo
    const btnFinalizar = document.querySelector('button[onclick="finalizarFormulario()"]');

    // 2. Si el botón ya está deshabilitado, salimos de la función (evita el doble clic)
    if (btnFinalizar.disabled) return;

    console.log("Iniciando captura de datos...");
    const urlScript = "https://script.google.com/macros/s/AKfycbwq-ONLKB11XvgGPX6kOGWL7nRi8NCXXPXOC0Yz6KkxCXDc4BAF3QDuxiXlg3AkTXri/exec"; 

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
        ingresoFamiliar: v('ingresoFamiliar'),

            // PÁGINA 2
        estatura: v('descEstatura'), 
        camisa: v('descCamisa'), 
        pantalon: v('descPantalon'), 
        zapatos: v('descZapatos'), 
        peso: v('descPeso'),
        claseCabello: v('descClaseCabello'), 
        colorCabello: v('descColorCabello'), 
        colorOjos: v('descColorOjos'), 
        tez: v('descTez'), 
        senas: v('descSenas'),
        estIniC: v('estIniC'), 
        estIniT: v('estIniT'), 
        estPreC: v('estPreC'), 
        estPreT: v('estPreT'), 
        estMedC: v('estMedC'), 
        estMedT: v('estMedT'), 
        estSupC: v('estSupC'), 
        estSupT: v('estSupT'), 
        estPosC: v('estPosC'), 
        estPosT: v('estPosT'), 
        estOtrC: v('estOtrC'), 
        estOtrT: v('estOtrT'),
        ref1N: v('ref1N'), 
        ref1L: v('ref1L'), 
        ref1T: v('ref1T'), 
        ref2N: v('ref2N'), 
        ref2L: v('ref2L'), 
        ref2T: v('ref2T'),
        hijos: v('extraHijos'), 
        hermanos: v('extraHermanos'), 
        viveConN: v('extraViveCon'), 
        habilidades: v('extraInstru'), 
        deportes: v('extraDeporte'),

        // SALUD FAMILIAR
        fam_tbc: v('saludFamTBC'), 
        fam_sif: v('saludFamSIF'), 
        fam_dia: v('saludFamDIA'), 
        fam_can: v('saludFamCAN'), 
        fam_rc: v('saludFamRC'), 
        fam_asm: v('saludFamASM'), 
        fam_epi: v('saludFamEPI'), 
        fam_men: v('saludFamMEN'),

        // SALUD PERSONAL (22 items)
        p1R: v('saludPers1'), p1E: v('expl-1'), p2R: v('saludPers2'), p2E: v('expl-2'), p3R: v('saludPers3'), p3E: v('expl-3'), p4R: v('saludPers4'), p4E: v('expl-4'), p5R: v('saludPers5'), p5E: v('expl-5'), p6R: v('saludPers6'), p6E: v('expl-6'), p7R: v('saludPers7'), p7E: v('expl-7'), p8R: v('saludPers8'), p8E: v('expl-8'), p9R: v('saludPers9'), p9E: v('expl-9'), p10R: v('saludPers10'), p10E: v('expl-10'),
        p11R: v('saludPers11'), p11E: v('expl-11'), p12R: v('saludPers12'), p12E: v('expl-12'), p13R: v('saludPers13'), p13E: v('expl-13'), p14R: v('saludPers14'), p14E: v('expl-14'), p15R: v('saludPers15'), p15E: v('expl-15'), p16R: v('saludPers16'), p16E: v('expl-16'), p17R: v('saludPers17'), p17E: v('expl-17'), p18R: v('saludPers18'), p18E: v('expl-18'), p19R: v('saludPers19'), p19E: v('expl-19'), p20R: v('saludPers20'), p20E: v('expl-20'), p21R: v('saludPers21'), p21E: v('expl-21'), p22R: v('saludPers22'), p22E: v('expl-22'),

        // PÁGINA 3
          // SALUD PERSONAL (CONTINUACIÓN ITEMS 23 AL 31)
        p23R: v('saludPers23'), p23E: v('expl-23'),
        p24R: v('saludPers24'), p24E: v('expl-24'),
        p25R: v('saludPers25'), p25E: v('expl-25'),
        p26R: v('saludPers26'), p26E: v('expl-26'),
        p27R: v('saludPers27'), p27E: v('expl-27'),
        p28R: v('saludPers28'), p28E: v('expl-28'),
        p29R: v('saludPers29'), p29E: v('expl-29'),
        p30R: v('saludPers30'), p30E: v('expl-30'),
        p31R: v('saludPers31'), p31E: v('expl-31'),

        // XII.- HÁBITOS
        habitosDrogas: v('habitosDrogas'),
        habitosExpl: v('habitosExpl'),

        // XIII.- ANTECEDENTES JUDICIALES
        judicExpl: v('judicExpl'),

        // XIV.- SITUACIÓN ACTUAL
        actualLabora: v('actualLabora'),
        actualEstudia: v('actualEstudia'),
        actualPartido: v('actualPartido'),
        actualEstamento: v('actualEstamento'),
        actualExpl: v('actualExpl'),

        // XV.- MOTIVACIONES
        motivo1: v('motivo1'),
        motivo2: v('motivo2'),
        motivo3: v('motivo3'),
        motivo4: v('motivo4'),
        motivo5: v('motivo5'),
        motivo6: v('motivo6'),
        motivo7R: v('motivo7'),
        motivo7E: v('expl-incidente'),

        fotoBase64: fotoBase64Global   // <--- LA FOTO AL FINAL
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
