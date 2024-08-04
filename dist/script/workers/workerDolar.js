
async function conectaAPI(){
    const conecta = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
    const conectaConvertido = await conecta.json()
    
    postMessage(conectaConvertido.USDBRL)
    
}

addEventListener('message', ()=>{
    conectaAPI()
    setInterval(() => conectaAPI(), 5000)
})