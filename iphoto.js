(function() {
  // "use strict";
  /**
   * @[DISTANCE] 定义一个距离，用来控制放大图与原图间的距离
   * @[GAP] 定义一个间隙，用来限制大图距离窗口 上、下、左、右 的最小距离
   * @[MAX_WIDTH] 定义一个宽度，用来限制放大图片最大的宽度
   * @[MAX_HEIGHT] 定义一个高度，用来限制放大图片的最大高度
   * @[SYNCWITHMOUSE] 定义一个放大图片是否与鼠标同步   --建议开启，性能好很多，因为不需要进行每一个元素的定位，只需对鼠标进行定位
   * @[MOUSEMOVE] 定义一个鼠标事件，是否使用 mousemove 事件来运行程序，还是需要鼠标按住运行程序
   * @[DIRECTION] 定义一个方向 用来指定放大图的显示方向
   * @[WIN_W] 窗口宽度
   * @[WIN_H] 窗口高度
   * @[VIEW] 视图，分为 年、月、日、详细 四种，四种视图为递进关系，只能从高到低越级（即 年 -> 详细，月 -> 详细，日 -> 详细）。反过来则不可，必须一级级返回（即 详细 -> 日，日 -> 月，月 -> 年）
   */
  var DISTANCE = 15,
      GAP = 10,
      MAX_WIDTH = 200,
      MAX_HEIGHT = 200,
      SYNCWITHMOUSE = true,
      MOUSEMOVE = false,
      DIRECTION,
      WIN_W,
      WIN_H,
      VIEW = 'YEAR';


  /**
   * iphoto 程序入口函数
   * @param {String} iphoto_id 需要使用 iphoto 的元素 id
   */
  /**
   * iphoto 程序入口函数
   * @param {String} iphoto_id 需要使用 iphoto 的元素 id
   * @param  {Function} callback 回调函数
   * [$target] 鼠标停留的当前目标
   * [index] 当前目标的索引
   * 
   * @return {[type]}
   */
  function init_iphoto( iphoto_id, callback ) {
    var ismousedown = false, // 判断鼠标是否按下
        timer = null; // 滞空一个

    var $pid = $(iphoto_id);
    
    if(!MOUSEMOVE) {
	    // 鼠标按下
	    $pid.on('mousedown', function(e) {
	      // ismousedown = true;
	      WIN_W = $(window).width();
	      WIN_H = $(window).height();
	      DIRECTION = '';

	      clearTimeout(timer);
	      timer = setTimeout(function() {
	        showPic(e);
	      }, 1000);

	      $pid.on('mousemove', function(e) {
		      showPic(e);
		      // 若鼠标进入了 pop 层，则会将 pop remove掉
		      $('.iphoto-pop-holder').on('mouseenter', function(e) {
		        removeiphoto();
		      });
		      if(timer) clearTimeout(timer);
		    });
	    });
	    
	    // 鼠标抬起
	    $pid.on('mouseup', function(e) {
	    	// 移除 mousemove 事件
	    	$pid.off('mousemove');

	      e = e || window.event;
	      var $target = $((e.target || e.srcElement));
	      // ismousedown = false;
	      clearTimeout(timer);

	      // if(!$target.hasClass('img-hold') || !$target) {
	      //   removeiphoto(); // 控制鼠标停留在空白处时，将 pop 层 remove 掉
	      //   return false;
	      // }
				removeiphoto();
	      viewType( 'PHOTO', $target, callback );
	    });
    } else {
      DIRECTION = '';
	    $pid.on('mousemove', function(e) {
	    	WIN_W = $(window).width();
      	WIN_H = $(window).height();

	      showPic(e);
	      // 若鼠标进入了 pop 层，则会将 pop remove掉
	      $('.iphoto-pop-holder').on('mouseenter', function(e) {
	        removeiphoto();
	      });
	    });

	    $pid.on('click', function(e) {
	    	e = e || window.event;
	      var $target = $((e.target || e.srcElement));
	      removeiphoto();
	      viewType( 'PHOTO', $target, callback );
	    });
    }
  }


  /**
   * 显示放大图片
   * @param {object} $target 需要显示放大图片的目标元素
   * @returns {boolean}
   */
  function showPic (e, src) {
    e = e || window.event;
    var $target = $((e.target || e.srcElement));

    // 如果不是指定位置，则 remove 掉所有 pop 层，并返回
    if(!$target.hasClass('img-hold') || !$target) {
      // 控制鼠标停留在空白处时，将 pop 层 remove 掉
      removeiphoto();
      return false;
    }

    src = src || $target.css('background-image').replace(/^url|[\(\)]/g, ''); // 得到背景图片，并处理掉 url()

    var img = new Image();
    img.src = src;
    img.onload = function () {
      // 得到图片的真实宽、高
      var z_w = img.width,
          z_h = img.height;

      // 等比例缩放图片
      var scaleImgObj = imgScale(z_w, z_h);
      z_w = scaleImgObj.width;
      z_h = scaleImgObj.height;

      // 弹出 pop 层
      iphotoPopUp($target, src, z_w, z_h, e);
    };
  }


  /**
   * 移除放大图片
   */
  function removeiphoto() {
    $('.iphoto-pop-holder').fadeOut(150, function() {
      $('.iphoto-pop-holder').remove();
    });
  }


  /**
   * 图片等比例缩放
   * @param {Number} width 需要进行等比例缩放图片的真实宽
   * @param {Number} height 需要进行等比例缩放图片的真实高
   * @param {Number} CUS_MAX_WIDTH 「可选」自定义缩放最大宽度，如 200，怎缩放最大宽度不超过 200px; 若不填，则默认为 MAX_WIDTH
   * @param {Number} CUS_MAX_HEIGHT 「可选」自定义缩放最大高度，如 200，怎缩放最大高度不超过 200px; 若不填，则默认为 MAX_HEIGHT
   * @returns {{width: *, height: *}} 返回一个 object，包含有缩放后的宽和高
   */
  function imgScale(width, height, CUS_MAX_WIDTH, CUS_MAX_HEIGHT) {
    var pos = {},
        scale = width/height,
        //the_MAX_WIDTH = typeof(CUS_MAX_WIDTH) == 'undefined' ? MAX_WIDTH : CUS_MAX_WIDTH,
        //the_MAX_HEIGHT = typeof(CUS_MAX_HEIGHT) == 'undefined' ? MAX_HEIGHT : CUS_MAX_HEIGHT;
      the_MAX_WIDTH = CUS_MAX_WIDTH || MAX_WIDTH,
      the_MAX_HEIGHT = CUS_MAX_HEIGHT || MAX_HEIGHT;

    if(scale > 1) {
      scale = the_MAX_WIDTH/width;
      width = the_MAX_WIDTH; // width = width * scale  -> the_MAX_WIDTH
      height = height * scale;
    } else {
      scale = the_MAX_HEIGHT/height;
      width = width * scale;
      height = the_MAX_HEIGHT;
    }
    pos.width = width;
    pos.height = height;

    return pos;
  }


  /**
   * 放大图片弹出层
   * @param $target 目标元素的 jquery 对象
   * @param src 图片源
   * @param z_w 图片真实宽度
   * @param z_h 图片真实高度
   * @param e 传入鼠标事件
   */
  function iphotoPopUp( $target, src, z_w, z_h, e ) {
    /*
     * @[z_x] 放大图片的 x 坐标
     * @[z_y] 放大图片的 y 坐标
     * @[gap] 放大图片距离窗口的距离
     */
    var z_x,
        z_y,
        gap;

    if(!SYNCWITHMOUSE) {
      // 不与鼠标同步情况
      // 还没有将所有情况写完全
      /**
       * @[tar_left] 目标元素相对窗口左侧距离
       * @[tar_top] 目标元素相对窗口顶部距离
       * @[tar_w] 目标元素宽度（并不是真实宽度）
       * @[tar_h] 目标元素高度（并不是真实高度）
       */
      var tar_left = $target.position().left,
          tar_top = $target.position().top,
          tar_w = $target.width(),
          tar_h = $target.height();

      /* 计算 pop 层的位置 */
      // 计算距离窗口距离
      gap = tar_top - z_h - DISTANCE; // 初始 gap 是距离上部

      // 如果 gap 小于最小间隔，则将其设置成距离下方的计算
      if( gap > GAP ) {
        gap = WIN_H - (z_h + tar_h + tar_top + DISTANCE);
        z_y = tar_top - z_h - DISTANCE;
        z_x = (tar_left + tar_w/2) - z_w/2;
      } else {
        gap = tar_top - z_h - DISTANCE;
        z_y = tar_top + tar_h + DISTANCE;
        z_x = (tar_left + tar_w/2) - z_w/2;
      }
    } else {
      // 与鼠标同步情况
      var p = getMousePoint(e),
          m_x = p.x,
          m_y = p.y;

      /* 计算 pop 层的位置 */
      // 初始的 DIRECTION 是没有值的，通过计算图片出现的位置与 gap 的间距，来得出这张图应该出现在鼠标上方，还是鼠标下方
      if(DIRECTION === undefined || DIRECTION === null || DIRECTION === '') {
        gap = e.clientY - z_h - DISTANCE;
        if( gap < GAP ) {
          gap = WIN_H - (e.clientY + z_h + DISTANCE);
          DIRECTION = 'down';
        } else {
          DIRECTION = 'up';
        }
      }
      // 注意：这里使用 e.clientY 而不是 m_y 是因为 m_y 是根据文档计算出来的高，而 e.clientY 则是相对于屏幕的高度
      if(DIRECTION == 'up') {
        gap = e.clientY - z_h - DISTANCE; // 初始 gap 是距离上部
        z_x = m_x - z_w/2;
        z_y = m_y - z_h - DISTANCE;
        // 若检测到 gap 距离窗口顶部小于定义距离，则更换图片出现方向，并更换 gap 计算方法适用于 「下」
        if( gap < GAP ) {
          gap = WIN_H - (e.clientY + z_h + DISTANCE);
          DIRECTION = 'down';
        }
      } else if(DIRECTION == 'down') {
        gap = WIN_H - (e.clientY + z_h + DISTANCE);
        z_x = m_x - z_w/2;
        z_y = m_y + DISTANCE;
        // 若检测到 gap 距离窗口底部小于定义距离，则更换图片出现方向，并更换 gap 计算方法适用于 「上」
        if( gap < GAP ) {
          gap = e.clientY - z_h - DISTANCE; // 初始 gap 是距离上部
          DIRECTION = 'up';
        }
      }
    }

    // 如果距离窗口左边小于 GAP，则设为距离左边GAP；如果距离窗口右边小于 GAP，则设为距离右边 GAP
    if( z_x < GAP ) {
      z_x = GAP;
    } else if ( (WIN_W - ( z_x + z_w )) < GAP ) {
      z_x = WIN_W - z_w - GAP;
    }

    /*
     * pop 放大图模板
     *
     * 「说明」
     * 如果 document 不存在 `.iphoto-pop-holder` class，则创建这个模板
     * 如果存在，则只需更替里面的内容及数据即可
     *
     * 「错误思路」
     * 如果一味的创建、删除模板的 dom 节点，虽说能达到一定的效果，但是却会带来很多的问题。
     * 1. 当鼠标持续移动时，会发现 pop 元素实际上一直在闪烁，这是因为 .iphoto-pop-holder 节点不断地被删除，并且被创建
     *    我曾使用很多的方法想要避免这种闪烁，都失败了
     * 2. 不断地添加删除节点，也会带来一定的性能损耗
     *
     * 「解决思路」
     * 为了解决这个问题，我采用了另外一种思路，就是不删除节点，而是更换节点里的数据
     * pop 需要几个条件显示
     * 1. position 定位的 left top 值
     * 2. img 元素的 src 值
     * 我们只需要改变这两个位置的数据，即可实现不增删节点，从根本上消除了闪烁的问题
     */
    if($('.iphoto-pop-holder').length) {
      var $ihold = $('.iphoto-pop-holder'),
          $ipop = $ihold.find('.iphoto-pop');
      $ipop
        .data('index', $target.data('index'))
        .css({
          top: z_y,
          left: z_x,
          width: z_w,
          height: z_h
        });
      $ipop.find('.pop-img').attr('src', src);
    } else {
      $('<div class="iphoto-pop-holder"><div class="iphoto-pop" data-index= "'+$target.data('index')+'" style="top: '+z_y+'px; left: '+z_x+'px; width: '+z_w+'px; height: '+z_h+'px;"><img class="pop-img" src="'+src+'" alt="" /></div></div>')
        .appendTo($('body'))
        .hide()
        .fadeIn(150);
    }
  }


  /**
   * 获取鼠标在页面上的位置
   * @param e 触发的事件
   * @return {x: number, y: number} point x:鼠标在页面上的横向位置 y:鼠标在页面上的纵向位置
   */
  function getMousePoint(e) {
    // 定义鼠标在视窗中的位置
    var point = {
      x:0,
      y:0
    };

    // 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
    if(typeof window.pageYOffset != 'undefined') {
      point.x = window.pageXOffset;
      point.y = window.pageYOffset;
    }
    // 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
    // IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
    else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
      point.x = document.documentElement.scrollLeft;
      point.y = document.documentElement.scrollTop;
    }
    // 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
    else if(typeof document.body != 'undefined') {
      point.x = document.body.scrollLeft;
      point.y = document.body.scrollTop;
    }

    // 加上鼠标在视窗中的位置
    point.x += e.clientX;
    point.y += e.clientY;

    // 返回鼠标在视窗中的位置
    return point;
  }


  /**
   * [视图显示函数]
   * @param  {[string]} type [显示视图类型，'YEAR','MONTH','DAY','PHOTO']
   * @return {[type]}
   */
  function viewType( type, $target, callback ) {
    switch (type) {
      case 'YEAR':
        // 显示年视图
        break;
      case 'MONTH':
        // 显示月视图
        break;
      case 'DAY':
        // 显示日视图
        break;
      case 'PHOTO':
        // 显示详细视图
        var index = $target.data('index');
        callback($target, index);
        break;
      default:
        // 显示年视图
    }
  }

  // 挂到 window 下
  window.iphoto = init_iphoto;

})(window, undefined);
