import selecionaCotacao from "./imprimeCotacao.js";
import imprimeCotacao from "./imprimeCotacao.js";
const graficoDolar = document.querySelector('#graficoDolar')
const graficoIene = document.querySelector('#graficoIene')

const graficoParaDolar = new Chart(graficoDolar, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Dolar',
      data: [],
      borderWidth: 1
    }]
  },
});

const graficoParaIene = new Chart(graficoIene, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Iene',
      data: [],
      borderWidth: 1
    }]
  },
});

function geraHorario() {
  let data = new Date()
  let horario = data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds()
  
  return horario
}
geraHorario()

function adicionarDados(grafico, legenda, dados) {
  grafico.data.labels.push(legenda)
  grafico.data.datasets.forEach((dataset) => {
    dataset.data.push(dados)
  });

  grafico.update()
}

let workerDolar = new Worker('./script/workers/workerDolar.js')

workerDolar.postMessage('usd')

workerDolar.addEventListener('message', event =>{
  let tempo = geraHorario()
  let valor = event.data.ask
  
  adicionarDados(graficoParaDolar, tempo, valor)
  selecionaCotacao('dolar', valor)
})

let workerIene = new Worker('./script/workers/workerIene.js')
workerIene.postMessage('iene')

workerIene.addEventListener('message', event =>{
  let tempo = geraHorario()
  let valor = event.data.ask
  
  adicionarDados(graficoParaIene, tempo, valor)
  selecionaCotacao('iene', valor)
})