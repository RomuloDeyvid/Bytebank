addEventListener('message', event => {
    conectaAPI()
    setInterval(()=>conectaAPI(), 5000)
})

async function conectaAPI(){
    const conecta = await fetch('https://economia.awesomeapi.com.br/json/last/GBP-BRL')
    const conectaConvertido = await conecta.json()
    
    postMessage(conectaConvertido.GBPBRL)
}