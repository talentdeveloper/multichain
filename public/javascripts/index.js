$(function () {
    var overlay = $('.overlay');
    var header = $('.overlay-header');
    var content = $('.overlay-content');

    $('#read-form').on('submit', readTransaction);
    $('#read-headers-form').on('submit', readHeaders);
    $('#write-form').on('submit', writeTransaction);
    $('.overlay-btn').on('click', closeOverlay);


    function readHeaders(e) {
        e.preventDefault();
        var blockParam = $('#read-headers-input').val();
        if (blockParam) {
            $.get('/mc/read-header/' + blockParam)
                .then(function (data) {
                    displayResponse(data, 'Block ' + blockParam + ' Headers');
                })
                .catch(function (err) {
                    displayResponse(err, 'ERROR!!!', true);
                })
        }
    }

    function readTransaction(e) {
        e.preventDefault();
        var txid = $('#read-input').val();
        if (txid) {
            $.get('/mc/read/' + txid)
                .then(function (data) {
                    displayResponse(data, 'Transaction txid: ' + txid);
                })
                .catch(function (err) {
                    displayResponse(err, 'ERROR!!!', true);
                })
        }

    }

    function writeTransaction(e) {
        e.preventDefault();
        var transaction = $('#write-input').val();
        if (transaction) {
            transaction = transaction.split(';');
            var params = {
                transactionsList: JSON.parse(transaction[0]),
                addresses: transaction[1] ? JSON.parse(transaction[1]) : null
            };
            $.ajax({
                type: 'POST',
                url: '/mc/write',
                data: JSON.stringify(params),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .then(function (data) {
                    displayResponse(data, 'Transaction has been written');
                })
                .catch(function (err) {
                    displayResponse(err, 'ERROR!!!', true);
                })
        }

    }

    function displayResponse(data, text, error) {
        overlay.show();
        header.text(text);
        content.append(JSON.stringify(data));
        if (error) {
            header.addClass('overlay-header_error');
        }
    }

    function closeOverlay() {
        header.empty().removeClass('overlay-header_error');
        content.empty();
        overlay.hide();
    }
});