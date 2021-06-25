
function AddInBasket() {

    let option = $(".DropAmount").find('option:selected');
    var value = option.text();//to get content of "value" attrib
    let amount = parseInt(value);
    let price = parseFloat($("#price").text());

    let IDProduct = parseInt($(".btn-add-basket").attr("id"));
    let object = {
        id: IDProduct,
        count: amount
    };
    let obj = JSON.stringify(object)
    $.ajax({
        type: 'POST',
        url: '/BasketProducts/Create',
        contentType: 'application/json; charset=utf-8',
        data: obj,
        success: function (data) {
            if (data.autorization) {
                if (data.check) {
                    //const popupActive = document.querySelector('popup_basket_text_danger-1');
                    popupOpen(popup_addproduct);
                }
                else {
                    //let element = document.getElementById('popup_basket_text_danger-2')
                    //popupOpen(element)
                    $("#MaxAmount").text(data.amount)
                    popupOpen(popup_basket10);
                }
            }
            else {
                popupOpen(popup_basket);
            }           
        },
        error: function (data) {
            alert(data.responseText);
        }
    });

}
