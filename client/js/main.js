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
var contentsProeverij = $('.editableProeverij').html();

$(document).ready(function () {
    editable();
    editableProeverij();
});

function editableProeverij() {
    contentsProeverij = $('.editableProeverij').html();
    $('.editableProeverij').blur(function () {
        if (contentsProeverij !== $(this).html()) {
            editProeverij(this);
            contentsProeverij = $(this).html();
        }
    });
}


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


function changeHidden(id) {
    var checkbox = document.getElementById("checkboxThreeInput" + id);
    $.ajax({
        url: "/changeHidden?id=" + id + "&shown='" + checkbox.checked + "'",
        async: false,
        success: function () {
            var parent = checkbox.parentNode.parentNode.parentNode.parentNode.parentNode;
            var classList = parent.classList;
            if (classList.contains("notShown")) {
                classList.remove("notShown");
            } else {
                classList.add("notShown");
            }
        }
    });
}

function editProeverij(item) {
    var changed = item.innerHTML;
    var id = item.parentNode.parentNode.id;
    if (item.parentNode.id === "date") changed = item.value;
    $.ajax({
        url: "/editProeverij?id=" + id + "&changed=" + item.parentNode.id + "&newvalue=" + changed,
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
    editableProeverij();
}

function deleteProeverij(id) {
    if (confirm("Weet je het zeker?")) {
        $.ajax({
            url: "/deleteProeverij?id=" + id,
            async: false,
            complete: function (result) {
                $('#proeverij' + id).fadeOut(1000, function () {
                    $(this).remove();
                });
            }
        });
    }
    editableProeverij();
}

function addProeverij() {
    var div = document.getElementById("proeverijenDiv");
    var date = document.getElementById("proefDate").value;
    var name = document.getElementById("proefName").value;
    var details = document.getElementById("proefDetails").value;

    $.ajax({
        url: "/newProeverij?name=" + name + "&date=" + date + "&details=" + details,
        async: false,
        success: function (id) {
            var basic = document.createElement("div");
            basic.setAttribute("id", "proeverij" + id);
            basic.classList.add("col-sm-6");
            basic.classList.add("col-md-4");

            var mediaDiv = document.createElement("div");
            mediaDiv.classList.add("media");
            mediaDiv.classList.add("wow");
            mediaDiv.classList.add("fadeInDown");
            mediaDiv.classList.add("services-wrap");

            var close = document.createElement("div");
            close.classList.add('pull-right');
            close.onclick = function() {
                deleteProeverij(id)
            };
            close.innerHTML = "&#10006;";

            var left = document.createElement("div");
            left.classList.add("pull-left");

            var section = document.createElement("section");

            var checkbox = document.createElement("div");
            checkbox.classList.add("checkboxThree");

            var checkInput = document.createElement("input");
            checkInput.onclick = function() {
                changeHidden(id)
            };
            checkInput.setAttribute("type", "checkbox");
            checkInput.checked = true;
            checkInput.setAttribute("value", "1");
            checkInput.setAttribute("id", id);
            checkInput.setAttribute("name", "");

            var label = document.createElement("label");
            label.setAttribute("for", "checkboxThreeInput" + id);

            var mediaBody = document.createElement("div");
            mediaBody.classList.add("media-body");
            mediaBody.setAttribute("id", id);

            $('<div id="name"><div class="media-heading pointer editableProeverij" data-toggle="tooltip" data-placement="left" title="Bewerk..." contenteditable>' + name + '</div></div>' +
                '                        <div id="date"><input data-toggle="tooltip" data-placement="left" title="Bewerk..." class="pointer editableProeverij" contenteditable value="' + date + '" type="date"/></div>' +
                '                        <div id="details"><div class="media-heading pointer editableProeverij" data-toggle="tooltip" data-placement="left" title="Bewerk..." contenteditable>' + details + '</div></div>').appendTo(mediaBody);

            checkbox.appendChild(checkInput);
            checkbox.appendChild(label);
            section.appendChild(checkbox);
            left.appendChild(checkbox);
            mediaDiv.appendChild(close);
            mediaDiv.appendChild(left);
            mediaDiv.appendChild(mediaBody);
            basic.appendChild(mediaDiv);

            $(basic).insertBefore('#addDiv');

            document.getElementById("proefDate").value = "";
            document.getElementById("proefName").value = "";
            document.getElementById("proefDetails").value = "";


            $(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip({
                    container: 'body'
                });
            });
        }
    });
    editableProeverij();
}