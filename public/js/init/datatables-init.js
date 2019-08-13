(function ($) {
    //    "use strict";

	var listCustomers = $('#listCustomers').DataTable( {
        "language": {
			"url": "../js/lib/data-table/Portuguese-Brasil.json",
			"lengthMenu": [[50, 100, -1], [50, 100, "All"]]
		}
	} );

	var listCustomers = $('#listVehicles').DataTable( {
        "language": {
			"url": "../js/lib/data-table/Portuguese-Brasil.json",
			"lengthMenu": [[50, 100, -1], [50, 100, "All"]]
		}
	} );
	
	/*$('#listCustomers tbody').on('click', 'tr', function () {
        var data = listCustomers.row( this ).data();
        alert( 'You clicked on '+data[0]+'\'s row' );
    } );*/

})(jQuery);