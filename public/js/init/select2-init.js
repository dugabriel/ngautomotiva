jQuery(document).ready(function($) {

    "use strict";

    $("#customer").select2({
        ajax: {
            url: function (params) {
                return '/customer/search/' + params.term;
            },
            dataType: 'json',
            delay: 250,
            cache: true,
            processResults: function (data) {
                return {
                    results: $.map(data, function (data) {
                        return {
                            text: data.customer_name,
                            id: data.id
                        }
                    })
                };
            }
        },
        placeholder: 'Buscar clientes...',
        minimumInputLength: 3
    });

});

