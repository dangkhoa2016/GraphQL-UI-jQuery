var mainHost = 'https://graphql-sqlite3-server.khoa2016.repl.co/graphql';

var queryList = `
query Get_Posts($page_index: Int) {
  posts(page_index: $page_index) { id, title, summary, photo, comments{id}, createdAt, updatedAt, status, user { id, email, name }}
}
`;

var queryDetail = `
query Get_Post($id: ID!) {
  getPost(id: $id) { id, title, summary, content, photo, comments{id}, createdAt, updatedAt, status, user { id, email, name }}
}
`;
var cur_page = 1;

function LoadList(page_index, callback) {
    $('#blogs-list').html('<b>Loading...</b>');

    $.ajax({
        url: mainHost,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({ query: queryList, variables: { page_index } }),
        success: function (res) {
            if (typeof callback === 'function') {
                var arr = res && res.data && res.data.posts;
                if (arr.length > 0)
                    cur_page = page_index;

                callback(arr);
            }
        },
        error: function (err) {
            if (typeof callback === 'function')
                callback([]);
        }
    });
}

function BindLoadPaging(callback) {

    $('#lnk-next').click(function (e) {
        e.preventDefault();

        LoadList(cur_page + 1, callback);
    });

    $('#lnk-prev').click(function (e) {
        e.preventDefault();

        if (cur_page > 1)
            LoadList(cur_page - 1, callback);
    })
}

function LoadPost(id, callback) {
    $.ajax({
        url: mainHost,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({ query: queryDetail, variables: { id } }),
        success: function (res) {
            if (typeof callback === 'function') {
                var post = res && res.data && res.data.getPost;
                callback(post);
            }
        },
        error: function (err) {
            if (typeof callback === 'function')
                callback(null);
        }
    });
}
