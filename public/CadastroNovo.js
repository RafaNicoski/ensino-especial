// Função para carregar e exibir dados do JSON no console
function loadCadastros() {
    // Faz uma requisição para a URL do servidor que serve os cadastros em formato JSON
    fetch('http://localhost:3000/cadastros') 
        .then(response => {
            // Verifica se a resposta da requisição foi bem-sucedida (status HTTP 200-299)
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados do JSON'); // Lança um erro se a resposta não for OK
            }
            return response.json(); // Converte a resposta em JSON
        })
        .then(data => {
            // Após a conversão, exibe os dados no console
            console.log('Cadastros carregados:');
            // Itera sobre cada cadastro no array de dados
            data.forEach(cadastro => {
                // Exibe o ID, Nome e Idade de cada cadastro no console
                console.log(`ID: ${cadastro.id}, Nome: ${cadastro.nome}, Idade: ${cadastro.idade}`);
            });
        })
        .catch(error => {
            // Captura e exibe qualquer erro que ocorra durante a requisição
            console.error(`Erro: ${error.message}`); // Exibe uma mensagem de erro no console
        });
}

// Carregar os cadastros do JSON quando a página for carregada
window.onload = loadCadastros; // Chama a função loadCadastros assim que a página é carregada
