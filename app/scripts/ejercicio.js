'use strict';
var miTabla;
$(document).ready(function () {
    miTabla = $('#miTabla').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': 'http://localhost/juanda/datatables_servidor/server_processing.php',
        'columns': [
            {
                'data': 'idClinica'
            },
            {
                'data': 'nombre'
            },
            {
                'data': 'razonSocial'
            },
            {
                'data': 'cif'
            },
            {
                'data': 'localidad'
            },
            {
                'data': 'provincia'
            },
            {
                'data': 'direccion'
            },
            {
                'data': 'numClinica'
            },
            {
                'data': 'idTarifa'
            },
            {
                'data': 'nombreTarifa'
            },
            {
                'data': 'idClinica',
                'render': function (data) {
                    return '<a id="editarbtn" class="btn btn-primary editarbtn" href=http://localhost/php/editar.php?id_clinica=' + data + '>Editar</a><a id="borrarbtn" class="borrarbtn btn btn-warning" href=http://localhost/php/borrar.php?id_clinica=' + data + '>Borrar</a>';
                }
           }]

        ,
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
        }
    });
    $('#miTabla').on('click', '.editarbtn', function (e) {
        e.preventDefault();
        $('#tabla').fadeOut(100);
        $('#formulario').fadeIn(100);

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idClinica').val(aData.idClinica);
        $('#nombre').val(aData.nombre);
        $('#numClinica').val(aData.numClinica);
        $('#razonSocial').val(aData.razonSocial);
        $('#cif').val(aData.cif);
        $('#localidad').val(aData.localidad);
        /*lo más cómodo para la provincia sería esto:
        $('#provincia').val(aData.provincia);
        pero como el valor de la provincia viene con digitos en el html (atributo val), tenemos que selecionar por el texto contenido:*/
        $('#provincia option').filter(function () {
            return this.text.toLowerCase() === aData.provincia.toLowerCase();
        }).attr('selected', true);
        $('#direccion').val(aData.direccion);
        $('#cp').val(aData.cp);
    });

    /*Creamos la función que muestre el formulario cuando hagamos click*/
    /*ojo, es necesario hacerlo con el método ON. Tanto por rendimiento como porque puede haber elementos (botones) que todavía no existan en el document.ready*/
    $('#miTabla').on('click', '.editarbtn', function (e) {
        e.preventDefault();
        $('#tabla').fadeOut(100);
        $('#formulario').fadeIn(100);

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idClinica').val(aData.idClinica);
        $('#nombre').val(aData.nombre);
        $('#numClinica').val(aData.numClinica);
        $('#razonSocial').val(aData.razonSocial);
        $('#cif').val(aData.cif);
        $('#localidad').val(aData.localidad);
        /*lo más cómodo para la provincia sería esto: (hemos convertido los values a mayúsculas mediante multicursor y CTRL + K + U (Sublime)*/
        $('#provincia').val(aData.provincia);
        /*Como hemos cambiado las option del select, más cómodo también para el envío de datos, esto que teníamos lo comentamos:*/
        /*$('#provincia option').filter(function() {
            return this.text.toLowerCase() === aData.provincia.toLowerCase();
        }).attr('selected', true);*/
        $('#id_tarifa').val(aData.idTarifa);
        $('#direccion').val(aData.direccion);
        $('#cp').val(aData.cp);
    });


    $('#miTabla').on('click', '.borrarbtn', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        var idClinica = aData.idClinica;



        $.ajax({
                /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
                type: 'POST',
                dataType: 'json',
                url: 'http://localhost/juanda/datatables_servidor/borrar_clinica.php',
                //estos son los datos que queremos actualizar, en json:
                data: {
                    id_clinica: idClinica
                },
            })
            .done(function () {
                var $mitabla = $('#miTabla').dataTable({
                    dRetrieve: true
                });
                $mitabla.fnDraw();
                console.log('Se ha borrado la clinica');
            })
            .fail(function () {
                console.log('Error al borrar la clinica');
            });
        

            $('#tabla').fadeIn(100);
            $('#formulario').fadeOut(100);

        });


        $('#tabla').fadeIn(100);
        $('#formulario').fadeOut(100);




    /*Cargamos los datos para las tarifas:*/
    function cargarTarifas() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'http://localhost/juanda/datatables_servidor/listar_tarifas.php',
            //estos son los datos que queremos actualizar, en json:
            // {parametro1: valor1, parametro2, valor2, ….}
            //data: { id_clinica: id_clinica, nombre: nombre, ….,  id_tarifa: id_tarifa },
            error: function (xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
            },
            success: function (data) {
                $('#id_tarifa').empty();
                $.each(data, function () {
                    $('#id_tarifa').append(
                        $('<option></option>').val(this.id_tarifa).html(this.nombre)
                    );
                });
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax
            }
        });
    }
    cargarTarifas();
$('#enviar').click(function (e) {
            e.preventDefault();
            var idClinica = $('#idClinica').val();
            var nombre = $('#nombre').val();
            var localidad = $('#localidad').val();
            var provincia = $('#provincia').val();
            var direccion = $('#direccion').val();
            var cif = $('#cif').val();
            var cp = $('#cp').val();
            var id_tarifa = $('#id_tarifa').val();

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'http://localhost/juanda/datatables_servidor/modificar_clinica.php',
                //lo más cómodo sería mandar los datos mediante 
                //var data = $( "form" ).serialize();
                //pero como el php tiene otros nombres de variables, lo dejo así
                //estos son los datos que queremos actualizar, en json:
                data: {
                    id_clinica: idClinica,
                    nombre: nombre,
                    localidad: localidad,
                    provincia: provincia,
                    direccion: direccion,
                    cp: cp,
                    id_tarifa: id_tarifa,
                    cif: cif
                },
            }).done(function(){
                    var $mitabla = $('#miTabla').dataTable({
                        dRetrieve: true
                    });
                    $mitabla.fnDraw();
                    console.log('Se ha editado la clinica.');
                })
                .fail(function(){
                    console.log('Ha habido algun error al editar la clinica.')
                })
                 $('#tabla').fadeIn(100);
            $('#formulario').fadeOut(100);
            });
});

/* En http://www.datatables.net/reference/option/ hemos encontrado la ayuda necesaria
para utilizar el API de datatables para el render de los botones */
/* Para renderizar los botones según bootstrap, la url es esta: 
http://getbootstrap.com/css/#buttons
*/