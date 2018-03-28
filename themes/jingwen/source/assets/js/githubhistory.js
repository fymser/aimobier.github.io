const GitHubHistoryReq = {
  requestBodyParams:{
    sha: "make-blog", // 分支名称
    path: "source/_posts/", // 文章存储路径
    paramF:function(fn){ // 返回请求的参数对象
      return {
          sha: "make-blog",
          path: "source/_posts/"+fn,
      }
    }
  },
  requestUrlParams:{
    user: "aimobier", // 用户名称
    repos: "aimobier.github.io", // 仓库名称
    urlF: function(){ // 返回完整的请求链接地址
      return "https://api.github.com/repos/"+this.user+"/"+this.repos+"/commits";
    }
  },
  Request:function(){
    const fileName = $("#CurrentFileName").text();
    if (fileName !== null || fileName !== undefined || fileName !== '') {
      $.getJSON(this.requestUrlParams.urlF(),this.requestBodyParams.paramF(fileName),this.requestSuccess);
    };
  },
  requestSuccess:function(body){

      console.log(body);
  }
}

$(function(){
    GitHubHistoryReq.Request();
});
