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

    $("#license_plate_id").select2({
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
        placeholder: 'Buscar Placas...',
        minimumInputLength: 3
    });

    $('#license_plate_id').on('select2:select', function (data) {

        let vehicleID = data.params.data.id;

        if (vehicleID > 0) {
            $.ajax({
                url: "/vehicles/search/customerbyplate/"+vehicleID,
                type: "GET",
                success: function(data){
                    console.log(data)
                    if (data) {
                        populateBudget(JSON.parse(data)[0]);
                    }
                },
                error: function(error){
                    console.log(error)
                }
            });
        }
    });

});

function populateBudget(data) {
    if (data) {
        $("#model").val(data.model)
        $("#yearModel").val(data.yearModel)
        $("#mileage").val(data.mileage)
        $("#customer_registry").val(data.customer_registry)
        $("#customer_name").val(data.customer_name)
        $("#customer_mail").val(data.customer_mail)
        $("#license_plate").val(data.license_plate)
    }
}
