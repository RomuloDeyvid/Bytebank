import { FormatoData } from "../enums/formatoData.js";
import { TipoDeTransacao } from "../enums/tipoDeTransacao.js";
import { formatarData, formatarMoeda } from "../Formatador/formatador.js";

import { Transacao } from "../transação/transacao.js";

let saldo: number = 3000;

const elementoSaldo = document.querySelector('.saldo-valor .valor') as HTMLElement;
const elementoDataAcesso = document.querySelector('.block-saldo time')


if (elementoSaldo != null) {
    elementoSaldo.textContent = formatarMoeda(saldo)
}

if (elementoDataAcesso != null){    
    const dataAtual : Date = new Date()
    elementoDataAcesso.textContent = formatarData(dataAtual, FormatoData.DIA_SEMANA_DIA_MES_ANO)
}


const elementoFormulario = document.querySelector('.block-nova-transacao form') as HTMLFormElement;

elementoFormulario.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
        alert('oi');
        return;
    }

    const inputTipoTransacao = document.querySelector('#tipoTransacao') as HTMLSelectElement
    const inputValor = document.querySelector('#valor') as HTMLInputElement
    const inputData = document.querySelector('#data') as HTMLInputElement

    let tipoDeTransacao: TipoDeTransacao = inputTipoTransacao.value as TipoDeTransacao
    let valor: number = inputValor.valueAsNumber
    let data: Date = new Date(inputData.value)


    if (tipoDeTransacao == TipoDeTransacao.DEPOSITO) {
        saldo += valor

        const novaTransacao: Transacao = {
            tipoDeTransacao,
            valor: valor,
            data: data,
        }
        console.log(novaTransacao)

    } else if (tipoDeTransacao == TipoDeTransacao.TRANSFERENCIA || tipoDeTransacao == TipoDeTransacao.PAGAMENTO_BOLETO) {
        saldo -= valor
        console.log(`Novo saldo após ${tipoDeTransacao}: ${saldo}`);
        const novaTransacao: Transacao = {
            tipoDeTransacao,
            valor: valor,
            data: data,
        }
        console.log(novaTransacao)
    } else {
        alert('Tipo de transação inválida')
    }


    elementoSaldo.textContent = formatarMoeda(saldo)


});