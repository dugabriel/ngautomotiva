jQuery(document).ready(function($) {

    "use strict";

    console.log('init budget js...')

    $(".money").maskMoney({allowNegative: true, thousands:'.', decimal:',', affixesStay: false});

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

    $('#formBudget').submit(function() {
        console.log('antes de mandar')

        //$("#serializeTable").val(JSON.stringify(bodyBudgetTable.innerHTML))
    });
   
});

function addItemTable() {

    if ('content' in document.createElement('template')) {
        // Instancie a tabela com o HTML tbody e a row com o template
        var t = document.querySelector('#itemrow'),
        td = t.content.querySelectorAll("td");
       
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