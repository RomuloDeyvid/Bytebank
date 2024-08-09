import { FormatoData } from "../enums/FormatoData.js"
import { TipoDeTransacao } from "../enums/tipoDeTransacao.js";
import { formatarData, formatarMoeda } from "../Formatador/formatador.js";
import { GrupoTransacao } from "../transação/GrupoTransacao.js";

import { Transacao } from "../transação/transacao.js";

let saldo: number = JSON.parse(localStorage.getItem("Saldo")) || 0

const transacoes: Transacao[] = JSON.parse(localStorage.getItem('Transações'), (key: string, value: string) => {
    if (key === 'data') {
        return new Date(value)
    }
    return value
}) || []

const elementoSaldo = document.querySelector('.saldo-valor .valor') as HTMLElement;
const elementoDataAcesso = document.querySelector('.block-saldo time')
const elementoRegistroTransacoesExtrato: HTMLElement = document.querySelector('.extrato .registro-transacoes')

if (elementoSaldo != null) {
    elementoSaldo.textContent = formatarMoeda(parseInt(localStorage.getItem('Saldo')))
}

if (elementoDataAcesso != null) {
    const dataAtual: Date = new Date()
    elementoDataAcesso.textContent = formatarData(dataAtual, FormatoData.DIA_SEMANA_DIA_MES_ANO)
}

renderizarExtrato()

function salvaTransacao(novaTransacao: Transacao) {
    // Recupera a lista de transações do localStorage e garante que seja um array
    let transacoes = JSON.parse(localStorage.getItem('Transações'), (key: string, value: string) => {
        if (key === 'data') {
            return new Date(value)
        }
        return value
    }) || '[]';

    // Verifica se o valor recuperado é um array, se não for, inicializa como um array vazio
    if (!Array.isArray(transacoes)) {
        transacoes = [];
    }

    // Adiciona a nova transação à lista
    transacoes.push(novaTransacao);

    // Salva a lista atualizada no localStorage
    localStorage.setItem('Transações', JSON.stringify(transacoes));
    localStorage.setItem('Saldo', saldo.toString())
    
}

function GruposDeTransacao(): GrupoTransacao[] {
    const gruposDeTransacoes: GrupoTransacao[] = []
    const listaTransacoes: Transacao[] = structuredClone(transacoes)
    const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime())
    let labelAtualGrupoTransacao: string = ''

    for (let transacao of transacoesOrdenadas) {
        let labelGrupoTransacao: string = transacao.data.toLocaleDateString('pt-br', { month: '2-digit', year: 'numeric' })
        if (labelAtualGrupoTransacao != labelGrupoTransacao) {
            labelAtualGrupoTransacao = labelGrupoTransacao
            gruposDeTransacoes.push({
                label: labelGrupoTransacao,
                transacoes: []
            })
        }
        gruposDeTransacoes.at(-1).transacoes.push(transacao)

    }
    return gruposDeTransacoes
}

console.log(GruposDeTransacao())

const elementoFormulario = document.querySelector('.block-nova-transacao form') as HTMLFormElement;

elementoFormulario.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!elementoFormulario.checkValidity()) {
        alert('Os dados do formulário não são válidos');
        return;
    }

    const inputTipoTransacao = document.querySelector('#tipoTransacao') as HTMLSelectElement;
    const inputValor = document.querySelector('#valor') as HTMLInputElement;
    const inputData = document.querySelector('#data') as HTMLInputElement;

    let tipoDeTransacao: TipoDeTransacao = inputTipoTransacao.value as TipoDeTransacao;
    let valor: number = inputValor.valueAsNumber;
    let data: Date = new Date(inputData.value + ' 00:00:00');

    if (tipoDeTransacao == TipoDeTransacao.DEPOSITO) {
        if (valor <= 0) {
            throw new Error('O valor depositado deve ser maior que zero.');
        }

        saldo += valor;

        const novaTransacao: Transacao = {
            tipoDeTransacao,
            valor: valor,
            data: data,
        };
        
        salvaTransacao(novaTransacao);
        console.log(GruposDeTransacao())
        
    } else if (tipoDeTransacao == TipoDeTransacao.TRANSFERENCIA || tipoDeTransacao == TipoDeTransacao.PAGAMENTO_BOLETO) {
        if (valor > saldo) {
            throw new Error(`O valor ${formatarMoeda(valor)} de ${tipoDeTransacao} é maior que o saldo ${formatarMoeda(saldo)}`);
        }
        if (valor <= 0) {
            throw new Error('O valor solicitado deve ser maior que zero.');
        }

        saldo -= valor;


        const novaTransacao: Transacao = {
            tipoDeTransacao,
            valor: valor * -1,
            data: data,
        };

        salvaTransacao(novaTransacao);
        console.log(GruposDeTransacao())
        
    } else {
        throw new Error('Tipo de transação inválida');
    }

    
    elementoSaldo.textContent = formatarMoeda(saldo);
    renderizarExtrato()
});

function renderizarExtrato(): void {
    const gruposTransacoes: GrupoTransacao[] = GruposDeTransacao()
    elementoRegistroTransacoesExtrato.innerHTML = ''
    let htmlRegistroTransacoes: string = ''

    for (let GrupoTransacao of gruposTransacoes) {
        let htmlTransacoesItem: string = ''
        for (let transacao of GrupoTransacao.transacoes) {
            htmlTransacoesItem += `
            <div class="transacao-item">
                <div class="transacao-info">
                    <span class="tipo">${transacao.tipoDeTransacao}</span>
                    <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
                </div>
                <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
            </div>
            `
        }

        htmlRegistroTransacoes += `
        <div class="transacoes-group">
            <strong class="mes-group">${GrupoTransacao.label}</strong>
            ${htmlTransacoesItem}
        </div>
        `
    }

    if(htmlRegistroTransacoes === ''){
        htmlRegistroTransacoes = '<div>Não há transações registradas</div>'
    }

    elementoRegistroTransacoesExtrato.innerHTML = htmlRegistroTransacoes

    

}
