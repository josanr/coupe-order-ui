/**
 * Created by ruslan on 21.01.2016.
 */

'use strict';
const aristoData = {};
const c = new Core();


$(document).ready(function () {


    cp.init();


    $('#doorInsertMod').find('.filterQuery').on('keyup', function () {
        $('#doorInsertMod').find('.insertList').html(filterInsertList($(this).val()));
    }).keyup();
});


var filterInsertList = function (query) {
    var html = '';
    if (query === undefined) {
        query = '*';
    }
    if (insertList === undefined) {
        return false;
    }
    for (var item in insertList) {
        // Create a string like a.*b.*c.*
        var squery = query.replace('*', '.').split('.').join('.*');
        if (insertList[item]['name'].match(new RegExp(squery, 'ig'))) {
            html += '<option class="' + insertList[item].goods_id
                + '" value=' + insertList[item].goods_id
                + ' data-thick="' + insertList[item]['thick']
                + '" data-type="' + insertList[item]['goods_type']
                + '" data-item="' + item
                + '" data-image="' + insertList[item]['image']
                + '">'
                + insertList[item]['netinfo_code'] + ' - ' + insertList[item]['name']
                + '</option>';
            // console.log(insertList[item]['name']);
        }

    }
    return html;

};

