jQuery(document).ready(function($) {

    "use strict";

    console.log('init budget js...')

    $( "#addItem" ).click(function() {
        addItemTable()
    });

    $(document).on("click",".remove",function(element) {
        this.parentNode.parentElement.remove()
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

        $(".money").maskMoney({prefix:'R$ ', allowNegative: true, thousands:'.', decimal:',', affixesStay: false});

    } else {
        console.log('browser dont support the template tag')
    }
}