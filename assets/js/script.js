
$(function () {
    $(document).on('submit', 'form', function (e) {
        e.preventDefault();
    });

    var LoadFile = function (file) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: file.path, type: 'get',
                contentType: 'text/plain',
                error: function () {
                    file.content = '';
                    resolve(file);
                },
                success: function (res) {
                    file.content = res;
                    resolve(file);
                }
            })
        });
    }

    function InitOther() {
        ActiveMenu();

        Handlebars.registerHelper('formatTime', function (date, format) {
            var mmnt = moment(parseFloat(date));
            return mmnt.format(format);
        });

        Handlebars.registerHelper('ifCond', function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    function ProcessLayout(arr) {
        var indxLayout = arr.findIndex((elem) => { return elem.name.toLowerCase() === 'layout' });

        if (indxLayout !== -1) {
            var layout = arr.splice(indxLayout, 1)[0];

            $('body').find('layout').replaceWith(layout.content);
            $.each(arr, function (indx, elm) {
                $('body').find(elm.name).replaceWith(elm.content);
            });

            InitOther();

            if (typeof InitPage === 'function')
                InitPage(arr);
        }
    }

    function ActiveMenu() {
        var page = location.pathname;
        if (page.length < 2)
            page = '/index';
        $('#navigation a[href="' + page + '"], #navigation a[href="' + page + '.html"]').addClass('active');
    }

    function LoadContent() {

        var files = [{ path: '/parts/layout.html', name: 'layout' }, { path: '/parts/config.html', name: 'config' },
        { path: '/parts/header.html', name: 'header' }, { path: '/parts/modals.html', name: 'modals' }];

        var content_to_load = 'index.html';
        var cur_page = location.pathname;
        if (cur_page.length > 1) {
            var seg = cur_page.split('/');
            content_to_load = seg[seg.length - 1];
        }

        files.push({ path: '/content/' + content_to_load, name: 'content' });
        if (typeof addition_file !== 'undefined') {
            if (addition_file.length)
                files = files.concat(addition_file);
            else
                files.push(addition_file);
        }

        Promise.all(files.map((file) => { return LoadFile(file) }))
            .then((arr) => {
                ProcessLayout(arr);
            }).catch((err) => {
                console.log('Error load files', err);
            });
    }


    LoadContent();

});