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
    if (!item.id) {
       item.id = item.parentNode.parentNode.children[0].children[0].id;
    }
    $.ajax({
        url: "/editWine?id=" + item.id + "&changed=" + item.parentNode.id + "&newvalue=" + item.innerHTML,
        async: false,
        success: function (result) {
        }
    });
}

function editWineColumn(item) {
    $.ajax({
        url: "/editWineColumn?old=" + item.id + "&newvalue=" + item.innerHTML,
        async: false,
        success: function (result) {
        }
    });
}

function addColumn() {
    var columnName = document.getElementById("newColumnName").innerHTML;
    $.ajax({
        url: "/addNewColumnWine?name=" + columnName,
        async: false,
        success: function (result) {
            $('<td data-toggle="tooltip" data-placement="bottom" title="Bewerk..." class="pointer ' + columnName + '"><div id="' + columnName + '" class="editableColumn" contenteditable>' + columnName +
                '</div></td>').insertBefore('td.add');
            $('<td id="' + columnName + '" data-toggle="tooltip" data-placement="bottom" title="Bewerk..." class="pointer ' + columnName + '"><div id="" class="editable" contenteditable></div></td>').insertBefore('.beneathAdd');
            $('<td onclick="deleteColumn(' + "'" + columnName + "'" + ', this)"><span class="glyphicon">&#xe020;</span></td>').insertBefore('.aboveAdd');
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
            contents = $('.editable').html();
            $('.editable').blur(function () {
                if (contents != $(this).html()) {
                    editWine(this);
                    contents = $(this).html();
                }
            });

            contentsColumn = $('.editableColumn').html();
            $('.editableColumn').blur(function () {
                if (contentsColumn != $(this).html()) {
                    editWineColumn(this);
                    contentsColumn = $(this).html();
                }
            });
            document.getElementById("newColumnName").innerHTML = "Nieuwe kolom";
        }
    });
}

function deleteColumn(classname, current) {
    if (confirm("Weet je het zeker?")) {
        $.ajax({
            url: "/deleteWineColumn?delete=" + classname,
            async: false,
            success: function (result) {
                var list = document.getElementsByClassName(classname);
                while (list.length > 0) list[0].remove();
                current.remove();
            }
        });
    }
}

var contents = $('.editable').html();
$('.editable').blur(function () {
    if (contents != $(this).html()) {
        editWine(this);
        contents = $(this).html();
    }
});

var contentsColumn = $('.editableColumn').html();
$('.editableColumn').blur(function () {
    if (contentsColumn != $(this).html()) {
        editWineColumn(this);
        contentsColumn = $(this).html();
    }
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});