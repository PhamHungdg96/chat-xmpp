var Peek = {
    connection: null,
    show_traffic: function (body, type) {
        console.log('hung_l');
        if (body.childNodes.length > 0) {
            var console_p = $('#console').get(0);
            var at_bottom = console_p.scrollTop >= console_p.scrollHeight -
            console_p.clientHeight;;
            $.each(body.childNodes, function () {
                $('#console').append("<div class='" + type + "'>" +
                    Peek.xml2html(Strophe.serialize(this)) +
                    "</div>");
            });
            if (at_bottom) {
                console_p.scrollTop = console_p.scrollHeight;
            }
        }
    },
    xml2html: function (s) {
        return s.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
};
$(document).ready(function () {
    $('#login_dialog').dialog({
        autoOpen: true,
        draggable: false,
        modal: true,
        title: 'Connect to XMPP',
        buttons: {
            "Connect": function () {
                $(document).trigger('connect', {
                    jid: $('#jid').val(),
                    password: $('#password').val()
                });
                $('#password').val('');
                $(this).dialog('close');
            }
        }
    });
});
$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection(
        "wss://chat.example.com/xmpp-websocket");
    conn.xmlInput = function (body) {
        Peek.show_traffic(body, 'incoming');
    };
    conn.xmlOutput = function (body) {
        Peek.show_traffic(body, 'outgoing');
    };
    conn.connect(data.jid, data.password, function (status) {
        if (status === Strophe.Status.CONNECTED) {
            $(document).trigger('connected');
        } else if (status === Strophe.Status.DISCONNECTED) {

            $(document).trigger('disconnected');
            console.log('disconnected')
        }
    },6000,300);
    Peek.connection = conn;
});
$(document).bind('connected', function () {
    $('#disconnect_button').removeAttr('disabled');
    // inform the user
    console.log("Connection established.");
});
$(document).bind('disconnected', function () {
    $("#disconnect_button").attr("disabled", "disabled");
    console.log("Connection terminated.");
    // remove dead connection object
    Peek.connection = null;
});