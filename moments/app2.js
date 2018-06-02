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
  var htmlText = '<a class="item-share"><img class="share-img" src="' + share.pic + '" alt="朋友圈图片"><span class="share-tt">' + share.text + '</span></a>'
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
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');

  // 添加隐藏的点赞评论按钮
  var hasLikedText = {
    false: '点赞',
    true: '取消'
  }
  htmlText.push('<div class="reply-btn-bd">');
  htmlText.push('<button class="reply-btn like"><span>' + hasLikedText[messageData.reply.hasLiked] + '</span></button>');
  htmlText.push('<button class="reply-btn comment"><span>评论</span></button></div>');

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
  // 添加评论输入框
  messageArr.push('<div class="comment-textarea"><textarea></textarea><button>发送</button></div>');
  $momentsList.html(messageArr.join(''));
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // 存放按钮信息
  var btns = {
    index: null,
    reply: {
      status: 0,
      dom: null
    },
    comment: {
      status: null,
      dom: $('.comment-textarea').css({
        width: $page.css('width')
      }).children('textarea').css({
        width: $page.width() - 44 - 10 - 10 - 5
      }).parent(),
      value: null
    },
    clickedPic: null
  }

  $page.on('click', '.item-reply-btn', function() {
    // 获取.moments-item的data-index序号
    var index = $(this).parents('.moments-item').attr('data-index');
    // 获取点赞评论按钮dom
    var dom = $(this).children('.reply-btn-bd');
    btnDisplay(index, dom);
  }).on('click', 'button', function() {
    var btnType = $(this).text();
    if(btnType === '评论') {
      textareaDisplay('show');
    }else if(btnType === '发送') {
      addComments(btns.comment.value);
      textareaDisplay('hide');
    }else {
      this.innerText = btnType === '点赞' ? '取消':'点赞';
      like(btnType);
    }
  }).on('click', 'img', function() {
    if(this.parentElement.tagName !== 'A') {
      clickPic($(this).parent(), this);
    }
  })

  /**
   * 屏幕点击或滚动时隐藏
   */
  $(window).on('scroll', function() {
    if(btns.reply.status) {
      btnDisplay('hide');
    }
    if(btns.comment.status) {
      textareaDisplay('hide');
    }
  }).on('click', function(event) {
    var target = $(event.target);
    if(!target.hasClass('item-reply') && !target.hasClass('item-reply-btn')) {
      btnDisplay('hide');
    }
    if(!target.parent().is('.comment-textarea') && target.text() !== '评论') {
      textareaDisplay('hide');
    }
  })
  /**
   * 回复按钮的显示/隐藏
   * @param {string} 可选 只显示/只隐藏
   */
  function btnDisplay(index, dom, order) {
    var reply = btns.reply;
    // 按键对象还未获取dom并且无dom参数调用时返回空
    if(!reply.dom && !dom) {
      return '';
    }
    // 如果参数长度为1并且是'hide',则关闭按钮并返回
    if(arguments.length === 1 && arguments[0] === 'hide') {
      reply.dom.css('display', 'none');
      reply.status = 0;
      return '';
    }
    // 如果这一次点击的不是上一次点击的按钮，关闭上一次点击的按钮
    if(btns.index && btns.index !== index) {
      reply.dom.css('display', 'none');
      reply.status = 0;
    }
    // 按键对象获取dom，关闭或显示
    reply.dom = dom;
    btns.index = index;
    if(reply.status) {
      reply.dom.css('display', 'none');
      reply.status = 0;
    }else {
      reply.dom.css('display', 'block');
      reply.status = 1;
    }
  }
  /**
   * 点赞功能函数
   * @param {string} 点赞or取消
   */
  function like(btnType) {
    var replyZone = $momentsList.children().eq(btns.index).find('.reply-zone');
    if(btnType === '点赞') {
      if(replyZone.children().is('.reply-like')) {
        replyZone.children('.reply-like').append('<a class="reply-who hasLiked" href="#">, ' + userName + '</a>');
      }else {
        replyZone.prepend('<div class="reply-like"><i class="icon-like-blue"></i><a class="reply-who hasLiked" href="#">' + userName + '</a></div>');
      }
      data[btns.index].reply.hasLike = true;
    }else if(btnType === '取消') {
      if(replyZone.children('.reply-like').children('.reply-who').length === 1) {
        replyZone.children('.reply-like').remove();
      }else {
        replyZone.find('.hasLiked').remove();
      }
      data[btns.index].reply.hasLike = false;
    }
  }
  /**
   * 评论输入框显示
   * @param {string} 显示/关闭
   */
  function textareaDisplay(type) {
    // 获取评论输入框对象
    var textarea = btns.comment;
    /**
     * 显示时，textarea获取焦点，有输入时评论输入框对象的value值为输入的值、发送按钮背景颜色变绿，
     * 失去焦点时清空输入框的值，递归调用关闭输入框(老师，这样递归行不行啊？)
     * status为当前状态，优化
     */
    if(type === 'show'){
      textarea.status = 1;
      textarea.dom.css('visibility', 'visible').children('textarea').focus().on('input', function() {
        if(this.value) {
          $(this).next().css('background-color', '#228b22');
          textarea.value = this.value;
        }else {
          $(this).next().css('background-color', '#ccc');
        }
      }).on('blur', function() {
        $(this).next().css('background-color', '#ccc');
      }).val('');
    }else if(type === 'hide') {
      textarea.status = 0;
      textarea.dom.css('visibility', 'hidden');
    }
  }
  /**
   * 评论添加函数
   * @param {string} 评论内容
   */
  function addComments(comments) {
    var replyZone = $momentsList.children().eq(btns.index).find('.reply-zone');
    if(replyZone.children().last().is('.reply-comment')) {
      replyZone.children('.reply-comment').append('<div class="comment-item"><a class="reply-who" href="#">' + userName + '</a>：' + comments + '</div>');
    }else {
      replyZone.append('<div class="reply-comment"><div class="comment-item"><a class="reply-who" href="#">' + userName + '</a>：' + comments + '</div></div>');
    }
  }
  /**
   * 点击图片放大功能
   */
  function clickPic(dom, clickedPic) {
    var maskLayer = $('<div class="mask-layer"></div>');
    dom.children('img').each(function(index, item) {
      item.setAttribute('index', index);
      maskLayer.append($(item.outerHTML).css('z-index', '2'));
    });
    var index = clickedPic.getAttribute('index');
    maskLayer.children('[index=' + index + ']').css('z-index', '3');
    maskLayer.css('z-index','2').on('click', function(event) {
      if(event.target.tagName !== 'IMG') {
        $page.children('.mask-layer').remove();
      }
    }).on('touchstart', function(event) {
      event.preventDefault();
      startX = event.originalEvent.changedTouches[0].pageX;
      startY = event.originalEvent.changedTouches[0].pageY;
      if(event.target.tagName !== 'IMG') {
        $page.children('.mask-layer').remove();
      }
    }).on('touchmove', function(event) {
      console.log('touchmove work');
      event.preventDefault();
      moveEndX = event.originalEvent.changedTouches[0].pageX;
      moveEndY = event.originalEvent.changedTouches[0].pageY;
      var x = moveEndX - startX;
      var y = moveEndY - startY;
      slide(x, y, $(this), index);
    });
    $page.append(maskLayer);
  }

  /**
   * 图片的滑动显示
   * @param {number}
   */
   function slide(x, y, dom, index) {
     dom.children('[index=' + index + ']').css('z-index', '2');
     var len = dom.children('img').length;
     console.log(index);
     if(Math.abs(x) > Math.abs(y) && x > 0) {
       if(index !== 0 ) {
         index--;
        dom.children('[index=' + index + ']').css('z-index', '3');
       }
       console.log('2 right');
     }else if(Math.abs(x) > Math.abs(y) && x < 0) {
       if(index === len - 1) {
         index++;
         dom.children('[index=' + index + ']').css('z-index', '3');
       }
       console.log('2 left');
     }
     console.log('show',index);
   }
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
