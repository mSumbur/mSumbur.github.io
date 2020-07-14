// 元素
var container = document.getElementById('game');
// 动画对象
var enemyANimation;
// 等级
var level;
// 得分
var score;
/**
* 游戏相关配置
* @type {Object}
*/
var CONFIG = {
  status: 'start', // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 6, // 总共6关
  numPerLine: 7, // 游戏默认每行多少个怪兽
  canvasPadding: 30, // 默认画布的间隔
  bulletSize: 10, // 默认子弹长度
  bulletSpeed: 10, // 默认子弹的移动速度
  enemySpeed: 2, // 默认敌人移动距离
  enemySize: 50, // 默认敌人的尺寸
  enemyGap: 10,  // 默认敌人之间的间距
  enemyIcon: 'img/enemy.png', // 怪兽的图像
  enemyBoomIcon: 'img/boom.png', // 怪兽死亡的图像
  enemyDirection: 'right', // 默认敌人一开始往右移动
  enemyArea: {
    width: 640,
    height: 440
  }, // 怪物移动区域
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {
    width: 60,
    height: 100
  }, // 默认飞机的尺寸,
  planeIcon: './img/plane.png',
};
/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数
   * @param  {object} opts
   * @return {[type]} [description]
   */
  init: function(opts) {
    this.status = 'start';
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    // 重新开始
    document.addEventListener('click',function(event) {
      var target = event.target;
      if(target.classList.contains('js-replay') || target.classList.contains('js-play')) {
        level = 1;
        score = 0;
        self.play();
      }else if(target.classList.contains('js-next')) {
        if(GAMEUI.level < CONFIG.totalLevel) {
          level++;
        }
        self.play();
      }
    })
    document.addEventListener('keydown', function(event) {
      if(GAME.status === 'playing') {
        var code = event.keyCode;
        switch (code) {
          case 32:  // 开火
            fire();
            break;
          // 老师的演示版 飞机的移动流畅 是怎么实现的呢？
          case 37:  // 飞机左动
            GAMEUI.planeX -= CONFIG.planeSpeed;
            break;
          case 39:  // 飞机右动
            GAMEUI.planeX += CONFIG.planeSpeed;
            break;
        }
      }
    })
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    GAMEUI.init();
    animate();
    this.setStatus('playing');
  },
  failed: function() {
    this.setStatus('failed');
    var scoreNode = document.querySelector('.score');
    scoreNode.innerText = score;
    this.gameFinish();
  },
  success: function() {
    this.setStatus('success');
    var levelNode = document.querySelector('.game-next-level');
    levelNode.innerText = "下一个Level: " + (level + 1);
    this.gameFinish();
  },
  allSuccess: function() {
    this.setStatus('all-success');
    this.gameFinish();
  },
  gameFinish: function() {
    cancelAnimationFrame(enemyAnimation);
    GAMEUI.clearUI();
  }
};
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var GAMEUI = {
  init: function() {
    // Level
    this.level = level;
    // 怪物运行起点
    this.x = CONFIG.canvasPadding;
    this.y = this.x;
    // 保存怪物坐标，存活状态。boomIndex -- 为了绘制3帧死亡后显示的图片
    this.enemyArr = [];
    for(var i = 0; i < this.level; i++) {
      this.enemyArr[i] = [];
      for (var j = 0; j < CONFIG.numPerLine; j++) {
        this.enemyArr[i][j] = {
          x: 0,
          y: 0,
          isAlive: 1,
          boomIndex: 0
        }
      }
    }
    // 怪物运动方向
    this.enemyDirection  =CONFIG.enemyDirection;
    // 怪物图片对象
    this.enemy = new Image();
    this.enemy.src = CONFIG.enemyIcon;
    this.enemyBoom = new Image();
    this.enemyBoom.src = CONFIG.enemyBoomIcon;
    // 飞机图片对象
    this.plane = new Image();
    this.plane.src = CONFIG.planeIcon;
    // 飞机起始坐标
    this.planeX = canvas.width / 2 - CONFIG.planeSize.width / 2;
    this.planeY = canvas.height - CONFIG.canvasPadding - CONFIG.planeSize.height;
    // 图片初始化
    // this.enemy.onload = function() {
    //   GAMEUI.drawEnemy();
    //   console.log('1');
    // }
    this.plane.onload = function() {
      GAMEUI.drawPlane();
    }
    this.enemyBoom.onload = function() {
      console.log('load');
    }
    // 绘制分数样式
    this.score = 0;
    context.font = "18px sans-serif";
    context.fillStyle = '#fff';
  },
  drawEnemy: function() {
    var x = this.x;
    var y = this.y;
    var size = CONFIG.enemySize;
    for(var i = 0; i < level; i++) {
      this.enemyArr[i].forEach(function(item) {
        if(item.isAlive) {
          context.drawImage(GAMEUI.enemy, x, y, size, size);
          item.x = x;
          item.y = y;
        }else if(item.boomIndex && item.boomIndex <= 3) { // 绘制3帧死亡图像
          context.drawImage(GAMEUI.enemyBoom, x, y, size, size);
          item.boomIndex++;
        }
        x += 60;
      })
      x = this.x;
      y += 50;
    }
  },
  drawPlane: function() {
    var plane = this.plane;
    if(this.planeX > 670 - 60) {
      this.planeX = 670 - 60;
    }else if(this.planeX < 30) {
      this.planeX = 30;
    }
    context.drawImage(plane, this.planeX, this.planeY, CONFIG.planeSize.width, CONFIG.planeSize.height);
  },
  drawBullet: function(x, y) {
    context.fillRect(x, y, 1, 10);
  },
  move: function() {
    var allSurvivors = 0; // 所有存活怪物数
    var lineSurvivors = 0; // 怪物存活数
    var len = this.enemyArr.length;
    var lenDeep = CONFIG.numPerLine;
    var level,left,right,floor;
    for(var x = 0; x < len; x++) {
      for(var i = 0; i < lenDeep; i++) {  // 检查每行占位数量
        if(this.enemyArr[x][i].isAlive) {
          for(var j = lenDeep - 1; j >= 0; j--) {
            if(this.enemyArr[x][j].isAlive) {
              allSurvivors++;
              if(j + 1 - i > lineSurvivors) {
                lineSurvivors = j + 1 - i;
                level = x;
                left = i;
                right = j;
              }
              break;
            }
          }
          floor = x;
          break;
        }
      }
    }
    // 如果没有怪物存活或者怪物到达底部 游戏失败
    if(this.level === CONFIG.totalLevel && !allSurvivors) {
        GAME.allSuccess();
        return true;
    }else if(!allSurvivors) {
        GAME.success();
        return true;
    }
    if(this.enemyArr[floor][left].y > CONFIG.enemyArea.height + CONFIG.canvasPadding) {
      GAME.failed();
      return true;
    }
    // 怪物移动CONFIG.enemySpeed距离
    if(this.enemyDirection === 'right') {
      this.x += CONFIG.enemySpeed;
      if(this.enemyArr[level][right].x + 50 + 30 > canvas.width) {
        this.y += CONFIG.enemySize;
        this.enemyDirection = 'left';
      }
    }else {
      this.x -= CONFIG.enemySpeed;
      if(this.enemyArr[level][left].x < 30) {
        this.y += CONFIG.enemySize;
        this.enemyDirection = 'right';
      }
    }
  },
  clearUI: function() {  // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);
  },
  scored: function() {  // 得分
    context.fillText('分数：' + score, 20, 20, 75, 30);
  }
}
/**
 * 检查子弹是否碰撞怪物
 * @param {number} 子弹坐标
 * @return 如果碰撞返回真
 */
function checkBullet(x, y) {
  for (var i = 0; i < this.level; i++) {
    GAMEUI.enemyArr[i].forEach(function(item) {
      if(item.isAlive && item.x + 50 > x && item.x < x && item.y + 50 > y && item.y < y) {
        item.isAlive = 0; // 当前怪物死亡
        item.boomIndex = 1; // 开始绘制3帧死亡图像
        score += 1; // 得分
        cancelAnimationFrame(ani);
      }
    })
  }
}
// 开火子弹运行动画
function fire() {
  var x = GAMEUI.planeX + 29;
  var y = GAMEUI.planeY - 10;
  function bulletAnimation() {
    ani = requestAnimationFrame(bulletAnimation);
    // 如果子弹击中怪物、子弹超出界面或者游戏失败就清除动画
    if(checkBullet(x, y) || !y || GAME.status === 'failed' || GAME.status === 'all-success' || GAME.status === 'success') {
      cancelAnimationFrame(ani);
    }else {
      GAMEUI.drawBullet(x, y);
      y -= CONFIG.bulletSpeed;
    }
  }
  bulletAnimation();
}
// 怪物运行动画
function animate() {
  GAMEUI.clearUI();
  enemyAnimation = requestAnimationFrame(animate);
  if(!GAMEUI.move()) {
    GAMEUI.scored();
    GAMEUI.drawEnemy();
    // GAMEUI.levelF();
    GAMEUI.drawPlane();
  }
}
// 初始化
GAME.init();
