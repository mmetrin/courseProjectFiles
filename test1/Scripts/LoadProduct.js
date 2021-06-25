function LoadProduct(item) {
    let object = {
        id: item.id
    };
    let obj = JSON.stringify(object)
    $.ajax({
        type: 'POST',
        url: '/Products/LoadProducts',
        contentType: 'application/json; charset=utf-8',
        data: obj,
        success: function (data) {
            $("#ForLoadProduct").html(data)
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
}