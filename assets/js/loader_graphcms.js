// var mainHost = 'https://graphql-server-helper.glitch.me/api/posts/blogs';
var mainHost = 'https://api-eu-central-1.graphcms.com/v2/ckhjzb03d2j4h01yx8ufd2es0/master';

var queryList = `
query Get_Posts($first: Int, $skip: Int) {
  posts(first: $first, skip: $skip, where: {state: "active"}) {
    id,photo,title,summary,comments{id}
    updatedAt,createdAt
    author {id,name,email}
  }
}
`;

var queryDetail = `
query Get_Post($id: ID!) {
  post(where: {id: $id}) {
    id,photo,title,summary,content{text},comments{id}
    updatedAt,createdAt
    author {id,name,email}
  }
}
`;

var cur_page = 1;
var page_size = 5;
function LoadList(page_index, callback) {
    $('#blogs-list').html('<b>Loading...</b>');

    page_index = page_index || 1;
    if (page_index < 1)
        page_index = 1;
    var skip = (page_index - 1) * page_size;

    $.ajax({
        url: mainHost,
        contentType: 'application/json',
        type: "post",
        data: JSON.stringify({ query: queryList, variables: { 'first': page_size, skip } }),
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
        contentType: 'application/json',
        type: "post",
        data: JSON.stringify({ query: queryDetail, variables: { id } }),
        success: function (res) {
            if (typeof callback === 'function') {
                var post = res && res.data && res.data.post;
                callback(post);
            }
        },
        error: function (err) {
            if (typeof callback === 'function')
                callback([]);
        }
    });
}
