//$('#createUser').click(function () {

//    $.ajax(
//        {
//            type: 'POST',
//            url: '/Home/Create',
//            contentType: 'application/json;charset=utf-8',
//            data: obj,
//            success: function () {

//            },
//            error: function () {

//            }

//        })


//$.fn.setCursorPosition = function (pos) {
//    if ($(this).get(0).setSelectionRange) {
//        $(this).get(0).setSelectionRange(pos, pos);
//    } else if ($(this).get(0).createTextRange) {
//        var range = $(this).get(0).createTextRange();
//        range.collapse(true);
//        range.moveEnd('character', pos);
//        range.moveStart('character', pos);
//        range.select();
//    }
//};

//$("#InpPhone").click(function () {
//    $(this).setCursorPosition(3);
//})
//$("#InpPhone").mask("8(999) 999-99-99");



function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    return dd + '.' + mm + '.' + yy;
}


let DateMax = new Date();
DateMax.setFullYear(DateMax.getFullYear() - 18);
$('#InpDate').datepicker({
    maxDate: DateMax
})



$(document).ready(function ($) {

    $("#InpPhone").mask("8(999) 999-99-99");
    $("#InpDate").mask("9999.99.99")
});

$('#createUser').click(function (e) {
    e.preventDefault();
    let first_name = $('#InpName').val();
    let last_name = $('#InpSurname').val();
    let patronymic = $('#InpPatronymic').val();
    let phone = $('#InpPhone').val();
    let email = $('#InpEmail').val();
    if ($('#InpDate').val() == '') {
        let NowDate = new Date();
        $('#InpDate').val(formatDate(NowDate));
    }
    let dateBirth = $('#InpDate').val();
    let password = $('#InpPassword').val();
    let repeatPass = $('#RepeatPass').val();
    let result = true;
    $(".error").remove();
    if (first_name.length < 1) {
        $('#InpName').after('<span class="error">Имя не может быть пустым</span>');
        result = false;
    }

    if (last_name.length < 1) {
        $('#InpSurname').after('<span class= "error" >Фамилия не может быть пустой</span > ');
        result = false;
    }

    if (last_name.length < 1) {
        $('#InpPatronymic').after('<span class= "error" >Отчество не может быть пустым</span > ');
        result = false;
    }


    if (phone.length < 1) {
        $('#InpPhone').after('<span class= "error" >Телефон не может быть пустым</span > ');
        result = false;
    }

    if (dateBirth.length > 1) {
        let NowDate = new Date();
        let MinDate = new Date(1900, 01, 01);
        let day = dateBirth.split(".")[0], month = dateBirth.split(".")[1], year = dateBirth.split(".")[2];
        let InpDate = new Date(year, month - 1, day);
        if (InpDate >= NowDate) {
            $('#InpDate').after('<span class="error">Введите корректную дату!</span>');
            result = false;
        }
        else {
            if (InpDate <= MinDate) {
                $('#InpDate').after('<span class="error">Введите корректную дату!</span>');
                result = false;
            }
        }
    }
    else {
        $('#InpDate').after('<span class="error">Дата не может быть пустой!</span>');
        result = false;
    }


    if (password.length < 6) {
        $('#InpPassword').after('<span class="error">Пароль должен быть не менее 6 символов</span>');
        result = false;
    }

    if (password.length < 1) {
        $('#RepeatPass').after('<span class="error">Повтор пароля должен быть заполнен</span>');
        result = false;
    }

    if (repeatPass != password) {
        $('#RepeatPass').after('<span class="error">Пароли не совпадают</span>');
        result = false;
    }

    if (email.length < 1) {
        $('#InpEmail').after(' <span class= "error" >Email - это обязательное поле!</span > ');
        result = false;
    }
    else {
        let regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        let validEmail = regex.test(email);
        if (!validEmail) {
            $("#InpEmail").after('<span class="error">Введите корректный email</span>');
            result = false;
        }
        if (result) {
            let object = {
                UserEmail: email
            };
            let obj = JSON.stringify(object)
            $.ajax({
                type: 'POST',
                url: '/Home/CheckRepeatLogin',
                contentType: 'application/json; charset=utf-8',
                data: obj,
                success: function (data) {
                    if (!data.msg) {
                        let object = {
                            UserName: first_name,
                            UserSurname: last_name,
                            UserPatronymic: patronymic,
                            UserPhone: phone,
                            UserEmail: email,
                            UserDateBirth: dateBirth,
                            UserPassword: password
                        };
                        let obj = JSON.stringify(object)
                        $.ajax({
                            type: 'POST',
                            url: '/Home/Create',
                            contentType: 'application/json; charset=utf-8',
                            data: obj,
                            success: function (result) {
                                alert("Регистрация прошла успешно!")
                                popupOpen(popup);
                                e.preventDefault();

                            },
                            error: function (data) {
                                alert(data.responseText);
                            }
                        });
                    }
                    else {
                        $('#InpEmail').after(' <span class= "error" >Такой логин уже существует! </span > ');
                    }
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    }
});