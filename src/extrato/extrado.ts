import { Tiporansacao } from "../enums/transacao.js";

let saldo = 3000;

const elementoSaldo = document.querySelector('.saldo-valor .valor') as HTMLElement;

if(elementoSaldo != null){
    elementoSaldo.textContent = saldo.toString();
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

    let tipoTransacao : string= inputTipoTransacao.value
    let valor : number = inputValor.valueAsNumber
    let data : Date = new Date(inputData.value) 

    if(tipoTransacao == 'Depósito'){
        saldo += valor
        
    }else if (tipoTransacao == 'Transferência' || tipoTransacao == 'Pagamento de Boleto') {
        saldo -= valor
        console.log(`Novo saldo após ${tipoTransacao}: ${saldo}`);
    }else{
        alert('Tipo de transação inválida')
    }

    const novaTransacao = {
        tipoTransacao,
        valor,
        data
    }
    console.log(novaTransacao)
    elementoSaldo.textContent = saldo.toString();

});

type Transacao = {
    tipoTransacao: Tiporansacao,
    data : Date,
    valor: number
}

const novaTransacao : Transacao = {
    tipoTransacao : Tiporansacao.DEPOSITO,
    data: new Date(),
    valor: 0

}