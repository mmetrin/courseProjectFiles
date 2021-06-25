$('img[class="arrow-top"]').hide();

function onEntry(entry) {
    entry.forEach(change => {
        if (change.isIntersecting) {
            change.target.classList.add('element-show');
        }
        //else {
        //    change.target.classList.remove('element-show');

        //}
    });
}

let options = {
    threshold: [0.5]
};
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.element-animation');

for (let elm of elements) {
    observer.observe(elm);
}



$(window).scroll(function () {
    if ($(window).scrollTop() > 700) {
        $('img[class="arrow-top"]').show();
   
    }   
    else {
        $('img[class="arrow-top"]').hide();
    }
});

$('img[class="arrow-top"]').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});


$('button[name="exit"]').click(function () {
    location.href = "/Home/Logout";
});

$('button[name="popup_addproduct"]').click(function () {
    popupClose(popup_addproduct);
});

$('button[name="popup_basket10"]').click(function () {
    popupClose(popup_basket10);
});

$('.DropAmount').change(function () {
    //Use $option (with the "$") to see that the variable is a jQuery object
    let option = $(this).find('option:selected');
    //Added with the EDIT
    var value = option.val();//to get content of "value" attrib
    let IdProduct = $(this).attr("id");
    let object = {
        idProd: IdProduct,
        amount: value
    };
    let obj = JSON.stringify(object)
    $.ajax({
        type: 'POST',
        url: '/BasketProducts/ChangeElement',
        contentType: 'application/json; charset=utf-8',
        data: obj,
        success: function (data) {

            $(".DropAmount#" + IdProduct + "").prev().text(data.newPrice)
            let PricesMassive = $(".ForPrice");
            let AllPrice = 0;
            for (let i = 0; i < PricesMassive.length; i++) {

                AllPrice += parseFloat($(PricesMassive[i]).text());
            }
            $("#ForAllPrice").text(AllPrice);
            function onEntry(entry) {
                entry.forEach(change => {
                    if (change.isIntersecting) {
                        change.target.classList.add('element-show');
                    }
                    //else {
                    //    change.target.classList.remove('element-show');

                    //}
                });
            }

            let options = {
                threshold: [0.5]
            };
            let observer = new IntersectionObserver(onEntry, options);
            let elements = document.querySelectorAll('.element-animation');

            for (let elm of elements) {
                observer.observe(elm);
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
});
function DeleteFromBasket(item) {
    let id = item.id
    let object = {
        id: id
    };
    let obj = JSON.stringify(object)
    $.ajax({
        type: 'POST',
        url: '/BasketProducts/Delete',
        contentType: 'application/json; charset=utf-8',
        data: obj,
        success: function (data) {

            location.reload();
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}



