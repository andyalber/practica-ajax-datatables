   'use strict';
   $(document).ready(function() {
       var miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'http://localhost/practica-ajax-datatables/app/php/cargar_doctores.php',
           //'ajax': 'php/cargar_doctores.php',
           'language': {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           },
           'columns': [{
               'data': 'idDoctor'
           },{
               'data': 'nombre'
           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'idClinicas'
           }, {
               'data': 'nombreclinicas'
           },{
               'data': 'nombre',
               /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
               botón de edición o borrado*/
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_doctores.php?id_doctor=' + data + '>Editar</a>';
               }
            }, {
                'data': 'nombre',
                'render': function(data) {
                    return '<a class="btn btn-warning borrarbtn" href=http://localhost/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>'
                }
            }
           ],'columnDefs': [{
               'targets': [0],
               'visible': false,
            },
            {
                "targets": [3],
                "visible": false
            }],
       });

       /*Creamos la función que muestre el formulario cuando hagamos click*/
       /*ojo, es necesario hacerlo con el método ON. Tanto por rendimiento como porque puede haber elementos (botones) que todavía no existan en el document.ready*/
       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);
           $('#formulario').fadeIn(100);

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#idDoctor').val(aData.idDoctor);
           $('#nombre').val(aData.nombre);
           $('#numcolegiado').val(aData.numcolegiado);
       });


       $('#miTabla').on('click', '.borrarbtn', function(e) {
           e.preventDefault();
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var idDoctor = aData.idDoctor;


           $.ajax({
               /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
               type: 'POST',
               dataType: 'json',
               url: 'http://localhost/practica-ajax-datatables/app/php/borrar_doctor.php',
               //url: 'php/borrar_doctor.php',
               //estos son los datos que queremos actualizar, en json:
               data: {
                   id_doctor: idDoctor
               },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
                   alert("Ha entrado en error");
               },
               success: function(data) {
                   //obtenemos el mensaje del servidor, es un array!!!
                   //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                   //actualizamos datatables:
                   /*para volver a pedir vía ajax los datos de la tabla*/
                   miTabla.fnDraw();
               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
       });
       $('#enviar').click(function(e) {
           e.preventDefault();
           idDoctor = $('#idDoctor').val();
           nombre = $('#nombre').val();
           numcolegiado = $('#numcolegiado').val();

           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'http://localhost/practica-ajax-datatables/app/php/modificar_doctor.php',
               //url: 'php/modificar_doctor.php',
               //lo más cómodo sería mandar los datos mediante 
               //var data = $( "form" ).serialize();
               //pero como el php tiene otros nombres de variables, lo dejo así
               //estos son los datos que queremos actualizar, en json:
               data: {
                   id_doctor: idDoctor,
                   nombre: nombre,
                   numcolegiado: numcolegiado,
               },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
               },
               success: function(data) {
                  var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
                  $mitabla.fnDraw();
               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });

           $('#tabla').fadeIn(100);
           $('#formulario').fadeOut(100);

       });
        /* Usamos esto para cargar las clinicas de los doctores */
       function cargarClinicas() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'http://localhost/practica-ajax-datatables/app/php/listar_clinica.php',
               //url: 'php/listar_clinica.php',
               //estos son los datos que queremos actualizar, en json:
               // {parametro1: valor1, parametro2, valor2, ….}
               //data: { id_doctor: idDoctor, nombre: nombre, ….,  id_clinica: idClinica },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
               },
               success: function(data) {
                   $('#id').empty();
                   $.each(data, function() {
                       $('#clinicas').append(
                           $('<option></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });
               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
       }
       cargarClinicas();
   });

   /* En http://www.datatables.net/reference/option/ hemos encontrado la ayuda necesaria
   para utilizar el API de datatables para el render de los botones */
   /* Para renderizar los botones según bootstrap, la url es esta: 
   http://getbootstrap.com/css/#buttons
   */
