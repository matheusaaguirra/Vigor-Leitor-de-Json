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
                        generateTable(data);
                        saveToLocalStorage(data);
                    } else {
                        alert("O arquivo JSON é um array, mas não contém objetos válidos.");
                    }
                } else if (typeof data === 'object') {
                    generateTable([data]);
                    saveToLocalStorage([data]);
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

function generateTable(data) {
    const container = document.querySelector('.container');

    // Criação de um elemento de tabela
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Criando o cabeçalho
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Criando o corpo da tabela
    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header] !== undefined ? item[header] : 'N/A';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    // Montando a tabela
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    // Adicionando botão de excluir para esta tabela
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir Tabela';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        container.removeChild(table); // Remove apenas esta tabela
        container.removeChild(deleteButton); // Remove o botão associado
    };

    // Adicionando o botão abaixo da tabela
    container.appendChild(deleteButton);
}

function saveToLocalStorage(data) {
    const jsonString = JSON.stringify(data);
    localStorage.setItem('uploadedData', jsonString);
}

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

// Carrega os dados do Local Storage ao carregar a página
window.onload = function () {
    loadFromLocalStorage();
};
