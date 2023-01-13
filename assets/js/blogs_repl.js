const mainHost = 'https://graphql-sqlite3-server.khoa2016.repl.co/graphql';

const queryList = `
query Get_Posts($page_index: Int) {
  posts(page_index: $page_index) { id, title, summary, photo, comments{id}, createdAt, updatedAt, status, user { id, email, name }}
}
`;

const queryDetail = `
query Get_Post($id: ID!) {
  getPost(id: $id) { id, title, summary, content, photo, comments{id}, createdAt, updatedAt, status, user { id, email, name }}
}
`;

let cur_page = 1;

window.LoadList = function(page_index, callback) {
    $('#blogs-list').html('<b>Loading...</b>');
    SetFooterCss();

    $.ajax({
        url: mainHost,
        type: 'post',
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
};

window.BindLoadPaging = function(callback) {

    $('#lnk-next').click(function (e) {
        e.preventDefault();

        LoadList(cur_page + 1, callback);
    });

    $('#lnk-prev').click(function (e) {
        e.preventDefault();

        if (cur_page > 1)
            LoadList(cur_page - 1, callback);
    })
};

window.LoadPost = function(id, callback) {
    $.ajax({
        url: mainHost,
        type: 'post',
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
};
