
(async () => {

    const loadJs = function (file) {
        return new Promise((resolve) => {
            fetch(file)
                .then(res => {
                    if (res.status !== 200)
                        throw new Error(`File [${file}] does not exists.`);
                    return res.text();
                }).then(js => {
                    eval(js);
                    resolve();
                }).catch(ex => {
                    console.log(`Error load js: ${file}`, ex);
                    resolve();
                });
        });
    };
    
    const LoadFile = function (file) {
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
    };

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
    };

    function ProcessLayout(arr) {
        const indxLayout = arr.findIndex((elem) => { return elem.name.toLowerCase() === 'layout' });
        if (indxLayout === -1)
            return;

        const layout = arr.splice(indxLayout, 1)[0];

        $('body').find('layout').replaceWith(layout.content);
        $.each(arr, function (indx, elm) {
            $('body').find(elm.name).replaceWith(elm.content);
        });

        InitOther();

        if (typeof window.InitPage === 'function')
            window.InitPage(arr);
    };

    function ActiveMenu() {
        var page = location.pathname;
        if (page.length < 2)
            page = '/index';
        $('#navigation a[href="' + page + '"], #navigation a[href="' + page + '.html"]').addClass('active');
    };

    async function LoadContent(files) {
        try {
            const arr = await Promise.all(files.map(async file => await LoadFile(file)));
            ProcessLayout(arr);
        } catch(err) {
            console.log('Error load files', err);
        };
    };

    async function Main() {
        const layout = document.querySelector('layout');
        if (!layout)
            return;

        let content_to_load = layout.getAttribute('data-page');
        if (!content_to_load) {
            if (location.pathname.length > 1) {
                const seg = location.pathname.split('/');
                content_to_load = seg[seg.length - 1];
            } else
                content_to_load = 'index';
            content_to_load = content_to_load.toLowerCase().replace('.html', '');
        }

        await loadJs(`/assets/js/${content_to_load}.js`);

        const is_blog_page = content_to_load.toLowerCase().startsWith('blogs_');
        if (is_blog_page)
            await loadJs('/assets/js/blog_core.js');

        $(document).on('submit', 'form', function (e) {
            e.preventDefault();
        });

        let files = [{ path: '/parts/layout.html', name: 'layout' }, { path: '/parts/config.html', name: 'config' },
        { path: '/parts/header.html', name: 'header' }, { path: '/parts/modals.html', name: 'modals' }];
        files.push({ path: `/content/${content_to_load}.html`, name: 'content' });

        if (typeof window.addition_file !== 'undefined') {
            if (Array.isArray(window.addition_file))
                files = files.concat(window.addition_file);
            else
                files.push(window.addition_file);

            delete window.addition_file;
        }

        await LoadContent(files);
    };

    // libs
    const libs = [
        'npm/jquery@3.6.3',
        'npm/moment@2.29.4',
        'npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
        'npm/handlebars@4.7.7/dist/handlebars.min.js',
        'npm/@fortawesome/fontawesome-free@5.15.4/js/all.min.js'
    ];
    await loadJs(`https://cdn.jsdelivr.net/combine/${libs.join(',')}`);
    await loadJs('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js');
    await loadJs('/assets/js/helper.js');

    // Style Switcher
    await loadJs('/assets/js/demo/style-switcher.js');

    await Main();

})();