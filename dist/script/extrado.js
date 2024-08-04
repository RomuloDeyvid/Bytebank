alert('compilacao TSS');
let saldo = 3000;
const elementoSaldo = document.querySelector('.saldo-valor .valor');
if (elementoSaldo != null) {
    elementoSaldo.textContent = saldo.toString();
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
    let tipoTransacao = inputTipoTransacao.value;
    let valor = inputValor.valueAsNumber;
    let data = new Date(inputData.value);
    if (tipoTransacao == 'Depósito') {
        saldo += valor;
    }
    else if (tipoTransacao == 'Transferência' || tipoTransacao == 'Pagamento de Boleto') {
        saldo -= valor;
        console.log(`Novo saldo após ${tipoTransacao}: ${saldo}`);
    }
    else {
        alert('Tipo de transação inválida');
    }
    const novaTransacao = {
        tipoTransacao,
        valor,
        data
    };
    console.log(novaTransacao);
    elementoSaldo.textContent = saldo.toString();
});
