import { FormatoData } from "../enums/formatoData.js";
import { TipoDeTransacao } from "../enums/tipoDeTransacao.js";
import { formatarData, formatarMoeda } from "../Formatador/formatador.js";
let saldo = 3000;
const elementoSaldo = document.querySelector('.saldo-valor .valor');
const elementoDataAcesso = document.querySelector('.block-saldo time');
if (elementoSaldo != null) {
    elementoSaldo.textContent = formatarMoeda(saldo);
}
if (elementoDataAcesso != null) {
    const dataAtual = new Date();
    elementoDataAcesso.textContent = formatarData(dataAtual, FormatoData.DIA_SEMANA_DIA_MES_ANO);
}
const elementoFormulario = document.querySelector('.block-nova-transacao form');
elementoFormulario.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
        alert('oi');
        return;
    }
    const inputTipoTransacao = document.querySelector('#tipoTransacao');
    const inputValor = document.querySelector('#valor');
    const inputData = document.querySelector('#data');
    let tipoDeTransacao = inputTipoTransacao.value;
    let valor = inputValor.valueAsNumber;
    let data = new Date(inputData.value);
    if (tipoDeTransacao == TipoDeTransacao.DEPOSITO) {
        saldo += valor;
        const novaTransacao = {
            tipoDeTransacao,
            valor: valor,
            data: data,
        };
        console.log(novaTransacao);
    }
    else if (tipoDeTransacao == TipoDeTransacao.TRANSFERENCIA || tipoDeTransacao == TipoDeTransacao.PAGAMENTO_BOLETO) {
        saldo -= valor;
        console.log(`Novo saldo após ${tipoDeTransacao}: ${saldo}`);
        const novaTransacao = {
            tipoDeTransacao,
            valor: valor,
            data: data,
        };
        console.log(novaTransacao);
    }
    else {
        alert('Tipo de transação inválida');
    }
    elementoSaldo.textContent = formatarMoeda(saldo);
});
