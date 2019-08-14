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

    $("#license_plate").select2({
        ajax: {
            url: function (params) {
                return '/vehicles/search/' + params.term;
            },
            dataType: 'json',
            delay: 250,
            cache: true,
            processResults: function (data) {
                return {
                    results: $.map(data, function (data) {
                        return {
                            text: data.license_plate,
                            id: data.id
                        }
                    })
                };
            }
        },
        placeholder: 'Buscar clientes...',
        minimumInputLength: 3
    });

    $('#license_plate').on('select2:select', function (data) {
        console.log(data.params.data)
    });


});

