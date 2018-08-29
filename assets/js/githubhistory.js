const GitHubHistoryReq = {
  requestBodyParams: {
    sha: "make-blog", // 分支名称
    path: "source/_posts/", // 文章存储路径
    paramF: function(fn) { // 返回请求的参数对象
      return {
        sha: "make-blog",
        path: "source/_posts/" + fn,
      }
    }
  },
  requestUrlParams: {
    user: "aimobier", // 用户名称
    repos: "aimobier.github.io", // 仓库名称
    urlF: function() { // 返回完整的请求链接地址
      return "https://api.github.com/repos/" + this.user + "/" + this.repos + "/commits";
    }
  },
  Request: function() {
    const fileName = $("#CurrentFileName").text();
    if (fileName !== null || fileName !== undefined || fileName !== '') {
      $.getJSON(this.requestUrlParams.urlF(), this.requestBodyParams.paramF(fileName), this.requestSuccess.bind(this));
    };
  },
  timeSince: function(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  },
  returnHtmlElment: function(commit) {

    const get = (p, o) =>
      p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : undefined, o)

    // const commit = safe(comm);
    const date = new Date(commit.commit.committer.date);

    commit_commit_message = (get(['commit','message'],commit) || "no message").replace(/\n/g, "<br>")

    commit_sha = get(['sha'],commit) || "";
    commit_author_html_url = get(['author','html_url'],commit) || "";
    commit_author_avatar_url = get(['author','avatar_url'],commit) || "" ;
    commit_html_url = get(['html_url'],commit) || "";
    commit_author_login = get(['author','login'],commit) || "";

    return '\
    <tr><td>\
    <li class="media g-brd-around g-brd-gray-light-v4 g-pa-20 g-mb-minus-1">\
      <div class="d-flex g-mt-2 g-mr-15">\
        <a target="_blank" href="' + commit_author_html_url + '"><img class="g-width-30 g-height-30 rounded-circle" src="' + commit_author_avatar_url + '" alt="Image Description"></a>\
      </div>\
      <div class="media-body">\
        <div class="d-flex justify-content-between">\
          <a target="_blank" href="' + commit_author_html_url + '"><strong class="g-font-size-9">' + commit_author_login + '</strong></a>\
          <a target="_blank" href="' + commit_html_url + '"><span class="align-self-center g-font-size-9 text-nowrap">' + (commit_sha.slice(0, 5) + '..') + '</span></a>\
        </div>\
        <span class="align-self-center g-font-size-9 text-nowrap g-color-gray-dark-v4">'+timeago(null, 'zh_CN').format(date)+'</span>\
        <span class="d-block g-font-size-11">' + commit_commit_message + '</span>\
      </div>\
    </li>\
    </tr></td>\
    ';
  },
  requestSuccess: function(body) {

    var liRes = body.map(function(item, index, input) {
      return this.returnHtmlElment(item);
    }.bind(this));

    $("#commit-history-new-body").html(liRes.join(""));

    $('#commit-history-new').DataTable({
      autoWidth: false,
      ordering: false,
      searching: false,
      lengthChange: false,
      pageLength: 2,
      iShowPages: false,
      info: false,
      pagingType: "cutsomPage",
      footerCallback: function(tfoot, data, start, end, display) {
        var title = "共" + data.length + "个修改历史";
        $("#history_infomessagelabel").html(title);
      }
    });
  },
  editHtmlMethod: function() {

    const fileName = $("#CurrentFileName").text();
    const urlString = "https://github.com/aimobier/aimobier.github.io/tree/make-blog/source/_posts/" + fileName;

    const editHtml = '\
    <li class="list-inline-item g-mx-10">/</li>\
    <li class="list-inline-item g-mr-10">\
      <a target="_blank" class="u-link-v5 g-color-deeporange g-color-orange--hover" href="' + urlString + '">\
              <i class="align-middle mr-2 fa fa-edit u-line-icon-pro"></i>发现错误，编辑本页\
            </a>\
    </li>\
    ';

    $("#editHtmlElement").append(editHtml);
  }
};

$(function(){
    GitHubHistoryReq.Request();
    GitHubHistoryReq.editHtmlMethod();
});
