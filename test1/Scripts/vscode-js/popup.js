//прелоадер
$(window).on('load', function () {
    $preloader = $('.preloader'),
        $loader = $preloader.find('.loader');
    $loader.fadeOut(10000);
    $preloader.delay(1000).fadeOut('slow');
});

function AddText(item) {

    let id = $(item).attr("name")
    let element = document.getElementById('popup_details')
    let object = {
        id: id,
    };
    let obj = JSON.stringify(object)
    $.ajax({
        type: 'POST',
        url: '/Home/LoadDetailsProduct',
        contentType: 'application/json; charset=utf-8',
        data: obj,
        success: function (data) {
            $("#body_content").html(data)
            $(".btn-add-basket").attr("id", id)
            popupOpen(element)
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
};
//popup модальные окна
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;//время для дальнейшего setTimeOut РАВНОЕ transition элемента (для блокировки скролла)

if (popupLinks.length > 0) {//проверяем, присутствуют ли объекты с классом popup-link вообще
    for (let index = 0; index < popupLinks.length; index++) {//бегаем по каждой ссылочке
        const popupLink = popupLinks[index];//получаем каждую ссылку в переменную popupLink
        popupLink.addEventListener("click", function (e) {//вешаем событие при клике
            const popupName = popupLink.getAttribute('href').replace('#', '');//заменяем # на пустой элемент, чтобы взять просто имя переменной
            const curentPopup = document.getElementById(popupName);//получаем элемент, id которого=popupName
            popupOpen(curentPopup);//полученный объект отправляем в функцию для открытия попапа
            e.preventDefault();//запрещаем перезагружать страницу при клике на ссылку
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {//проверяем, есть ли объекты с классом вообще
    for (let index = 0; index < popupCloseIcon.length; index++) {//бегаем по каждой ссылочке
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {//вешаем событие
            popupClose(el.closest('.popup'));//отправляем в функцию popupClose объект, который является ближайшим родителем с классом popup
            e.preventDefault();//запрещаем перезагружать страницу при клике на ссылку
        });
    }
}

function popupOpen(curentPopup) {//передаем готовый объект
    if (curentPopup && unlock) {//проверяем существование и открытость переменной unlock (true)
        const popupActive = document.querySelector('.popup.open');
        //закрываем открытые попапы
        if (popupActive) {
            popupClose(popupActive, false);
        }
        else {
            bodyLock();
        }
        curentPopup.classList.add('open');//добавляем класс open к переданному попапу
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {//если НЕТ в родителях попап_контента (событие на ВСЕ, кроме попапа)
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}
function popupClose(popupActive, doUnlock = true) {//передаем открытый объект, если попап вложен в попап
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';//высчитываем ширину скролла

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    //ширина скролла добавляется у тебя двойная
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;//для того, чтобы не было повторных нажатий (чтобы скролла не было)

    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);


    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

//esc закрытие
document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

