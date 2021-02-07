
const Modal = {
    open() {
        //abrir modal
        //adicionar a classe active ao modal
        document.querySelector('.modal-overlay').classList.add('active')

    },
    close() {
        //fechar o modal
        //remover a classe active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

/*Eu preciso criar um array de obejtos que receba os valores da tabela, que ate agora ainda esta
feita no maozao.
*/

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        /*Explicando o que eu to fazendo: na função debaixo aqui, a set, eu to transformando as transações que antes estavam como array em uma string, pq eu só consigo guarar como string. Pra pegar de volta eu preciso transformar de string pra array, ai eu uso o JSON.parse*/ 
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions))
        /*aqui eu uso o json.stringify pra transformar minha array de transações numa string pra poder guardar*/

    }
}


const Transaction = {

    /*Exemplo de transações, forma de passar:
     [
        {
            description: 'Luz',
            amount: -50000,
            date: '23/01/2021'
        },
        {
            description: 'Website',
            amount: 500000,
            date: '23/01/2021'
        }]*/ 
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)// Essa função push coloca dentro do array um elemento 
        //que eu passo, no caso ai a transaction.
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income = income + transaction.amount;
            }

        })
        //somar as entradas
        //pegar as transações
        //verificar se  é maior que 0, se for
        //somar a uma variavel e retornar
        //somando para cada transação
        return income;
    },
    expenses() {
        //somar as saidas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }

        })
        return expense;
    },
    total() {
        //entradas - saidas

        return Transaction.incomes() + Transaction.expenses()


    }
}//Criando um objeto e as suas funcionalidades

/*Eu preciso pegar minhas transações do meu objeto  aqui e colocar no html*/

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""
    },
    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)


        const html = `
        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick = "Transaction.remove(${index})" src="assets/assets/minus.svg" alt="remover transação"></td>
      
        `
        return html
    },//Aqui a gente ta criando a mascara html q vai rodar la no index
    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

//Tentando arrumar o formato da moeda

const Form = {

    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Preencha todos os campos.")
        }

    },
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }

    },
    saveTransaction(transaction) {
        Transaction.add(transaction)

    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            //salvar
            Form.saveTransaction(transaction)
            //apagar o formulario para q possa salvar outra transaçaõ
            Form.clearFields()
            //Depois de tudo eu quero q o modal feche
            Modal.close()

        } catch (error) {
            alert(error.message)
        }

        //aqui ele vai ter q certificar se todas as informações foram preenchidas

    }
}


const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        //Outra opção
        //value = Number(value.replace(/|,|./g,""))*100
        return value
    },
    formatDate(date) {
        const splitedDate = date.split("-")
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        /*Vamos agora nos certificar que o value que esta entrando 
        aqui seja uma string para poder utilizar a funcionalidade
        replace para     
        podemos fazer assim por exemplo:
         ##value = String(value).replace('0','Discover')
         Ai ele vai pegar o primeiro valor de 0 que ele encontrar
         na string e substituir pela palavra. para substituir todos 
         podemos usar o seguinte:
          value = String(value).replace(/0/g,'Discover')
          Dentro dessas duas barras //, podemos usar o comando \D,
          que significa: PEGA TUDO QUE NAO FOR NUMERO.*/
        value = String(value).replace(/\D/g, '')//aqui eu tirei o q nao é numero, ou seja os sinais.

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })//Transformando a moeda para local brasil
        return signal + value
    }
}

//Chamando o objeto

//DOM.addTransaction(transactions[0])

//Agora é adicionar as outras transações



/*Transaction.add({
    id: 29,
    description:'Academia',
    amount: -5000,
    date: '23/01/2021'

})*/
//console.log(Transaction.all)

//Criar uma função pra rodar o app de forma geral

//Aqui vamos manipular os dados no storage pra ficar salvo e 
//buscar quando a gente precisar

const App = {
    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)

            Storage.set(Transaction.all)
            //
        })//funcionalidade de tipo array

        DOM.updateBalance()
    },
    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()

