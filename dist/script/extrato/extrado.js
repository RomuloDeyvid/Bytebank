import { FormatoData } from "../enums/FormatoData.js";
import { TipoDeTransacao } from "../enums/tipoDeTransacao.js";
import { formatarData, formatarMoeda } from "../Formatador/formatador.js";
let saldo = JSON.parse(localStorage.getItem("Saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem('Transações'), (key, value) => {
    if (key === 'data') {
        return new Date(value);
    }
    return value;
}) || [];
const elementoSaldo = document.querySelector('.saldo-valor .valor');
const elementoDataAcesso = document.querySelector('.block-saldo time');
const elementoRegistroTransacoesExtrato = document.querySelector('.extrato .registro-transacoes');
if (elementoSaldo != null) {
    elementoSaldo.textContent = formatarMoeda(parseInt(localStorage.getItem('Saldo')));
}
if (elementoDataAcesso != null) {
    const dataAtual = new Date();
    elementoDataAcesso.textContent = formatarData(dataAtual, FormatoData.DIA_SEMANA_DIA_MES_ANO);
}
renderizarExtrato();
function salvaTransacao(novaTransacao) {
    // Recupera a lista de transações do localStorage e garante que seja um array
    let transacoes = JSON.parse(localStorage.getItem('Transações'), (key, value) => {
        if (key === 'data') {
            return new Date(value);
        }
        return value;
    }) || '[]';
    // Verifica se o valor recuperado é um array, se não for, inicializa como um array vazio
    if (!Array.isArray(transacoes)) {
        transacoes = [];
    }
    // Adiciona a nova transação à lista
    transacoes.push(novaTransacao);
    // Salva a lista atualizada no localStorage
    localStorage.setItem('Transações', JSON.stringify(transacoes));
    localStorage.setItem('Saldo', saldo.toString());
}
function GruposDeTransacao() {
    const gruposDeTransacoes = [];
    const listaTransacoes = structuredClone(transacoes);
    const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
    let labelAtualGrupoTransacao = '';
    for (let transacao of transacoesOrdenadas) {
        let labelGrupoTransacao = transacao.data.toLocaleDateString('pt-br', { month: '2-digit', year: 'numeric' });
        if (labelAtualGrupoTransacao != labelGrupoTransacao) {
            labelAtualGrupoTransacao = labelGrupoTransacao;
            gruposDeTransacoes.push({
                label: labelGrupoTransacao,
                transacoes: []
            });
        }
        gruposDeTransacoes.at(-1).transacoes.push(transacao);
    }
    return gruposDeTransacoes;
}
console.log(GruposDeTransacao());
const elementoFormulario = document.querySelector('.block-nova-transacao form');
elementoFormulario.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
        alert('Os dados do formulário não são válidos');
        return;
    }
    const inputTipoTransacao = document.querySelector('#tipoTransacao');
    const inputValor = document.querySelector('#valor');
    const inputData = document.querySelector('#data');
    let tipoDeTransacao = inputTipoTransacao.value;
    let valor = inputValor.valueAsNumber;
    let data = new Date(inputData.value + ' 00:00:00');
    if (tipoDeTransacao == TipoDeTransacao.DEPOSITO) {
        if (valor <= 0) {
            throw new Error('O valor depositado deve ser maior que zero.');
        }
        saldo += valor;
        const novaTransacao = {
            tipoDeTransacao,
            valor: valor,
            data: data,
        };
        salvaTransacao(novaTransacao);
        console.log(GruposDeTransacao());
    }
    else if (tipoDeTransacao == TipoDeTransacao.TRANSFERENCIA || tipoDeTransacao == TipoDeTransacao.PAGAMENTO_BOLETO) {
        if (valor > saldo) {
            throw new Error(`O valor ${formatarMoeda(valor)} de ${tipoDeTransacao} é maior que o saldo ${formatarMoeda(saldo)}`);
        }
        if (valor <= 0) {
            throw new Error('O valor solicitado deve ser maior que zero.');
        }
        saldo -= valor;
        const novaTransacao = {
            tipoDeTransacao,
            valor: valor * -1,
            data: data,
        };
        salvaTransacao(novaTransacao);
        console.log(GruposDeTransacao());
    }
    else {
        throw new Error('Tipo de transação inválida');
    }
    elementoSaldo.textContent = formatarMoeda(saldo);
    renderizarExtrato();
});
function renderizarExtrato() {
    const gruposTransacoes = GruposDeTransacao();
    elementoRegistroTransacoesExtrato.innerHTML = '';
    let htmlRegistroTransacoes = '';
    for (let GrupoTransacao of gruposTransacoes) {
        let htmlTransacoesItem = '';
        for (let transacao of GrupoTransacao.transacoes) {
            htmlTransacoesItem += `
            <div class="transacao-item">
                <div class="transacao-info">
                    <span class="tipo">${transacao.tipoDeTransacao}</span>
                    <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
                </div>
                <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
            </div>
            `;
        }
        htmlRegistroTransacoes += `
        <div class="transacoes-group">
            <strong class="mes-group">${GrupoTransacao.label}</strong>
            ${htmlTransacoesItem}
        </div>
        `;
    }
    if (htmlRegistroTransacoes === '') {
        htmlRegistroTransacoes = '<div>Não há transações registradas</div>';
    }
    elementoRegistroTransacoesExtrato.innerHTML = htmlRegistroTransacoes;
}
