/**
 * LÓGICA DEL FORMULARIO DE RECLUTAMIENTO - POLICÍA NACIONAL DE PANAMÁ
 * Versión Corregida
 */

let fotoBase64Global = ""; 

// --- FUNCIONES GLOBALES (Deben estar fuera para que el HTML las vea) ---

// Une las partes de la cédula en el input oculto
function actualizarCedulaCompleta() {
    const cp = document.getElementById('cedProv');
    const ct = document.getElementById('cedTomo');
    const ca = document.getElementById('cedAsiento');
    const hiddenCedula = document.getElementById('inputCedula');

    if (cp && ct && ca && hiddenCedula) {
        // Solo une las piezas si tienen contenido
        if (cp.value || ct.value || ca.value) {
            hiddenCedula.value = `${cp.value}-${ct.value}-${ca.value}`;
        } else {
            hiddenCedula.value = "";
        }
        console.log("Cédula actualizada:", hiddenCedula.value); // Para depuración
    }
}

// Valida que la provincia sea correcta y salta al siguiente campo
function validarProvincia(input) {
    let val = input.value.replace(/\D/g, ''); // Solo números
    if (val === '0') val = '';
    if (val.length > 0) {
        let num = parseInt(val);
        if (num > 13) val = val.slice(0, 1);
    }
    input.value = val;
    actualizarCedulaCompleta();
}

function previsualizarFoto(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            fotoBase64Global = e.target.result; 
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function cambiarPagina(n) {
    const p1 = document.getElementById('page-1');
    const p2 = document.getElementById('page-2');
    const p3 = document.getElementById('page-3');
    const success = document.getElementById('success-screen');

    if(p1) p1.classList.add('d-none');
    if(p2) p2.classList.add('d-none');
    if(p3) p3.classList.add('d-none');
    if(success) success.classList.add('d-none');

    if (n === 1 && p1) p1.classList.remove('d-none');
    if (n === 2 && p2) p2.classList.remove('d-none');
    if (n === 3 && p3) p3.classList.remove('d-none');
    
    window.scrollTo(0, 0);
}

function validarYPasar(n) {
    if (n === 2) { 
        const inputNombre = document.getElementById('inputNombre');
        const cp = document.getElementById('cedProv');
        const ct = document.getElementById('cedTomo');
        const ca = document.getElementById('cedAsiento');

        if (inputNombre.value.trim() === "" || cp.value === "" || ct.value === "" || ca.value === "") {
            alert("⚠️ Por favor, complete el Nombre y la Cédula completa para continuar.");
            return;
        }
    }
    cambiarPagina(n);
}

// --- INICIALIZACIÓN DE EVENTOS ---

document.addEventListener('DOMContentLoaded', () => {

    // 1. Edad Automática
    const txtFechaNac = document.getElementById('txtFechaNac');
    if(txtFechaNac) {
        txtFechaNac.addEventListener('change', () => {
            const hoy = new Date();
            const cumple = new Date(txtFechaNac.value);
            let edad = hoy.getFullYear() - cumple.getFullYear();
            if (hoy.getMonth() < cumple.getMonth() || (hoy.getMonth() === cumple.getMonth() && hoy.getDate() < cumple.getDate())) {
                edad--;
            }
            document.getElementById('txtEdad').value = edad >= 0 ? edad : 0;
        });
    }

    // 2. Control de Cédula (Inputs individuales)
    const cp = document.getElementById('cedProv');
    const ct = document.getElementById('cedTomo');
    const ca = document.getElementById('cedAsiento');

    [cp, ct, ca].forEach((input, index, array) => {
        if(!input) return;
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, ''); // Solo números
            actualizarCedulaCompleta();
            if (input.value.length === input.maxLength && index < array.length - 1) {
                array[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && input.value === "" && index > 0) {
                array[index - 1].focus();
            }
        });
    });

    // 3. Salud Familiar (Checkboxes)
    document.querySelectorAll('.check-salud-fam').forEach(check => {
        check.addEventListener('change', function() {
            const div = document.getElementById(this.getAttribute('data-target'));
            if (div) div.classList.toggle('d-none', !this.checked);
        });
    });

    // 4. Selectores SÍ/NO (Salud y otros)
    document.querySelectorAll('.sel-salud').forEach(selector => {
        selector.addEventListener('change', function() {
            const input = document.getElementById(this.getAttribute('data-target'));
            if (input) {
                input.classList.toggle('d-none', this.value !== "si");
                if (this.value === "si") input.focus();
            }
        });
    });
    
    // 5. Vive con padres
    const selVivePadres = document.getElementById('selVivePadres');
    if(selVivePadres) {
        selVivePadres.addEventListener('change', () => {
            const div = document.getElementById('divConQuien');
            if(div) div.classList.toggle('d-none', selVivePadres.value !== "no");
        });
    }
});

// --- FUNCIÓN FINALIZAR ---

function finalizarFormulario() {
    const btnFinalizar = document.querySelector('button[onclick="finalizarFormulario()"]');
    if (btnFinalizar.disabled) return;

    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = 'Enviando...';

    const v = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : "";
    };

    const urlScript = "https://script.google.com/macros/s/AKfycbyioz415PtfFEFUTHgQeHr7TXPJTiZHsiRWQJdREGdOS6FjeDfCv-3TOB11YIgX0J8g/exec"; 

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

    fetch(urlScript, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => {
        console.log("¡Datos enviados! Cambiando pantalla...");
        
        const p1 = document.getElementById('page-1');
        const p2 = document.getElementById('page-2');
        const p3 = document.getElementById('page-3');
        const exito = document.getElementById('success-screen');

        // Ocultar TODO con mazo (forzado)
        if(p1) p1.style.display = 'none';
        if(p2) p2.style.display = 'none';
        if(p3) p3.style.display = 'none';

        // Mostrar ÉXITO
        if(exito) {
            console.log("Elemento de éxito encontrado. Mostrando...");
            exito.classList.remove('d-none');
            exito.style.setProperty('display', 'block', 'important');
        } else {
            console.error("ERROR: No se encontró el ID 'success-screen'. Revisa tu HTML.");
            alert("¡Registro Guardado con éxito! (Pero no encontré la pantalla final)");
        }

        window.scrollTo(0, 0);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al enviar. Intente de nuevo.");
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = '¡Finalizar Registro! 🚀';
    });
}