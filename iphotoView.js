$(function() {
  iphoto('#iphoto', photoView);

  // 显示详细视图
  function photoView($target, index) {
    console.log($target.data('index'));

    var gap = 20;
    var $tar = $target,
        $D_H = $(document).height(),
        src = $tar.css('background-image').replace(/^url|[\(\)]/g, ''), // 得到背景图片，并处理掉 url()
        WIN_H = $(window).height(),
        WIN_W = $(window).width(),
        scroll_h = $(document).scrollTop(),
        $tarParent = $tar.parent('li.list-item');

    var init_l = $tarParent.position().left,
        init_t = $tarParent.position().top;

    // add loading icon
    $('<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>')
      .appendTo($tarParent);

    var img = new Image();
    src = src.replace('.thumb.224_0', '');
    img.src = src;
    img.onload = function() {
      var img_w = img.width,
          img_h = img.height,
          max_w = img_w > WIN_W ? WIN_W - gap*2 : img_w,
          max_h = img_h > WIN_H ? WIN_H - gap*2 :img_h,
          imgSize = imgScale(img_w, img_h, max_w, max_h),
          w = imgSize.width,
          h = imgSize.height,
          l = (WIN_W - w)/2,
          t = (WIN_H - h)/2 + scroll_h;

      // remove loading icon
      $target.siblings('.sk-cube-grid').remove();

      $('<div class="iphoto-view" style="height: '+$D_H+'px"><div class="iphoto-overlay"></div>\
          <div class="iphoto-bubble" style="height: '+h+'px;width: 0;left: '+init_l+'px;top: '+init_t+'px;">\
            <img src="'+src+'" />\
          </div>\
        </div>').appendTo($('body')).hide().fadeIn(300);

      $('.iphoto-view').find('.iphoto-bubble').animate({
        width: w,
        top: t,
        left: l
      }, 500);
    }

    $(document).on('click', '.iphoto-view', function(){
      $('.iphoto-view').remove();
    });
   

  }


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

});
