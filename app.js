class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor, litros) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
        this.litros = litros
    }

    validarCampo() {
        for (let campos in this) {
            if (this[campos] == undefined || this[campos] == '' || this[campos] == null) {
                return false
            }
        }
        return true
    }
}

class litragem {
    constructor(litragemdisponivel, limitelitros) {
        this.litragemdisponivel = litragemdisponivel
        this.limitelitros = limitelitros
    }

    limite_gastos() {
        let limitelitros = 500
        return limitelitros
    }

    obterlitragemdisponivel() {
        return this.litragemdisponivel
    }

}

class BancoDeDadosLocal {
    constructor() {
        let id = localStorage.getItem('ID')
        if (id === null) {
            localStorage.setItem('ID', 0)
        }
    }
    getProximoId() {
        let pxId = localStorage.getItem('ID')
        return parseInt(++pxId)
    }
    GravarInformacoes(dadosDespesa) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(dadosDespesa))
        localStorage.setItem('ID', id)
    }

    recuperarListagemCompletaDepesas() {
        let despesas = []
        let id = localStorage.getItem('ID')

        for (let i = 1; i <= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue
            }

            despesa.id = i

            despesas.push(despesa)
            bancoDados.RelatorioDespesasGeral(despesas)
        }
        return despesas

    }
    pesquisar(despesas) {
        let filtroDespesa = new Array

        filtroDespesa = this.recuperarListagemCompletaDepesas()

        if (despesas.ano != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.ano == despesas.ano))
        }

        if (despesas.mes != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.mes == despesas.mes))
        }

        if (despesas.dia != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.dia == despesas.dia))
        }

        if (despesas.tipo != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.tipo == despesas.tipo))
        }

        if (despesas.descricao != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.descricao == despesas.descricao))
        }

        if (despesas.valor != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.valor == despesas.valor))
        }

        if (despesas.litros != '') {
            filtroDespesa = (filtroDespesa.filter(dado => dado.litros == despesas.litros))
        }

        return filtroDespesa
    }

    excluirDespesa(id) {
        localStorage.removeItem(id)
    }
    editardespesa(id) {
        $('#modalRegistroDespesa').modal('show');
        document.getElementById('modal-titulo').innerHTML = 'Editar';
        document.getElementById('modal_titulo_header').className = 'modal-header bg-warning text-light';
      
        document.getElementById('modal-btn').onclick = function () {
          const despesa = JSON.parse(localStorage.getItem(id)) || {};
      
          const novadesc = document.querySelector("#novadesc").value;
          const novovalor = document.querySelector("#novovalor").value;
          const novoslitros = document.querySelector("#novoslitros").value;
          const novacat = document.querySelector("#novacat").value;
      
          if (novadesc) {
            despesa.descricao = novadesc;
          }
      
          if (novovalor) {
            despesa.valor = novovalor;
          }
      
          if (novoslitros) {
            despesa.litros = novoslitros;
          }
      
          if (novacat) {
            despesa.categoria = novacat;
          }
      
          localStorage.setItem(id, JSON.stringify(despesa));
          $('#modalRegistroDespesa').modal('hide');
          window.location.reload();
        };
      }
      

    relatorioDespesas(despesas) {
        let percentualTotal = 0

        Litragem.limite_gastos()

        let somalitrostotal = despesas.reduce((incremento, acumulador) => {
            return parseFloat(incremento) + parseFloat(acumulador.litros)
        }, 0)

        if (somalitrostotal) {
            document.getElementById('progressogastototal').className = 'bg-danger progress-bar'

            percentualTotal = (somalitrostotal * 100) / (Litragem.limite_gastos())
            document.getElementById('progressogastototal').style.width = `${percentualTotal}%`


            document.getElementById('progressogastototal').innerHTML = `${percentualTotal.toFixed(0)}%`
            document.getElementById('litragemdisponivel').innerHTML = `${Litragem.limite_gastos()} litros`

            if (percentualTotal < 30) {
                document.getElementById('progressogastototal').className = 'bg-success progress-bar'
            }

            if (percentualTotal > 30 && percentualTotal < 60) {
                document.getElementById('progressogastototal').className = 'bg-warning progress-bar'
            }

            if (percentualTotal > 60 && percentualTotal <= 100) {
                document.getElementById('progressogastototal').className = 'bg-danger progress-bar'
            }
        }
    }

    registroRecente(despesas) {
        let totalDespesas = 0

        despesas.forEach(function (despesa) {
            totalDespesas += parseFloat(despesa.valor)
        });

        document.getElementById('somadespesastotal').innerHTML = `R$ ${totalDespesas}`
    }

    RelatorioDespesasGeral(despesas) {
        let somalitrostotal = 0

        Litragem.limite_gastos()
        despesas.forEach(function (despesa) {
            somalitrostotal += parseFloat(despesa.litros)
        });

        let litragemdisponivel = Litragem.limite_gastos() - somalitrostotal

        document.getElementById('somalitrostotal').innerHTML = `${somalitrostotal} litros`
    }
}
let bancoDados = new BancoDeDadosLocal()
let infoData = new Date()
let Litragem = new litragem()


function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    let litros = document.getElementById('litros')

    if (dia.value == "") {
        dia.value = infoData.getDate()
    }
    if (ano.value == 0) {
        ano.value = infoData.getFullYear()
    }
    if (mes.value == 0) {
        mes.value = infoData.getMonth()
    }

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,
        litros.value
    )

    if (despesa.validarCampo()) {
        bancoDados.GravarInformacoes(despesa)
        $('#modalRegistroDespesa').modal('show')

        document.getElementById('modal-titulo').innerHTML = 'Sucesso!'
        document.getElementById('modal_titulo_header').className = 'modal-header bg-success  text-light'
        document.getElementById('modal-corpo').innerHTML = 'Dados gravados com sucesso!'
        document.getElementById('modal-corpo').innerHTML = `<strong>${descricao.value}</strong>, valor: <strong>R$ ${valor.value} </strong> e <strong> ${litros.value} litros </strong> foi adicionado.`
        document.getElementById('modal-btn').className = 'btn btn-success'
        document.getElementById('modal-btn').innerHTML = 'Ok'

        document.getElementById('statusInfo').innerHTML = `<strong>Dados salvos:</strong> <br> Mês:${mes.value} <br> Dia: ${dia.value} <br> 
            Descrição: ${descricao.value} <br> Valor: R$ ${valor.value} <br> Litros:${litros.value} <br>`

        document.getElementById('somalitrosrecentes').innerHTML = `${litros.value} litros`
        document.getElementById('somadespesasrecentes').innerHTML = `R$ ${valor.value}`

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        litros.value = ''


    } else {
        $('#modalRegistroDespesa').modal('show')
        document.getElementById('modal-titulo').innerHTML = 'Erro'
        document.getElementById('modal_titulo_header').className = 'modal-header bg-warning text-light'
        document.getElementById('modal-corpo').innerHTML = 'Existem dados que não foram preenchidos!'
        document.getElementById('modal-btn').className = 'btn btn-danger'
        document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir!'
    }
}

function CarregaListagemDespesas(despesas = [], filtroSistema = false) {

    if (despesas.length == 0 && filtroSistema == false) {
        despesas = bancoDados.recuperarListagemCompletaDepesas()
    }

    let listaDespesas = document.getElementById('listagemDespesas')
    listaDespesas.innerHTML = ''
    despesas.forEach(function (despesaForEach) {

        let tr = listaDespesas.insertRow()

        tr.insertCell(0).innerHTML = `${despesaForEach.dia}/${despesaForEach.mes}/${despesaForEach.ano}`

        switch (despesaForEach.tipo) {
            case '1': despesaForEach.tipo = 'Pago'
                break;

            case '2': despesaForEach.tipo = 'Pendente'
                break;

            case '3': despesaForEach.tipo = 'Atrasado'
                break;
        }

        tr.insertCell(1).innerHTML = despesaForEach.tipo
        tr.insertCell(2).innerHTML = despesaForEach.descricao
        tr.insertCell(3).innerHTML = despesaForEach.valor
        tr.insertCell(4).innerHTML = despesaForEach.litros

        let botaoExcluir = document.createElement('button')

        botaoExcluir.className = 'btn btn-outline-danger'
        botaoExcluir.innerHTML = '<i class="fas fa-trash"></i>'
        botaoExcluir.id = `ID_DESPESA_${despesaForEach.id}`

        botaoExcluir.onclick = function () {

            let id = this.id.replace('ID_DESPESA_', '')

            bancoDados.excluirDespesa(id)
            window.location.reload()
        }
        tr.insertCell(5).append(botaoExcluir)

        let botaoeditar = document.createElement('button')

        botaoeditar.className = 'btn btn-warning'
        botaoeditar.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        botaoeditar.id = `ID_DESPESA_${despesaForEach.id}`

        botaoeditar.onclick = function () {

            let id = this.id.replace('ID_DESPESA_', '')

            bancoDados.editardespesa(id,despesas)
        }
        tr.insertCell(6).append(botaoeditar)
    })

    bancoDados.registroRecente(despesas)
    bancoDados.relatorioDespesas(despesas)
    bancoDados.RelatorioDespesasGeral(despesas)

}

function validarDia() {
    if (dia.value > 31) {
        $('#modalRegistroDespesa').modal('show')
        document.getElementById('modal-titulo').innerHTML = 'Erro - dia digitado é inválido'
        document.getElementById('modal_titulo_header').className = 'modal-header bg-warning text-light'
        document.getElementById('modal-corpo').innerHTML = `Você digitou um valor: <strong>${dia.value}</strong> para dia. <strong>Volte e faça o ajuste ou
            será considerado o dia atual do sistema.</strong>`
        document.getElementById('modal-btn').className = 'btn btn-danger'
        document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir!'
        dia.value = infoData.getDate()
    }

}

function pesquisarDespesasCadastradas() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    let litros = document.getElementById('litros')

    let despesaPesquisa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value, litros.value)
    let despesas = bancoDados.pesquisar(despesaPesquisa)
    CarregaListagemDespesas(despesas, true)
}



function limparCampos() {
    ano.value = ""
    mes.value = ""
    dia.value = ""
    tipo.value = ""
    descricao.value = ""
    valor.value = ""
    litros.value = ""

    localStorage.clear()
}

