
window.addition_file = [{ path: '/content/blog_item.html', name: 'blog_item' },
    { path: '/content/blog_detail.html', name: 'blog_detail' }];
let template_item = '';
let template_detail = '';
const cache_posts = [];

window.InitPage = function(arrContent) {

    let hdb_html = arrContent.find(el => {
        return el.name.toLowerCase() === 'blog_item';
    });

    if (hdb_html)
        template_item = Handlebars.compile(hdb_html.content);

    hdb_html = arrContent.find(el => {
        return el.name.toLowerCase() === 'blog_detail';
    });

    if (hdb_html)
        template_detail = Handlebars.compile(hdb_html.content);

    $('#modal-show').on('shown.bs.modal', function (e) {
        ModalShow();
    });

    function ShowPostByIndex(is_next) {
        const post_id = $('#modal-show .modal-body').attr('data-post') || '';
        if (!post_id)
            return;

        const current_post = $('#blogs-list [data-id="' + post_id + '"]');
        if (current_post.length === 0)
            return;

        let indx = current_post.index();
        if (is_next)
            indx += 1;
        else
            indx -= 1;

        if (indx < 0)
        return;

        const post_index = $('#blogs-list [data-id]:eq(' + indx + ')');
        if (post_index.length > 0)
            ShowPost(post_index.attr('data-id'), true);
    }

    $(document).on('click', '#modal-show .modal-body .nav-link-prev', function (e) {
        e.preventDefault();

        ShowPostByIndex(false);
    });

    $(document).on('click', '#modal-show .modal-body .nav-link-next', function (e) {
        e.preventDefault();

        ShowPostByIndex(true);
    });


    if (typeof LoadList !== 'function')
        return;

    LoadList(1, function (arr) {
        RenderList(arr || []);
    });

    if (typeof BindLoadPaging !== 'function')
        return;

    BindLoadPaging(function (arr) {
        RenderList(arr || []);
    });
};

function ModalShow() {
    const modal = $('#modal-show');
    const post_id = modal.find('.modal-body').attr('data-post') || '';

    if (!post_id || typeof LoadPost !== 'function')
        return;

    const cached_post = cache_posts.find(p => p.id === post_id);
    if (cached_post) {
        var html = template_detail(cached_post);
        modal.find('.modal-body').html(html);
        ScrollTop();
        return;
    }

    modal.find('.modal-body').html('Loading post: ' + post_id);

    LoadPost(post_id, function (data) {
        if (typeof data !== 'object')
            return;

        var html = template_detail(data);
        cache_posts.push(data);
        modal.find('.modal-body').html(html);
        ScrollTop();
    });
};

function ScrollTop() {
    $('body > .postModal').animate({ scrollTop: 0 }, 'slow');
};

window.ShowPost = function(id, noNeedToShow) {
    var modal = $('#modal-show');

    modal.find('.modal-body').attr('data-post', id);
    if (noNeedToShow) {
        ModalShow();
        return;
    }

    modal.find('.modal-body').html('Loading post: ' + id);
    modal.modal('show');
};

window.SetFooterCss = function() {
    const footer = document.querySelector('footer');
    const show_header_sidebar = window.innerWidth > 992;
    const header_height = show_header_sidebar ? 0 : document.querySelector('header').clientHeight;
    const section_height = document.querySelector('section').clientHeight;
    if (window.innerHeight > header_height + section_height) {
        footer.classList.add('fixed-bottom');
        if (show_header_sidebar)
            footer.classList.add('offset-header');
        else
            footer.classList.remove('offset-header');
    }
    else {
        footer.classList.remove('fixed-bottom');
    }
};

function RenderList(arr) {
    const root = $('#blogs-list').empty();
    if (arr && arr.length > 0) {
        $('#lnk-next').removeClass('d-none');

        $(arr).each(function (indx, blog) {
            const html = template_item(blog);
            root.append(html);
        });
        SetFooterCss();
        return;
    }
    
    root.append('<b>No posts found!</b>');
    $('#lnk-next').addClass('d-none');
    SetFooterCss();
};

function CodeColor() {

    /* ======= Highlight.js Plugin ======= */
    /* Ref: https://highlightjs.org/usage/ */
    $('.modal:visible pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

};
