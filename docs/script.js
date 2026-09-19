// Alternar modo de edición general del portafolio
function toggleModoGeneralEdicion() {
    const body = document.body;
    const btn = document.getElementById('btn-toggle-edicion');
    const textoBtn = document.getElementById('texto-btn-edicion');
    const iconoBtn = btn.querySelector('i');

    const activo = body.classList.toggle('modo-edicion-activo');
    btn.classList.toggle('active', activo);

    if (activo) {
        textoBtn.textContent = 'Finalizar Edición';
        iconoBtn.className = 'bi bi-check2-circle';
    } else {
        textoBtn.textContent = 'Modificar Portafolio';
        iconoBtn.className = 'bi bi-pencil-square';
    }
}

// Modificar campos específicos de un elemento de historial
function toggleModificar(btn) {
    const item = btn.closest('.portfolio-item');
    const content = item.querySelector('.item-content');
    const deleteBtn = item.querySelector('.btn-eliminar');
    const isEditing = item.classList.contains('is-editing');

    if (!isEditing) {
        // Habilitar modo de edición en el item
        item.classList.add('is-editing');
        const headingEl = content.querySelector('.item-heading');
        const subEl = content.querySelector('.item-sub');
        const pdfLink = content.querySelector('.badge-pdf');

        const headingVal = headingEl ? headingEl.textContent.trim() : '';
        const subVal = subEl ? subEl.textContent.trim() : '';
        const pdfVal = pdfLink ? pdfLink.getAttribute('href') : '';

        content.dataset.prevHeading = headingVal;
        content.dataset.prevSub = subVal;
        content.dataset.prevPdf = pdfVal;

        content.innerHTML = `
            <input type="text" class="form-control form-control-sm mb-1 edit-heading" value="${headingVal}" placeholder="Título o Cargo">
            <input type="text" class="form-control form-control-sm mb-1 edit-sub" value="${subVal}" placeholder="Institución / Empresa / Año">
            <select class="form-select form-select-sm edit-pdf">
                <option value="">Sin archivo PDF</option>
                <option value="archivos/TÉCNICO EN SISTEMAS - SENA.pdf" ${pdfVal.includes('TÉCNICO') ? 'selected' : ''}>TÉCNICO EN SISTEMAS - SENA.pdf</option>
                <option value="archivos/Inteligencia Artificial Nivel Básico.pdf" ${pdfVal.includes('Inteligencia') ? 'selected' : ''}>Inteligencia Artificial Nivel Básico.pdf</option>
            </select>
        `;

        btn.classList.remove('btn-modificar');
        btn.classList.add('btn-guardar');
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';

        // Habilitar el botón de eliminación tras presionar modificar
        if (deleteBtn) {
            deleteBtn.disabled = false;
        }
    } else {
        // Guardar cambios efectuados
        const headingInput = content.querySelector('.edit-heading');
        const subInput = content.querySelector('.edit-sub');
        const pdfSelect = content.querySelector('.edit-pdf');

        const newHeading = headingInput.value.trim() || content.dataset.prevHeading || 'Sin título';
        const newSub = subInput.value.trim();
        const newPdf = pdfSelect.value.trim();

        let pdfHtml = '';
        if (newPdf) {
            const nombrePdf = newPdf.split('/').pop();
            pdfHtml = `
                <div>
                    <a href="${newPdf}" target="_blank" class="badge-pdf">
                        <i class="bi bi-file-earmark-pdf-fill"></i> ${nombrePdf}
                    </a>
                </div>
            `;
        }

        content.innerHTML = `
            <h3 class="item-heading">${newHeading}</h3>
            ${newSub ? `<p class="item-sub">${newSub}</p>` : ''}
            ${pdfHtml}
        `;

        item.classList.remove('is-editing');
        btn.classList.remove('btn-guardar');
        btn.classList.add('btn-modificar');
        btn.innerHTML = '<i class="bi bi-pencil-fill"></i> Modificar';

        // Bloquear nuevamente eliminar
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }
    }
}

// Modificar campos de habilidades / tech stack
function toggleModificarHabilidad(btn) {
    const item = btn.closest('.skill-item');
    const headerRow = item.querySelector('.skill-header-row');
    const deleteBtn = item.querySelector('.btn-eliminar');
    const progressBar = item.querySelector('.progress-bar');
    const isEditing = item.classList.contains('is-editing');

    if (!isEditing) {
        item.classList.add('is-editing');
        const nameEl = headerRow.querySelector('.skill-name');
        const percentEl = headerRow.querySelector('.skill-percent');

        const nameVal = nameEl ? nameEl.textContent.trim() : '';
        const percentVal = percentEl ? parseInt(percentEl.textContent) || 50 : 50;

        item.dataset.prevName = nameVal;
        item.dataset.prevPercent = percentVal;

        nameEl.style.display = 'none';
        if (percentEl) percentEl.style.display = 'none';

        const editInputs = document.createElement('div');
        editInputs.className = 'edit-skill-inputs d-flex gap-2 flex-grow-1 me-2';
        editInputs.innerHTML = `
            <input type="text" class="form-control form-control-sm edit-habilidad-nombre" value="${nameVal}" placeholder="Habilidad">
            <input type="number" min="1" max="100" class="form-control form-control-sm edit-habilidad-nivel" style="width: 75px;" value="${percentVal}" placeholder="%">
        `;
        headerRow.insertBefore(editInputs, headerRow.querySelector('.item-actions'));

        btn.classList.remove('btn-modificar');
        btn.classList.add('btn-guardar');
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';

        if (deleteBtn) {
            deleteBtn.disabled = false;
        }
    } else {
        const nameInput = headerRow.querySelector('.edit-habilidad-nombre');
        const percentInput = headerRow.querySelector('.edit-habilidad-nivel');

        const newName = nameInput.value.trim() || item.dataset.prevName || 'Habilidad';
        let newPercent = parseInt(percentInput.value);
        if (isNaN(newPercent) || newPercent < 0) newPercent = 0;
        if (newPercent > 100) newPercent = 100;

        const inputsWrapper = headerRow.querySelector('.edit-skill-inputs');
        if (inputsWrapper) inputsWrapper.remove();

        let nameEl = headerRow.querySelector('.skill-name');
        let percentEl = headerRow.querySelector('.skill-percent');

        nameEl.textContent = newName;
        nameEl.style.display = '';

        if (!percentEl) {
            percentEl = document.createElement('span');
            percentEl.className = 'skill-percent ms-auto me-2';
            headerRow.insertBefore(percentEl, headerRow.querySelector('.item-actions'));
        }
        percentEl.textContent = `${newPercent}%`;
        percentEl.style.display = '';

        if (progressBar) {
            progressBar.style.width = `${newPercent}%`;
        }

        item.classList.remove('is-editing');
        btn.classList.remove('btn-guardar');
        btn.classList.add('btn-modificar');
        btn.innerHTML = '<i class="bi bi-pencil-fill"></i> Modificar';

        if (deleteBtn) {
            deleteBtn.disabled = true;
        }
    }
}

// Eliminar un elemento individual (estudio, trabajo o habilidad)
function eliminarItem(btn) {
    if (btn.disabled) return;
    const item = btn.closest('.portfolio-item') || btn.closest('.skill-item');
    if (item && confirm('¿Deseas eliminar este registro?')) {
        item.remove();
    }
}

// Agregar nuevo estudio con campos separados de título, institución y PDF
function agregarEstudio() {
    const tituloInput = document.getElementById('input-estudio-titulo');
    const instInput = document.getElementById('input-estudio-institucion');
    const pdfInput = document.getElementById('input-estudio-pdf');

    const titulo = tituloInput.value.trim();
    const institucion = instInput.value.trim();
    const pdf = pdfInput ? pdfInput.value.trim() : '';

    if (!titulo) {
        alert('Por favor escribe el nombre del estudio o curso.');
        return;
    }

    let pdfHtml = '';
    if (pdf) {
        const nombrePdf = pdf.split('/').pop();
        pdfHtml = `
            <div>
                <a href="${pdf}" target="_blank" class="badge-pdf">
                    <i class="bi bi-file-earmark-pdf-fill"></i> ${nombrePdf}
                </a>
            </div>
        `;
    }

    const lista = document.getElementById('lista-academica');
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'portfolio-item d-flex justify-content-between align-items-start gap-2';
    nuevoItem.innerHTML = `
        <div class="d-flex align-items-start gap-2 flex-grow-1">
            <span class="item-bullet"></span>
            <div class="item-content flex-grow-1">
                <h3 class="item-heading">${titulo}</h3>
                ${institucion ? `<p class="item-sub">${institucion}</p>` : ''}
                ${pdfHtml}
            </div>
        </div>
        <div class="item-actions d-flex gap-1">
            <button type="button" class="btn-action btn-modificar" onclick="toggleModificar(this)" title="Modificar">
                <i class="bi bi-pencil-fill"></i> Modificar
            </button>
            <button type="button" class="btn-action btn-eliminar" disabled onclick="eliminarItem(this)" title="Eliminar (requiere habilitar modificación)">
                <i class="bi bi-trash-fill"></i> Eliminar
            </button>
        </div>
    `;
    lista.appendChild(nuevoItem);

    // Limpiar campos
    tituloInput.value = '';
    instInput.value = '';
    if (pdfInput) pdfInput.value = '';
}

// Agregar nuevo trabajo con campos separados de cargo, empresa y PDF
function agregarTrabajo() {
    const cargoInput = document.getElementById('input-trabajo-cargo');
    const empresaInput = document.getElementById('input-trabajo-empresa');
    const pdfInput = document.getElementById('input-trabajo-pdf');

    const cargo = cargoInput.value.trim();
    const empresa = empresaInput.value.trim();
    const pdf = pdfInput ? pdfInput.value.trim() : '';

    if (!cargo) {
        alert('Por favor escribe el cargo o puesto.');
        return;
    }

    let pdfHtml = '';
    if (pdf) {
        const nombrePdf = pdf.split('/').pop();
        pdfHtml = `
            <div>
                <a href="${pdf}" target="_blank" class="badge-pdf">
                    <i class="bi bi-file-earmark-pdf-fill"></i> ${nombrePdf}
                </a>
            </div>
        `;
    }

    const lista = document.getElementById('lista-laboral');
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'portfolio-item d-flex justify-content-between align-items-start gap-2';
    nuevoItem.innerHTML = `
        <div class="d-flex align-items-start gap-2 flex-grow-1">
            <span class="item-bullet"></span>
            <div class="item-content flex-grow-1">
                <h3 class="item-heading">${cargo}</h3>
                ${empresa ? `<p class="item-sub">${empresa}</p>` : ''}
                ${pdfHtml}
            </div>
        </div>
        <div class="item-actions d-flex gap-1">
            <button type="button" class="btn-action btn-modificar" onclick="toggleModificar(this)" title="Modificar">
                <i class="bi bi-pencil-fill"></i> Modificar
            </button>
            <button type="button" class="btn-action btn-eliminar" disabled onclick="eliminarItem(this)" title="Eliminar (requiere habilitar modificación)">
                <i class="bi bi-trash-fill"></i> Eliminar
            </button>
        </div>
    `;
    lista.appendChild(nuevoItem);

    // Limpiar campos
    cargoInput.value = '';
    empresaInput.value = '';
    if (pdfInput) pdfInput.value = '';
}

// Agregar nueva habilidad
function agregarHabilidad() {
    const nombreInput = document.getElementById('input-habilidad-nombre');
    const nivelInput = document.getElementById('input-habilidad-nivel');

    const nombre = nombreInput.value.trim();
    let nivel = parseInt(nivelInput.value);

    if (!nombre) {
        alert('Por favor ingresa el nombre de la habilidad.');
        return;
    }
    if (isNaN(nivel) || nivel < 1) nivel = 50;
    if (nivel > 100) nivel = 100;

    const lista = document.getElementById('lista-habilidades');
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'skill-item mb-3';
    nuevoItem.innerHTML = `
        <div class="skill-header-row d-flex justify-content-between align-items-center mb-1">
            <span class="skill-name">${nombre}</span>
            <span class="skill-percent ms-auto me-2">${nivel}%</span>
            <div class="item-actions d-flex gap-1">
                <button type="button" class="btn-action btn-modificar" onclick="toggleModificarHabilidad(this)" title="Modificar">
                    <i class="bi bi-pencil-fill"></i> Modificar
                </button>
                <button type="button" class="btn-action btn-eliminar" disabled onclick="eliminarItem(this)" title="Eliminar (requiere habilitar modificación)">
                    <i class="bi bi-trash-fill"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="progress custom-progress">
            <div class="progress-bar" style="width: ${nivel}%"></div>
        </div>
    `;
    lista.appendChild(nuevoItem);

    nombreInput.value = '';
    nivelInput.value = '';
}
