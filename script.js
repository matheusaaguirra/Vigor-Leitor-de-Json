document.addEventListener('DOMContentLoaded', () => {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const columnClass = this.getAttribute('data-column');
            const cells = document.querySelectorAll(`td.${columnClass}`);
            cells.forEach(cell => {
                cell.style.visibility = this.checked ? 'visible' : 'hidden';
            });
        });
    });

    document.getElementById('uploadButton').addEventListener('click', function () {
        const fileInput = document.getElementById('jsonFile');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const jsonContent = e.target.result;

                try {
                    const data = JSON.parse(jsonContent);

                    if (Array.isArray(data)) {
                        if (data.length > 0 && typeof data[0] === 'object') {
                            appendDataToTable(data);
                        } else {
                            alert("O arquivo JSON é um array, mas não contém objetos válidos.");
                        }
                    } else if (typeof data === 'object') {
                        appendDataToTable([data]);
                    } else {
                        alert("O formato do arquivo JSON não é suportado.");
                    }
                } catch (error) {
                    alert("Erro ao ler o arquivo JSON. Verifique o formato.");
                }
            };

            reader.onerror = function () {
                alert("Erro ao carregar o arquivo. Tente novamente.");
            };

            reader.readAsText(file);
        } else {
            alert("Por favor, selecione um arquivo JSON.");
        }
    });
});

// Função para adicionar novos dados na tabela
function appendDataToTable(data) {
    const tbody = document.querySelector('#dataTable tbody');

    data.forEach((item, index) => {
        const row = document.createElement('tr');

        // Coluna de ações
        const actionCell = document.createElement('td');
        actionCell.innerHTML = `<button onclick="openModal(${index})">Editar / Excluir</button>`;
        row.appendChild(actionCell);

        // Adiciona as células para cada propriedade
        const allowedColumns = ['Description', 'DNSHostName', 'IPv4Address', 'LastLogonDate'];
        allowedColumns.forEach(header => {
            const td = document.createElement('td');
            let value = item[header];

            if (header === 'LastLogonDate' && value) {
                value = formatDateTime(value);
            }

            td.textContent = value !== undefined ? value : 'N/A';
            td.classList.add(header);
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    saveToLocalStorage(); // Salva após adicionar novos dados
}


// Função para abrir o modal// Função para abrir o modal
function openModal(item, index) {
    document.getElementById('description').value = item.Description || '';
    document.getElementById('dnsHostName').value = item.DNSHostName || '';
    document.getElementById('ipv4Address').value = item.IPv4Address || '';
    document.getElementById('lastLogonDate').value = item.LastLogonDate || '';

    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Ao clicar em salvar, edita os dados
    document.getElementById('saveButton').onclick = () => {
        editData(index);
        closeModal(); // Fecha o modal após salvar
    };

    // Ao clicar em excluir, deleta os dados
    document.getElementById('deleteButton').onclick = () => {
        deleteData(index);
        closeModal(); // Fecha o modal após excluir
    };

    document.querySelector('.close').onclick = closeModal; // Função para fechar o modal ao clicar na cruz
}

// Função para editar dados
function editData(index) {
    const data = JSON.parse(localStorage.getItem('uploadedData')) || [];
    
    if (data.length > index) {
        // Atualiza os dados com os valores do modal
        data[index].Description = document.getElementById('description').value;
        data[index].DNSHostName = document.getElementById('dnsHostName').value;
        data[index].IPv4Address = document.getElementById('ipv4Address').value;
        data[index].LastLogonDate = document.getElementById('lastLogonDate').value;

        saveToLocalStorage(data);
        updateTable(); // Atualiza a tabela sem limpar
    }
}

// Função para excluir dados
function deleteData(index) {
    const data = JSON.parse(localStorage.getItem('uploadedData')) || [];
    data.splice(index, 1); // Remove o item do array
    saveToLocalStorage(data);
    updateTable(); // Atualiza a tabela sem limpar
}

// Função para atualizar a tabela
function updateTable() {
    const data = JSON.parse(localStorage.getItem('uploadedData')) || [];
    appendDataToTable(data); // Preenche a tabela com os dados atualizados
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}


// Função para formatar a data
function formatDateTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Data inválida';
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para formatar a data
function formatDateTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Data inválida';
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para salvar dados no LocalStorage
function saveToLocalStorage(data) {
    const jsonString = JSON.stringify(data);
    localStorage.setItem('uploadedData', jsonString);
}

// Função para carregar dados do LocalStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('uploadedData');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            generateTable(data);
        } catch (error) {
            console.error("Erro ao carregar dados do LocalStorage:", error.message);
        }
    }
}

// Carrega os dados do LocalStorage ao carregar a página
window.onload = function () {
    loadFromLocalStorage();
};
