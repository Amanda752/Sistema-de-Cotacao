// Seleciona os botões e os inputs
let btnEnviar = document.querySelectorAll('#botoes button')[0];
let btnExcluir = document.querySelectorAll('#botoes button')[1];
let btnEditar = document.querySelectorAll('#botoes button')[2];
let btnVerUltimaCotacao = document.querySelectorAll('#botoes button')[3]; // Ajuste aqui

// Seleciona os inputs para os dados do produto
let nome = document.querySelectorAll('#wrap input')[0];
let quantidade = document.querySelectorAll('#wrap input')[1];
let preco = document.querySelectorAll('#wrap input')[2];
let prateleira = document.querySelectorAll('#wrap input')[3];
let descricao = document.querySelectorAll('#wrap input')[4];
let categoria = document.querySelectorAll('#wrap input')[5];

let tabela = document.querySelector('#saida table');
let BD = []; // Array para armazenar os produtos

// Função para garantir que apenas números e ponto ou vírgula sejam inseridos no campo de preço
preco.addEventListener('input', function(e) {
    // Substitui tudo que não for número, ponto ou vírgula
    e.target.value = e.target.value.replace(/[^0-9.,]/g, '');
    
    // Limita para permitir apenas um ponto ou vírgula
    if (e.target.value.indexOf('.') !== e.target.value.lastIndexOf('.')) {
        e.target.value = e.target.value.replace(/\.+$/, '');
    }

    if (e.target.value.indexOf(',') !== e.target.value.lastIndexOf(',')) {
        e.target.value = e.target.value.replace(/,+$/, '');
    }
});

// Função de envio de produto
btnEnviar.onclick = function() {
    // Converte o preço para número, substituindo vírgula por ponto
    let precoUnitario = parseFloat(preco.value.replace(',', '.'));
    
    // Verifica se o preço é um número válido
    if (isNaN(precoUnitario) || precoUnitario <= 0) {
        alert("Por favor, insira um valor de preço válido.");
        return; // Sai da função se o preço não for válido
    }

    let quantidadeProduto = parseFloat(quantidade.value);
    let precoTotal = precoUnitario * quantidadeProduto;

    let produto = {
        nome: nome.value,
        quantidade: quantidade.value,
        precoUnitario: precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        precoTotal: precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        data: new Date().toLocaleDateString(),
        id: BD.length
    };
    
    BD.push(produto);

    tabela.innerHTML += `<tr>
        <td><input type="checkbox" id="${produto.id}" onchange="verificar(this.id)"></td>
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.precoUnitario}</td>
        <td>${produto.precoTotal}</td>
    </tr>`;
}

// Função de exclusão de produtos
btnExcluir.onclick = function() {
    for (let i = 0; i < BD.length; i++) {
        let elemento = document.querySelectorAll('#saida table tr td input')[i];
        if (elemento.checked) {
            BD.splice(elemento.id, 1);
            tabela.innerHTML = `<tr>
                <td width="30px"></td><td>Nome</td><td>Quant.</td><td>Preço Unitário</td><td>Preço Total</td>
            </tr>`;
            montarTabela();
        }
    }
}

// Função para montar a tabela
function montarTabela() {
    for (let i = 0; i < BD.length; i++) {
        tabela.innerHTML += `<tr>
            <td width="30px"><input type="checkbox" id="${i}" onchange="verificar()"></td>
            <td>${BD[i].nome}</td>
            <td>${BD[i].quantidade}</td>
            <td>${BD[i].precoUnitario}</td>
            <td>${BD[i].precoTotal}</td>
        </tr>`;
    }
}

// Função de edição de produtos
btnEditar.onclick = function() {
    for (let i = 0; i < BD.length; i++) {
        let elemento = document.querySelectorAll('#saida table tr td input')[i];
        if (elemento.checked) {
            let precoUnitario = parseFloat(preco.value.replace(',', '.'));
            
            // Verifica se o preço é um número válido
            if (isNaN(precoUnitario) || precoUnitario <= 0) {
                alert("Por favor, insira um valor de preço válido.");
                return; // Sai da função se o preço não for válido
            }

            let quantidadeProduto = parseFloat(quantidade.value);
            let precoTotal = precoUnitario * quantidadeProduto;

            BD[i].nome = nome.value;
            BD[i].quantidade = quantidade.value;
            BD[i].precoUnitario = precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            BD[i].precoTotal = precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          
            tabela.innerHTML = `<tr>
                <td width="30px"></td><td>Nome</td><td>Quant.</td><td>Preço Unitário</td><td>Preço Total</td>
            </tr>`;
            montarTabela();
        }
    }    
}

// Função para verificar seleção de produtos
function verificar(id) {
    let cont = 0;
    for (let i = 0; i < BD.length; i++) {
        let elemento = document.querySelectorAll('#saida table tr td input')[i];
        if (elemento.checked) {
            nome.value = BD[i].nome;
            quantidade.value = BD[i].quantidade;
            preco.value = BD[i].precoUnitario;
            cont++;
            if (cont > 1) {
                alert('Não é possível selecionar mais de 1 elemento.');
                elemento.checked = false;
                break;
            }
        }
    }
}

// Função para verificar a última cotação de um produto pelo nome
btnVerUltimaCotacao.onclick = function() {
    let nomeProduto = prompt("Digite o nome do produto para ver a última cotação:");
    verUltimaCotacao(nomeProduto);
};

// Função de busca da última cotação
function verUltimaCotacao(nomeProduto) {
    // Converte o nome do produto para minúsculas para comparação insensível a maiúsculas/minúsculas
    let produtosEncontrados = BD.filter(item => item.nome.toLowerCase() === nomeProduto.toLowerCase());

    if (produtosEncontrados.length > 0) {
        // Seleciona o último produto adicionado à lista
        let ultimoProduto = produtosEncontrados[produtosEncontrados.length - 1];
        
        alert(`Última Cotação de ${ultimoProduto.nome}:\nPreço Unitário: ${ultimoProduto.precoUnitario}\nPreço Total: ${ultimoProduto.precoTotal}\nData: ${ultimoProduto.data}`);
    } else {
        alert("Produto não encontrado.");
    }
    

}

