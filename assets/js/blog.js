
var addition_file = [{ path: "/content/blog_item.html", name: "blog_item" }, { path: "/content/blog_detail.html", name: "blog_detail" }];
var template_item = '';
var template_detail = '';
var cachePosts = [];

function InitPage(arrContent) {

    var hdb_html = arrContent.find(el => {
        return el.name.toLowerCase() === "blog_item";
    });

    if (hdb_html)
        template_item = Handlebars.compile(hdb_html.content);

    hdb_html = arrContent.find(el => {
        return el.name.toLowerCase() === "blog_detail";
    });

    if (hdb_html)
        template_detail = Handlebars.compile(hdb_html.content);

    $('#modal-show').on('shown.bs.modal', function (e) {
        ModalShow();
    });

    function ShowPostByIndex(is_next) {
        var post_id = $('#modal-show .modal-body').attr('data-post') || '';
        if (!post_id)
            return;

        var currentPost = $('#blogs-list [data-id="' + post_id + '"]');
        if (currentPost.length === 0)
            return;

        var indx = currentPost.index();
        if (is_next)
            indx += 1;
        else
            indx -= 1;

        if (indx >= 0) {
            var postIndex = $('#blogs-list [data-id]:eq(' + indx + ')');
            if (postIndex.length > 0)
                ShowPost(postIndex.attr('data-id'), true);
        }
    }

    $(document).on('click', '#modal-show .modal-body .nav-link-prev', function (e) {
        e.preventDefault();

        ShowPostByIndex(false);
    });

    $(document).on('click', '#modal-show .modal-body .nav-link-next', function (e) {
        e.preventDefault();

        ShowPostByIndex(true);
    });


    if (typeof LoadList === "function") {
        LoadList(1, function (arr) {
            RenderList(arr || []);
        });

        if (typeof BindLoadPaging === "function") {
            BindLoadPaging(function (arr) {
                RenderList(arr || []);
            });
        }
    }
};

function ModalShow() {
    var modal = $('#modal-show');
    var post_id = modal.find('.modal-body').attr('data-post') || '';

    if (post_id && typeof LoadPost === 'function') {
        var cachedPost = cachePosts.find(p => p.id === post_id);
        if (cachedPost) {
            var html = template_detail(cachedPost);
            modal.find('.modal-body').html(html);
            ScrollTop();
        } else {
            modal.find('.modal-body').html('Loading post: ' + post_id);

            LoadPost(post_id, function (data) {
                if (typeof data === 'object') {
                    var html = template_detail(data);
                    cachePosts.push(data);
                    modal.find('.modal-body').html(html);
                    ScrollTop();
                }
            });
        }
    }
};

function ScrollTop() {
    $("body > .postModal").animate({ scrollTop: 0 }, 'slow');
};

function ShowPost(id, noNeedToShow) {
    var modal = $('#modal-show');

    modal.find('.modal-body').attr('data-post', id);
    if (noNeedToShow)
        ModalShow();
    else {
        modal.find('.modal-body').html('Loading post: ' + id);
        modal.modal('show');
    }
};

function RenderList(arr) {
    var root = $('#blogs-list').empty();
    if (arr && arr.length > 0) {
        $('#lnk-next').removeClass('d-none');

        $(arr).each(function (indx, blog) {
            var is_last = (indx === arr.length - 1);
            var html = template_item(blog);
            root.append(html);
        });
    } else {
        root.append('<b>No posts found!</b>');
        $('#lnk-next').addClass('d-none');
    }
};

function CodeColor() {

    /* ======= Highlight.js Plugin ======= */
    /* Ref: https://highlightjs.org/usage/ */
    $('.modal:visible pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

}