jQuery(function ($) {



    // accordian
    $('.accordion-toggle').on('click', function () {
        $(this).closest('.panel-group').children().each(function () {
            $(this).find('>.panel-heading').removeClass('active');
        });

        $(this).closest('.panel-heading').toggleClass('active');
    });

    //Initiat WOW JS
    new WOW().init();

    // portfolio filter
    $(window).load(function () {
        'use strict';
        var $portfolio_selectors = $('.portfolio-filter >li>a');
        var $portfolio = $('.portfolio-items');
        $portfolio.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $portfolio_selectors.on('click', function () {
            $portfolio_selectors.removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $portfolio.isotope({filter: selector});
            return false;
        });
    });

    // Contact form
    var form = $('#main-contact-form');
    form.submit(function (event) {
        event.preventDefault();
        var form_status = $('<div class="form_status"></div>');
        $.ajax({
            url: $(this).attr('action'),

            beforeSend: function () {
                form.prepend(form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn());
            }
        }).done(function (data) {
            form_status.html('<p class="text-success">' + data.message + '</p>').delay(3000).fadeOut();
        });
    });

    //Pretty Photo
    $("a[rel^='prettyPhoto']").prettyPhoto({
        social_tools: false
    });

    // //Google Map
    // var get_latitude = $('#google-map').data('latitude');
    // var get_longitude = $('#google-map').data('longitude');
    //
    // function initialize_google_map() {
    //     var myLatlng = new google.maps.LatLng(get_latitude, get_longitude);
    //     var mapOptions = {
    //         zoom: 14,
    //         scrollwheel: false,
    //         center: myLatlng
    //     };
    //     var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
    //     var marker = new google.maps.Marker({
    //         position: myLatlng,
    //         map: map
    //     });
    // }
    //
    // google.maps.event.addDomListener(window, 'load', initialize_google_map);
});

function editWine(item) {
    var id = item.parentNode.parentNode.id.substring(4);
    $.ajax({
        url: "/editWine?id=" + id + "&changed=" + item.parentNode.id + "&newvalue=" + item.innerHTML,
        async: false,
        complete: function () {
            $(item).css('backgroundColor', 'green');
            $(item).animate({
                'opacity': '0.5'
            }, 1000, function () {
                $(item).css({
                    'backgroundColor': '#fff',
                    'opacity': '1'
                });
            });
        }
    });
    editable();
}

function editWineColumn(item) {
    $.ajax({
        url: "/editWineColumn?old=" + item.id + "&newvalue=" + item.innerHTML,
        async: false,
        complete: function () {
            $(item).css('backgroundColor', 'green');
            $(item).animate({
                'opacity': '0.5'
            }, 1000, function () {
                $(item).css({
                    'backgroundColor': '#fff',
                    'opacity': '1'
                });
            });
        }
    });
    editable();
}

function addColumn() {
    var columnName = $("#newColumnName").html();
    if (!HasColumn(columnName)) {
        $.ajax({
            url: "/addNewColumnWine?name=" + columnName,
            async: false,
            success: function () {
                $('<td style="font-weight: bold;" data-toggle="tooltip" data-placement="bottom" title="Bewerk..." class="pointer ' + columnName + '"><div class="editableColumn" contenteditable>' + columnName +
                    '</div></td>').insertBefore('td.add');
                $('<td id="' + columnName + '" data-toggle="tooltip" data-placement="bottom" title="Bewerk..." class="pointer ' + columnName + '"><div class="editable" contenteditable></div></td>').insertBefore('.beneathAdd');
                columnName = "'" + columnName + "'";
                $('<td onclick="deleteColumn(' + columnName + ', ' + "this" + ')"><span class="glyphicon">&#xe020;</span></td>').insertBefore('.aboveAdd');
                $('[data-toggle="tooltip"]').tooltip({
                    container: 'body'
                });
                document.getElementById("newColumnName").innerHTML = "Nieuwe kolom";
                var colspan = document.getElementsByClassName("addWine")[0].getAttribute("colspan");
                colspan++;
                document.getElementsByClassName("addWine")[0].setAttribute("colspan", colspan);
            }
        });
    } else {
        alert("Deze kolom bestaat al!");
    }
    editable();
}

/**
 * @return {boolean}
 */
function HasColumn(text) {
    var bool = false;
    var cells = document.getElementById("wineTable").tHead.rows[1].cells;
    for (var i = 0; i < cells.length - 2; i++) {
        if (cells[i].children[0].innerHTML === text) {
            bool = true;
        }
    }
    return bool;
}

function deleteColumn(classname, current) {
    if (confirm("Weet je het zeker?")) {
        $.ajax({
            url: "/deleteWineColumn?delete=" + classname,
            async: false,
            success: function () {
                var list = document.getElementsByClassName(classname);
                while (list.length > 0) list[0].remove();
                current.remove();
                var colspan = document.getElementsByClassName("addWine")[0].getAttribute("colspan");
                colspan--;
                document.getElementsByClassName("addWine")[0].setAttribute("colspan", colspan);
            }
        });
    }
    editable();
}

function deleteWine(id) {
    if (confirm("Weet je het zeker?")) {
        $.ajax({
            url: "/deleteWine?id=" + id,
            async: false,
            success: function (result) {
                document.getElementById('wine' + id).remove();
            }
        });
    }
    editable();
}

function newWine() {
    var idNew;
    var table = document.getElementById("wineTable");
    $.ajax({
        url: "/newWine?",
        async: false,
        success: function (id) {
            idNew = id;
            //The clone part
            $(table.rows[table.rows.length - 2]).clone().insertBefore(table.rows[table.rows.length - 1]);

            // Make the new row visible
            var hidden = document.getElementsByClassName("hidden");
            hidden[0].lastElementChild.onclick = function () {
                deleteWine(idNew);
            };
            hidden[0].setAttribute("id", "wine" + idNew);
            hidden[0].className = "";
            table.rows[table.rows.length - 3].lastElementChild.setAttribute("id", idNew);

            $(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip({
                    container: 'body'
                });
            });
        }
    });
    editable();
}

var contents = $('.editable').html();
var contentsColumn = $('.editableColumn').html();
$(document).ready(function () {
    editable();
});

function editable() {
    contents = $('.editable').html();
    $('.editable').blur(function () {
        if (contents !== $(this).html()) {
            editWine(this);
            contents = $(this).html();
        }
    });

    contentsColumn = $('.editableColumn').html();
    $('.editableColumn').blur(function () {
        if (contentsColumn !== $(this).html()) {
            editWineColumn(this);
            contentsColumn = $(this).html();
        }
    });
}

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});

function alertTemp(melding) {
    var tijd_datum = new Date();
    var dag = tijd_datum.getDay(); //dag in woorden
    var dag2 = tijd_datum.getDate(); // dag in getal
    var maand = tijd_datum.getMonth()+1; // +1 want js begint bij 0 te tellen
    var jaar = tijd_datum.getFullYear();

    var uur = tijd_datum.getHours();
    var minuten = tijd_datum.getMinutes();
    var seconden = tijd_datum.getSeconds();

    var maandarray = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    var dagarray = ['zondag','maandag','dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
    alert(dagarray[dag]+" "+dag2+" "+maandarray[maand]+" "+jaar+" "+uur+":"+minuten+":"+seconden);
}
