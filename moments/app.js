// TODO: 用户名称需修改为自己的名称
var userName = '存布尔';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和',
    avatar: './img/avatar2.png'
  },
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  },
  reply: {
    hasLiked: true,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');
$('.user-name').append(userName);
/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes, hasLiked) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">');
    if( i !== 0) {
      likesHtmlArr.push(', ');
    }
    likesHtmlArr.push(likes[i] + '</a>');
  }
  // 自己是否点赞
  if(hasLiked) {
    likesHtmlArr.push('<a class="reply-who hasLiked" href="#">, ' + userName + '</a>')
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join('');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes, replyData.hasLiked));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    if(i === 3 || i === 6) {
      htmlText.push('<br>')
    }
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}

/**
 * 分享消息
 * @param {Object} share 分享对象
 * @return {String} 返回html字符串
 */
function shareTpl(share) {
  var htmlText = '<div class="item-share"><img class="share-img" src="' + share.pic + '" alt="朋友圈图片"><span class="share-tt">' + share.text + '</span></div>'
  return htmlText;
}

/**
 * 单图片消息模板
 * @param {Object} pic 图片地址
 * @return {String} 返回html字符串
 */
function singlePicTpl(pic) {
  var htmlText = '<img class="item-only-img" src="' + pic[0] + '"">'
  return htmlText;
}

/**
 * 无图片消息
 */

/**
 * 循环：消息体
 * @param {Object} messageData 对象
 */
function messageTpl(messageData, index) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="' + index + '">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareTpl(content.share);
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = singlePicTpl(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn" data-btn-index="' + index + '">');
  htmlText.push('<span class="item-reply"></span>');

  // 添加隐藏的点赞评论按钮
  var hasLikedText = {
    false: '点赞',
    true: '取消'
  }
  htmlText.push('<div class="reply-btn-bd">');
  htmlText.push('<button class="reply-btn like"><img src="./img/like.png" alt="' + hasLikedText[messageData.reply.hasLiked] + '"><span>' + hasLikedText[messageData.reply.hasLiked] + '</span></button>');
  htmlText.push('<button class="reply-btn comment"><img src="./img/comment.png" alt="评论"><span>评论</span></button></div>');

  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var messageArr = [];
  data.forEach(function(user, index) {
    messageArr.push(messageTpl(user, index));
  })
  $momentsList.html(messageArr.join(''));
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
  /**
   * 点赞评论按钮
   */
  var now;    // 保存点击的按钮
  var index;  // 保存点击的按钮的索引
  $('.moments-item').on('click', '.item-reply-btn', function(event) {
    var btn = $(this).children('.reply-btn-bd');
    // 如果点击的是now,就隐藏now,否则隐藏now,并重新赋值和显示now
    if(this === now ) {
      btn.css('display','none');
      // 如果点击的是‘评论’按钮，不清楚now和index,否则清除
      if(!(event.target.classList.contains('comment') || event.target.parentElement.classList.contains('comment'))) {
        now = undefined;
        index = undefined;
      }
    }else {
      if(now) {
        $(now).children('.reply-btn-bd').css('display','none');
      }
      now = this;
      index = now.getAttribute('data-btn-index');
      btn.css('display', 'block');
    }
  })

  // 优化： 点击非按钮区域隐藏 btn
  $(window).on('click', function(event) {
    var target = event.target;
    var targetClassList = event.target.classList;
    if(!(targetClassList.contains('item-reply-btn') || targetClassList.contains('item-reply'))) {
      $(now).children('.reply-btn-bd').css('display','none');
      if(!(target.parentElement.classList.contains('comment') || targetClassList.contains('comment') || event.target.parentElement.classList.contains('comment-textarea'))) {
        now = undefined;
        index = undefined;
      }
    }
  })

  // 点赞评论按钮绑定事件
  var replyZone;  // 点赞评论列表

  // 评论输入
  var commentTextarea = $('<div class="comment-textarea"><textarea></textarea><button>评论</button></div>');
  $page.append(commentTextarea);

  $('.reply-btn-bd').on('click', 'button', function() {
    // 获取点赞评论列表
    replyZone = $($('.moments-item')[index]).find('.reply-zone');
    if(this.classList.contains('like')) {
      if(this.innerText === '取消') {
        hasLike('unlike');
        $(this).children('span').text('点赞');
      }else {
        hasLike('like');
        $(this).children('span').text('取消');
      }
    }else {
      commentTextarea.css({
        width: $page.css('width'),
        display: 'block'
      });
      var width = commentTextarea.width() - 44 - 10 - 10 - 5;
      commentTextarea.children('textarea').css('width',width);
    }
  })

  var showBtn;
  $(commentTextarea).on('input', 'textarea', function() {
    if(this.value) {
      $(this).next().css('background-color','#228b22');
      showBtn = 1;
    }else {
      $(this).next().css('background-color','#ccc');
      showBtn = 0;
    }
  })

  $(commentTextarea).on('click', 'button', function() {
    if(showBtn) {
      var text = commentTextarea.css('display','none').children('textarea').val();
      comment(text);
      now = undefined;
      index = undefined;
      commentTextarea.children('textarea').val('');
      this.style.backgroundColor = '#ccc';
      showBtn = 0;
    }
  })

  $(window).on('scroll', function() {
    commentTextarea.css('display', 'none').children('textarea').val('');
    commentTextarea.children('button').css('background-color','#ccc');
    now = undefined;
    index = undefined;
    showBtn = 0;
  })

  /**
   * 点赞功能函数
   * @param {string} 点赞或取消
   */
  function hasLike(str) {
    var replyLike = replyZone.children('.reply-like');
    if(str === 'like') {
      if(replyLike[0]) {
        replyLike.append('<a class="reply-who hasLiked" href="#">, ' + userName + '</a>');
      }else {
        replyZone.prepend('<div class="reply-like"><i class="icon-like-blue"></i><a class="reply-who hasLiked" href="#">' + userName + '</a></div>');
      }
      data[index].reply.hasLiked = true;
    }else if(str === 'unlike') {
      if(replyLike.find('.reply-who').length === 1) {
        replyZone.children('.reply-like').remove();
      }else {
        replyLike.children('.hasLiked').remove();
      }
      data[index].reply.hasLiked = false;
    }else {
      console.log('function hasLike error');
    }
  }

  /**
   * 评论功能函数
   * @param {string} 评论内容
   */
   function comment(commentStr) {
     var replyComment = replyZone.children('.reply-comment');
     if(replyComment[0]) {
       replyComment.append('<div class="comment-item"><a class="reply-who" href="#">' + userName + '</a>：' + commentStr + '</div>');
     }else {
       replyZone.append('<div class="reply-comment"><div class="comment-item"><a class="reply-who" href="#">' + userName + '</a>：' + commentStr + '</div></div>');
     }
   }

   /**
    * 图片的点击查看
    */
    $('.item-pic').on('click', '.pic-item', function() {
      var maskLayer = $('<div class="mask-layer"><div class="close-mask-layer">×</div></div>');
      maskLayer.append($(this.outerHTML).css('z-index','1'));
      // var otherImg = $(this).siblings('.pic-item');
      // for(var i = 0; i < otherImg.length; i++) {
      //   maskLayer.append($(otherImg[i].outerHTML).css('z-index','0'));
      // }
      $page.append(maskLayer);
    })

    $('.item-only-img').on('click', function() {
      var maskLayer = $('<div class="mask-layer"><div class="close-mask-layer">×</div>' + this.outerHTML + '</div>');
      $page.append(maskLayer);
    })

    $page.on('click', '.close-mask-layer', function() {
      $page.children('.mask-layer').remove()
    })

}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();
