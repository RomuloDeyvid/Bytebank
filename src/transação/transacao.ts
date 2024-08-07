import { TipoDeTransacao } from "../enums/tipoDeTransacao.js"

export type Transacao = {
    tipoDeTransacao: TipoDeTransacao,
    valor: number,
    data: Date
}