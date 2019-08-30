jQuery(document).ready(function($) {

    "use strict";

    console.log('init budget js...')

   
    console.log(tableData)

    if (tableData.length > 0 ) { 
        console.log(tableData.length + 'linhas de items...')

        for (var i in tableData) {
            addItemTable(tableData[i].item, tableData[i].qtd, tableData[i].price)
        }
    }


    $(".money").maskMoney({allowNegative: true, thousands:'.', decimal:',', affixesStay: false});

    $("#date_budget").mask('99/99/9999');

    $( "#addItem" ).click(function() {
        addItemTable()
    });

    $(document).on("click",".remove",function(element) {
        this.parentNode.parentElement.remove()
        sumTotal()
    });

    $(document).on("focusout",".money",function(element) {
        sumTotal()
    });
   
});

function addItemTable(name, qtd, price) {

    if ('content' in document.createElement('template')) {
        // Instancie a tabela com o HTML tbody e a row com o template
        var t = document.querySelector('#itemrow'),
        td = t.content.querySelectorAll("td");

        td[0].querySelector('input[name="item"]').value = name || "";
        td[1].querySelector('input[name="qtd"]').value = qtd || "";
        td[2].querySelector('input[name="price"]').value = price || "";
       
        // Clone a nova row e insira-a na tabela
        var tb = document.getElementsByTagName("tbody");
        var clone = document.importNode(t.content, true);
        tb[0].appendChild(clone);

        $(".money").maskMoney({allowNegative: true, thousands:'.', decimal:',', affixesStay: false});

    } else {
        console.log('browser dont support the template tag')
    }
}

function sumTotal(){
    $("#total").val("")

    $('.money').each(function () {
        console.log(this.value)
        $("#total").val(currency(this.value, { decimal: ',' }).add(currency($("#total").val(), { decimal: ',' })).format())
    });
}