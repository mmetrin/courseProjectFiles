
$('#checkUser').click(function (e) {
    e.preventDefault();
    let login = $('#InpLogin').val();
    let pass = $('#InpPass').val();

    let result = true;
    $(".error").remove();
    if (login.length < 1) {
        $('#InpLogin').after('<span class="error">Поле не может быть пустым!</span>');
        result = false;
    }

    if (pass.length < 1) {
        $('#InpPass').after('<span class= "error" >Упс! Вы забыли ввести пароль!</span > ');
        result = false;
    }

    else {
        if (result) {
            let object = {
                UserLog: login,
                UserPas: pass
            };
            let obj = JSON.stringify(object)
            $.ajax({
                type: 'POST',
                url: '/Home/Login',
                contentType: 'application/json; charset=utf-8',
                data: obj,
                success: function (data) {
                    if (!data.ms) {
                        $('#InpLogin').before(' <span class= "error">Авторизация прошла успешно! </span >');
                        //let url = history.state() ;
                        setTimeout(() => { window.location.reload(); }, 1000);

                      
                    }
                    else {
                        $('#InpLogin').before(' <span class= "error">Упс! Похоже, вы не зарегистрированы на сайте! </span > ');
                    }
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    }
});