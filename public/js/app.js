$(".button-collapse").sideNav();

var priority = 'green'

$('#high').on('click', function () {
    priority = 'red'
})
$('#medium').on('click', function () {
    priority = 'orange'
})

$('#low').on('click', function () {
    priority = 'green'
})

$(document).on('click', '.restore',function (e) {
    e.preventDefault()

    var id = $(this).data('id')
    var data = {
        id: id
    }
    $.ajax({
        url: '/remove',
        method: 'POST',
        data: data,
        success: function (data) {
            loadDeletedTodos()
            Materialize.toast('Successfully restored todo', 5000, 'green white-text')
        }
    })
})

$(document).on('click', '.del-perm',function (e) {
    e.preventDefault()

    var id = $(this).data('id')
    var data = {
        id: id
    }

    swal({
        title: "Are you sure?",
        text: "You wont be able to restore after this",
        type: "error",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, i'm sure",
        closeOnConfirm: false
    },
        function(){
            $.ajax({
                url: '/deleteperm',
                method: 'POST',
                data: data,
                success: function (data) {
                    swal("Deleted!", "Your todo was deleted", "success");
                    loadDeletedTodos()
                }
            })
    });


})

$(document).on('click', '.done',function () {

    var date_ended = moment().format("LLL")

    var id = $(this).data('id')
    var data = {
        id: id,
        date: date_ended
    }
    $.ajax({
        url: '/done',
        method: "POST",
        data: data,
        success: function (data) {
            loadTodos()
        },
        error: function () {
            console.log('error')
        }
    })
})

$(document).on('click', '.delete',function (e) {
    e.preventDefault()

    var id = $(this).data('id')
    var data = {
        id: id
    }

    $.ajax({
        url: '/remove',
        method: 'POST',
        data: data,
        success: function (data) {
            var $toastContent = $('<span>Todo removed click <a class="light-green-text" href="/deleted"><b>here</b></a> to restore</span>');
            Materialize.toast($toastContent, 5000, 'red white-text')
            loadTodos()
        }
    })
})

$('#submit').on('click', function (e) {
    e.preventDefault()

    var title    = $('#title')
    var desc     = $('#textarea1')
    var high     = $('#high')
    var med      = $('#medium')
    var low      = $('#low')

    var date_started = moment().format("LLL")

    if(title.val() === "" || desc.val() === ""){
        Materialize.toast('Please fill in the required fields', 10000, 'red white-text')
    }else{
        var data = '{ "date_started": "'+date_started+'", "date_ended": 0, "active": 1, "title": "'+title.val()+'", "desc":"'+desc.val()+'", "priority": "'+priority+'", "done": 0 }'
        var todo = JSON.parse(data)
        $.ajax({
            url: '/add',
            method: "POST",
            data: todo,
            success: function () {
                Materialize.toast('Todo added', 2500, 'green white-text')
                loadTodos()
            },
            error: function () {
                console.log('error')
            }
        })
        title.val("")
        desc.val("")
        high.prop('checked', false)
        med.prop('checked', false)
        low.prop('checked', false)
    }
})



loadTodos()
function loadTodos() {
    $.ajax({
        url: '/todos',
        method: 'GET',
        success: function (data) {
            var todos = $(data).find('#todo-list')
            $('#todo-list-wrapper').html(todos)
        }
    })
}

loadDeletedTodos()
function loadDeletedTodos() {
    $.ajax({
        url: '/todosdeleted',
        method: 'GET',
        success: function (data) {
            var todos = $(data).find('#todo-list')
            $('#todo-list-wrapper-deleted').html(todos)
        }
    })
}
