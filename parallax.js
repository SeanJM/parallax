parallax = {
  range: function (options) {
    return (options.number >= options.start && options.number <= options.end);
  },
  getIndex: function (string) {
    // Returns the pos integer, in this case 20
    // 20% {top:0%;left: 0%;opacity: 0%}
    return parseInt(string.replace(/%(\s+|){(.*?)}/,''));
  },
  getAttr: function (string) {
    // Returns the css attributes as JSON
    // 20% {top:0%;left: 0%;opacity: 0%}
    var arr = string.match(/{(.*?)}/)[1].split(';');
    var obj = {};
    $.each(arr,function (i,k) {
      if (k.length > 0) {
        var key    = k.match(/(\s+|)([a-zA-Z-]+):/)[2];
        var value  = k.match(/:(\s+|)([a-zA-Z-0-9%\.]+)/)[2];
        obj[key]   = value;
      }
    });
    return obj;
  },
  getProps: function (string) {
    var arr1 = string.match(/([a-zA-Z-0-9]+):/g);
    var arr2 = [];
    $.each(arr1,function (i,k) {
      arr2.push(k.match(/[a-zA-Z-0-9]+/)[0]);
    });
    return arr2;
  },
  global: function (options) {

  },
  showFrames: function (options) {
    var index = options.el.index();
    var el    = {
      0: $('.show-frame[index="'+index+'"]').eq(0),
      1: $('.show-frame[index="'+index+'"]').eq(1)
    }
    if (el[0].size() < 1) {
      el = {
        0: $('<div class="show-frame" index="'+index+'">'),
        1: $('<div class="show-frame" index="'+index+'">'),
      }

      for (var k in el) {
        el[k]
          .css('position','absolute')
          .css('background-color','rgba(0,0,0,0.5)')
          .css('color','#fff')
          .css('text-align','center')
          .css('font-size','13px')
          .css('line-height','20px')
          .css('padding-left','10px')
          .css('padding-right','10px')
          .css('z-index','999')
          .css('min-width','60px')

        $('body').append(el[k]);
      }
    }

    el[0]
      .css('top',options.el.offset().top)
      .css('left',options.el.offset().left)
      .html(options.index);

    el[1]
      .css('top',options.el.offset().top+options.el.outerHeight()-el[1].outerHeight())
      .css('right','0')
      .html(options.index);
  },
  position: function (el,index) {
    el.find('[parallaxanim]').each(function () {
      var item  = $(this);
      var arr   = item.attr('parallaxanim').match(/([0-9%]+(\s+|){(.*?)})/g);
      var steps = [];
      var frame = parallax.toSlope({
        item  : item,
        index : index,
        array: arr
      });
      for (var k in frame) {
        item.css(k,frame[k]);
      }
    });
    if (typeof $('body').attr('parallaxdebug') !== 'undefined') {
      parallax.showFrames({el: el,index: index});
    }
    // From steps, fill in in between frames
  },
  getStyle: function (prop,string) {
    var regex = new RegExp(prop+':(\\s+|)([a-zA-Z0-9-%]+)');
    var out   = string.match(regex)[2];
    return out;
  },
  toSlope: function (options) {
    var byProp = {};
    $.each(options.array,function (i,k) {
      var arr   = parallax.getProps(k);
      var index = parallax.getIndex(k);
      $.each(arr,function (i,q) {
        if (typeof byProp[q] === 'undefined') byProp[q] = {};
        byProp[q][index] = parallax.getStyle(q,k);
      });
    });
    var curFrame    = {};
    for (var prop in byProp) {
      var animationIndexArr = [];
      var slopeStart = false;
      var slopeEnd = false;
      for (var animationIndex in byProp[prop]) {
        animationIndex = parseFloat(animationIndex);
        animationIndexArr.push(animationIndex);
        if (options.index >= animationIndex) {
          slopeStart = animationIndex;
        } else if (options.index <= animationIndex && !slopeEnd) {
          slopeEnd = animationIndex;
        }
      }


      if (slopeEnd === false) {
        var end       = animationIndexArr[animationIndexArr.length-1];
        options.index = end;
        slopeEnd      = end;
      } else if (slopeStart === false) {
        options.index = animationIndexArr[0]
      }

      var normal      = slopeEnd-slopeStart;
      var index       = options.index-slopeStart;
      var slopePos    = (index/normal === Infinity) ? 1 : index/normal;
      var startFrame  = byProp[prop][slopeStart];
      var endFrame    = byProp[prop][slopeEnd];
      var unit        = startFrame.replace(/[0-9-]+/,'');
      curFrame[prop]  = (parseFloat(startFrame)+(parseFloat(endFrame)-parseFloat(startFrame))*slopePos)+unit;

    }
    return curFrame;
    //start : { index: parallax.getInt(start), frame: parallax.getAttr(start) },
    //end   : { index: parallax.getInt(end), frame: parallax.getAttr(end) },
    var slopeStart = options.start.index;
    var slopeEnd   = options.end.index;
    var pos        = options.pos-options.start.index;
    var normal     = slopeEnd-slopeStart;
    var slopePos   = pos/normal;
    var startFrame = options.start.frame;
    var endFrame   = options.end.frame;
    var curFrame   = {};

    console.log([options.start,options.end]);

    for (var k in options.start.frame) {
      var unit        = options.start.frame[k].replace(/[0-9-\.]+/,'');
      var startNumber = parseInt(options.start.frame[k].match(/[0-9-\.]+/)[0]);
      var endNumber   = (typeof options.end.frame[k] !== 'undefined') ? parseInt(options.end.frame[k].match(/[0-9-]+/)[0]) : startNumber;
      var curNumber   = startNumber+((endNumber-startNumber)*slopePos);

      curFrame[k] = curNumber+unit;
    }
    return curFrame;
  },
  scroll: function () {
    // Find the active parallax frames
    //$(window).scrollTop();
    var scrollTop        = $(window).scrollTop();
    var scrollBottom     = scrollTop+$(window).height();
    $('[parallax]').each(function (i) {
      var dim = {
        top: $(this).offset().top,
        height: $(this).outerHeight(),
        bottom: $(this).offset().top+$(this).outerHeight()
      }

      var visible = (parallax.range({number: scrollTop,start: dim.top,end: dim.bottom}) || parallax.range({number: scrollBottom,start: dim.top,end: dim.bottom})) ? true : false;
      var thisPos;
      var height;

      if (visible) {
        if (i < 1) {
          height  = dim.height;
          thisPos = parseInt(scrollTop/height*100);
        } else {
          height  = dim.height*2;
          thisPos = parseInt((scrollTop-dim.top+dim.height)/height*100);
        }
        parallax.position($(this),thisPos);
      }
    });
    parallax.global($(this),scrollTop/$(document).outerHeight()*100);
  },
  apply: function () {
    function applyDimensions(el) {
      el.css('width',w.w+'px');
      el.css('height',w.h+'px');
    }
    var w = { w: $(window).width(), h: $(window).height() };
    var sections = $('[parallax]');

    applyDimensions($('.section-container'));
    sections.each(function (i) {
      applyDimensions($(this));
      $(this).css('z-index',sections.size()-i);
    });
  },
  scrollInit: function () {
    $(window).on('scroll',function (event) {
      parallax.scroll(event);
    });
  },
  init: function () {
    parallax.apply();
    parallax.scroll();
    parallax.scrollInit();
    window.scrollTo(0,0);
  }
}

$(function () {
  parallax.init();
})