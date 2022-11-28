var crClass = 'current',            //カレント表示用クラス名
    currentWidth = window.innerWidth,
    storageName = 'mofaFontSize';   //文字サイズ保存用cookie用key

//動的に追加されたコンテンツのonloadイベントの代替
$.fn.extend({
    /**
     * Add handler which is called when the element is loaded, using timeout.
     * @param {Function} func This will be called then the element is loaded.
     * @param {Object} option Some configurations.
     */
    onReady: function (func, option) {
        var s = this.selector,
            config = { "limit": 60000, "delay": 500 },
            start = (new Date()).getTime(),
            progress = function () {
                var e = $(s);
                if (e.length) { func.apply(e); return; }
                if ((new Date()).getTime() - start > config.limit) { return; }
                window.setTimeout(progress, config.delay);
            };
        $.extend(config, option);
        progress();
    }
});

//与えられた要素中、幅（w）もしくは高さ（h）が最も大きいものの値を返す※pading含む
//WorHには幅の場合'w'を、高さの場合は'h'を引数に渡す
$.fn.biggest = function (WorH) {
    var arr = [], max = 1, i;

    switch (WorH) {
        //比較対象が幅（width）の時
        case 'w':
            //最大幅を求める基となる対象要素の各幅を配列に格納
            //            for (i = 0; i < this.length; i++) { arr[i] = elem.eq(i).innerWidth(); }
            for (i = 0; i < this.length; i++) { arr[i] = this.eq(i).innerWidth(); }
            break;
        //比較対象が高さ（height）の時
        case 'h':
            //最大高さを求める基となる対象要素の各高さを配列に格納
            for (i = 0; i < this.length; i++) { arr[i] = this.eq(i).innerHeight(); }
            break;
        default:
            max = -1;
    }

    //maxが-でなければ最大値を求める
    if (max) { max = Math.max.apply(null, arr); }
    return max;
};

//cookieの値を取得
var getCookie = function () {
    var st = '', ed = '';
    if (document.cookie.length > 0) {
        // クッキーの値を取り出す
        st = document.cookie.indexOf(storageName + '=');
        if (st != -1) {
            st = st + storageName.length + 1;
            ed = document.cookie.indexOf(';', st);
            if (ed == -1) {
                ed = document.cookie.length;
            }
            // 値をデコードして返す
            return decodeURIComponent(document.cookie.substring(st, ed));
        }
    }
    return '';
};

//cookieに値をセット
var setCookie = function (c_name, value, expiredays) {
    // pathの指定
    var path = location.pathname,
        extime = new Date().getTime(),
        cltime = new Date(extime + (60 * 60 * 24 * 1000 * expiredays)),
        exdate = cltime.toUTCString(),
        s = '';

    s += c_name + '=' + encodeURIComponent(value);
    s += '; path=' + '/';

    if (expiredays) {
        s += '; expires=' + exdate + '; ';
    } else {
        s += '; ';
    }
    document.cookie = s;
};

//cookieに保存されているフォントサイズを取得
var getFontSize = function () {
    var cookie = getCookie();
    if (cookie == '') { cookie = 'middle'; }
    $('body').addClass(cookie);
    $('#textchanger dd.' + cookie).addClass(crClass);
};

//要素の上下パディングを設定して内包するテキストを縦中央寄せにする
$.fn.verticalCenter = function (baseHeight, options) {
    options = $.extend({
        basePt: 0,
        basePb: 0
    }, options);

    var i, diff, pt, pb;

    for (i = 0; i < $(this).length; i++) {
        //アイテムボックスの最大サイズと内容テキストの高さとの差を求める
        diff = baseHeight - parseInt($(this).eq(i).height()) - options.basePt - options.basePb;
        //求めた差を2で割って、上下のパディングに割り当てる
        pt = pb = Math.floor(diff / 2);
        //2で割った余りが有れば、上パディングに1を足す
        if (diff % 2) { pt += 1; }
        //css設定
        $(this).eq(i).css({ 'padding-top': pt + options.basePt, 'padding-bottom': pb + options.basePb });
    }
};

//タブ切り替えメニューの表示調整
var listTabAdjust = function () {
    var tabElem = $('div.list-tab h2'),
        tabElemChild = tabElem.find('span');
    tabElemChild.autoHeight({ cols: 2 });
    tabElem.parent().css('padding-top', parseInt(tabElem.height()));
};

//タブがクリックされた際の表示切替
var changeTab = function (elem) {
    if (!(elem.parent().hasClass(crClass))) {
        //既に振られていた要素からカレント用クラスを削除
        $('h2.tabhead, div.tabbody').removeClass(crClass);
        //カレント表示用クラスの付加
        elem.parent().addClass(crClass);
        elem.parent().next('div.tabbody').addClass(crClass);
    }
};

//文字サイズ変更機能「小」「中」「大」ボックスの高さ調整
var textchangerAdjust = function () {
    var elem = $('#textchanger dd:not(".large") a'),
        baseH = $('#textchanger dd.large a').innerHeight();   //「大」の高さ

    elem.verticalCenter(baseH);
};

//検索エリアの幅調整
var searchAreaAdjust = function () {
    var w1 = $('#searchbox').outerWidth(),
        w2 = $('#searchbutton').outerWidth()
    h = $('#textchanger dd.large a').innerHeight();

    //$('#cse-search-box').css('width', w1 + w2 + 4);
    $('#searchbox').css('height', h - 4);
    $('#searchbutton').css('height', h + 2);
};

$(function () {
    //検索エリアの入力エリア内の文言変更
    /*if ($('html').attr('lang') == 'ja') {
        $("input#searchbox").attr('placeholder', 'カスタム検索');
    } else {
        $("input#searchbox").attr('placeholder', 'Custom search');
    }*/

    //#subエリア有無の確認
    if ($('#sub').length == 0) {
        $('#wrapper').addClass('side-off');
    } else {
        $('#wrapper').addClass('side-on');
    }
    if ($('#top-menu').length == 0) {
        $('#wrapper').addClass('side-menu-off');
    } else {
        $('#wrapper').addClass('side-menu-on');
    }

});

//文字サイズ変更の際の表示リセット
var reset = function () {
    //$('#navi-global a').autoHeight({ cols : 6 });
    textchangerAdjust();
    searchAreaAdjust();
    //	$('.movies a').autoHeight({ cols : 4 });
    //    if ($('div.list-tab').length) { listTabAdjust(); }
    if ($('div.list-tab')[0]) { listTabAdjust(); }
    //    $('#sitemap-footer .wrapper > dl').autoHeight({ cols : 3 });
};

//「false」を返す関数
var retFalse = function () { return false; };

//文字サイズ変更機能の処理
var changeTextSize = function (elem) {
    //対象に既にカレントクラスが付加されてない場合
    if (!(elem.hasClass(crClass))) {
        //押されたのが小・中・大のどれかを取得
        var fsize = elem.parent().attr('class');
        fsize = fsize.replace('current', '');
        //cookieに選択されたフォントサイズを保存
        setCookie(storageName, fsize, 7);
        //対象にカレント表示用クラスを付加
        $('#textchanger dd').removeClass(crClass);
        elem.parent().addClass(crClass);
        //bodyタグにフォントサイズ指定用クラスを付加
        $('body').removeClass('small middle large').addClass(fsize);
        //表示リセット
        reset();
    }
};

//イベントの種類とキーコード、キーボード操作の場合は押されたキーのチェック
//event=イベントタイプ、keycode=キーコード、func=条件に合致した際に実行する関数
$.fn.checkInput = function (event, keycode, func) {
    if (event === 'mouseup' || (event === 'keyup' && keycode === 13)) { func(this); }
};

//フォトトピックス表示画像サイズ調整
var replacementImage = function () {
    var BASE_W = 459;
    var BASE_H = 334;
    var rate = (BASE_W / BASE_H);
    var elem = $('#image-slide li a > img');
    var i;

    for (i = 0; i < elem.length; i++) {
        var img = new Image();
        img.src = elem.eq(i).attr('src');

        elem.eq(i).css('width', 'auto');
        elem.eq(i).css('height', 'auto');
        elem.eq(i).css('margin', '0 auto');

        // 縦横判定
        if (rate >= (img.width / img.height)) {
            // portrait
            elem.eq(i).css('height', '100%');
        } else {
            // landscape
            elem.eq(i).css('width', '100%');
        }
    }
};

//ロード時の処理
$(function () {
    //$(document).ready(function(){
    //$(window).bind('load', function(){
    getFontSize();
    replacementImage();

    //文字サイズ変更機能用イベント登録
    $('#textchanger a').on('mouseup keyup', function (e) { $(this).checkInput(e.type, e.keyCode, changeTextSize) }).on('click', retFalse);

    //タブがクリックされた時のイベント登録
    if ($('div.list-tab').length) {
        $('div.list-tab h2 a').on('mouseup keyup', function (e) { $(this).checkInput(e.type, e.keyCode, changeTab); }).on('click', retFalse);
    }
    //if (is_mobile == false) {
    //    $('#navi-global li.about').bind('textresize', reset);
    //}

    searchAreaAdjust();

    //CSS3PIE
    if (window.PIE) { $('#header ul.menu-sub, #header ul.menu-language a').each(function () { PIE.attach(this); }); }
});



// jquery toggle just the attribute value
$.fn.toggleAttrVal = function (attr, val1, val2) {
    var test = $(this).attr(attr);
    if (test === val1) {
        $(this).attr(attr, val2);
        return this;
    }
    if (test === val2) {
        $(this).attr(attr, val1);
        return this;
    }
    // default to val1 if neither
    $(this).attr(attr, val1);
    return this;
};

$.fn.toggleTextVal = function (val1, val2) {
    var text = $(this).text();
    if (text === val1) {
        $(this).text(val2);
        return this;
    }
    if (text === val2) {
        $(this).text(val1);
        return this;
    }
    // default to val1 if neither
    $(this).text(val1);
    return this;
};

// animateCallback
$.fn.animateCallback = function (callback) {
    var alias = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend';
    return this.each(function () {
        $(this).on(alias, function () {
            $(this).off(alias);
            return callback.call(this);
        });
    });
};

var recomendTop;
var recomendHeight;
//おすすめ情報表示スクロール位置
var recomendStart = 1200;

//グローバルメニューの開閉
$(document).on('click', '#global-menu-button', function () {
    var elm = $(this);
    grovalmenu(elm)
});

$(document).ready(function () {
    var windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    var windowSm = 767;
    if (windowWidth <= windowSm) {
        //横幅767px以下のとき（つまりスマホ時）に行う処理を書く
        if ($('.zaigai_top').length == 0) {
            spInsert()
            $('body').removeClass('small middle large').addClass('middle');
            $('#textchanger dd').removeClass('current');
            $('#textchanger dd.middle').addClass('current');

        }
    } else {
        //横幅767px超のとき（タブレット、PC）に行う処理を書く

    }
});
$(window).on('load', function () {
    var windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    var windowSm = 767;
    if (windowWidth <= windowSm) {
        //横幅767px以下のとき（つまりスマホ時）に行う処理を書く
        $('body').removeClass('small middle large').addClass('middle');
        $('#textchanger dd').removeClass('current');
        $('#textchanger dd.middle').addClass('current');
        recomendinfo();
        //おすすめ情報
        if ($('body').hasClass('zaigai_top') == false) {
            if ($('#sub .photo-section').length > 0) {
                changeLinkText();
            }
        }
    } else {
        //横幅767px超のとき（タブレット、PC）に行う処理を書く
        //おすすめ情報
        if ($('#sub .photo-section').length > 0) {
            $('.link-text').remove();
            $('.caption-link').removeClass('caption-link');
        }

    }
});
$(window).on('resize', function () {

    reset();

    var windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    var windowSm = 767;
    if (windowWidth <= windowSm) {
        //横幅767px以下のとき（つまりスマホ時）に行う処理を書く
        if ($('.zaigai_top').length == 0) {

            if ($('.sp-view-control').length == 0) {
                spInsert()
            }

            $('body').removeClass('small middle large').addClass('middle');
            $('#textchanger dd').removeClass('current');
            $('#textchanger dd.middle').addClass('current');
            recomendinfo();

        }
        //おすすめ情報
        if ($('body').hasClass('zaigai_top') == false) {
            if ($('#sub .photo-section').length > 0) {
                changeLinkText();
            }
        }
    } else {
        //横幅767px超のとき（タブレット、PC）に行う処理を書く
        if ($('#head-btn-area1').length == 1) {
            spReset()
        }
        //おすすめ情報
        if ($('#sub .photo-section').length > 0) {
            $('.link-text').remove();
            $('.caption-link').removeClass('caption-link');
        }
    }
})

$(document).on('scroll', function () {
    var windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    var windowSm = 767;
    if (windowWidth <= windowSm) {
        //横幅767px以下のとき（つまりスマホ時）に行う処理を書く
        if ($('.zaigai_top').length == 0) {

            var scrTop = $(document).scrollTop();
            if (scrTop > (recomendTop + recomendHeight - window.innerHeight)) {
                $('#sub .recomenmendinfo-section').removeClass('content-scroll content-minimum content-more').addClass('content-inline');
                if ($('html').attr('lang') == 'ja') {
                    $('.recomenmendinfo-control a').text('閉じる');
                    $('.recomenmendinfo-section .more-read').text('もっと見る')
                } else if ($('html').attr('lang') == 'ar') {
                    $('.recomenmendinfo-control a').text('أغلق');
                    $('.recomenmendinfo-section .more-read').text('أكثر من')
                } else {
                    $('.recomenmendinfo-control a').text('close');
                    $('.recomenmendinfo-section .more-read').text('more')
                }
            } else if (scrTop > recomendStart) {
                $('#sub .recomenmendinfo-section').addClass('content-scroll').removeClass('content-inline');
                $('#sub .recomenmendinfo-section .sub-accordion').show();
            } else if (scrTop < recomendStart) {
                $('#sub .recomenmendinfo-section').removeClass('content-scroll').removeClass('content-inline');
            }

        }
    } else {
        //横幅767px超のとき（タブレット、PC）に行う処理を書く

    }
});

//おすすめ情報内操作
$(document).on('click', '.recomenmendinfo-control a', function () {
    $('.recomenmendinfo-section').toggleClass('content-minimum');
    if ($('html').attr('lang') == 'ja') {
        $(this).toggleTextVal('閉じる', '開く');
    } else if ($('html').attr('lang') == 'ar') {
        $(this).toggleTextVal('أغلق', 'افتح');
    } else {
        $(this).toggleTextVal('close', 'open');
    }
})
$(document).on('click', '.more-read', function () {
    $('.recomenmendinfo-section').toggleClass('content-more');
    if ($('html').attr('lang') == 'ja') {
        $(this).toggleTextVal('もっと見る', '縮小');
    } else if ($('html').attr('lang') == 'ar') {
        $(this).toggleTextVal('أكثر من', 'أغلق');
    } else {
        $(this).toggleTextVal('more', 'close');
    }
});

function recomendinfo() {
    //おすすめ情報のサイズ等と取得
    if ($('#sub .recomenmendinfo-section').length == 1) {
        recomendTop = $('#sub .recomenmendinfo-section').offset().top;
        recomendHeight = $('#sub .recomenmendinfo-section').outerHeight();
    }
}
/*
function grovalmenu(elm) {
    elm.toggleClass('button-close');
    elm.toggleAttrVal('aria-expanded', 'false', 'true');
    $('body,#navi-global').toggleClass('show-global');
    if ($('#navi-global').hasClass('dsp-non')) {
        $('#navi-global').removeClass('dsp-non');
    } else {
        $('#navi-global').animateCallback(function () {
            $('#navi-global').addClass('dsp-non');
        });
    }
}
*/

//add:20200710 ------------------------------
function grovalmenu(elm) {
    elm.toggleClass('button-close');
    elm.toggleAttrVal('aria-expanded', 'false', 'true');
    $('li .innerCloseBtn').toggleAttrVal('aria-expanded', 'false', 'true');
	$('body,#navi-global').toggleClass('show-global');
    if ($('#navi-global').hasClass('dsp-non')) {
        $('#navi-global').removeClass('dsp-non');
    } else {
        $('#navi-global').animateCallback(function () {
            $('#navi-global').addClass('dsp-non');
        });
    }
}
//メニュー内の閉じるボタン
$(document).on('click', 'li .innerCloseBtn', function () {
	var btnSet1 = $('#global-menu-button');
		btnSet1.toggleClass('button-close');
		btnSet1.toggleAttrVal('aria-expanded', 'false', 'true');
		$('body,#navi-global').toggleClass('show-global');
		if ($('#navi-global').hasClass('dsp-non')) {
			$('#navi-global').removeClass('dsp-non');
		} else {
			$('#navi-global').animateCallback(function () {
				$('#navi-global').addClass('dsp-non');
			});
		}
	});
/*
	*/
//add:20200710 ------------------------------






function spInsert() {
    if ($('#recomenmendinfo').length == 1) {
        var spcontrol = $('<span class="sp-view-control"></span>');
        if ($('html').attr('lang') == 'ja') {
            spcontrol.append('<a href="javascript:void(0);" class="more-read">もっと見る</a>');
        } else if ($('html').attr('lang') == 'ar') {
            spcontrol.append('<a href="javascript:void(0);" class="more-read">أكثر من</a>');
        } else {
            spcontrol.append('<a href="javascript:void(0);" class="more-read">more</a>');
        }
        spcontrol.insertAfter('#recomenmendinfo .subbody');

        var header_control = $('<span class="recomenmendinfo-control"></span>');
        if ($('html').attr('lang') == 'ja') {
            header_control.append('<a href="javascript:void(0);" class="close">閉じる</a>');
        } else if ($('html').attr('lang') == 'ar') {
            header_control.append('<a href="javascript:void(0);" class="close">أغلق</a>');
        } else {
            header_control.append('<a href="javascript:void(0);" class="close">close</a>');
        }
        header_control.insertAfter('#recomenmendinfo h2.title2 span');
    }
	
}


function spReset() {
    $('#head-btn-area1,#head-btn-area2,#globalclose,#recomenmendinfo .sp-view-control,#recomenmendinfo h2.title2 .recomenmendinfo-control').remove();
	//グロナビを元の場所に移動
	var detached = $('#navi-global').detach();
	detached.insertAfter('header');
}


//SPサイズ ローカルメニューのアコーディオン
$(function () {
    if ($('#local-menu').length) {
        //「＃local-menu」が存在した場合の処理
        $('#contents-body > #main #page-title h1.title1 > span').addClass("sp-local");
		//汎用ページ右サイドアコーディオンの開閉操作
		$('#contents-body > #main #page-title h1.title1').attr('tabindex', '0');
      } else {
		$('#contents-body > #main #page-title h1.title1').removeAttr('tabindex');
      }

    //SPサイズ ローカルメニューがタップされた時の処理
　$("#contents-body > #main #page-title h1.title1").on("click keypress", function () {
	if ($('#local-menu').length) {
            //「＃local-menu」が存在した場合の処理
            var w = window.innerWidth ? window.innerWidth : $(window).width();
            var x = 767;
            if (w < x) {
                //画面サイズが768px未満のときの処理
                $('#local-menu').slideToggle("fast");
                $('#contents-body > #main #page-title h1.title1').toggleClass("clicked");
            } else {
                //画面サイズが768px以上のときの処理
                return;
            }
        }
    });
});

//SPサイズ トップページ 閉じるボタンのアコーディオン
$(function () {
	$('a.close-button').on("click",function() { return false; });

    //SPサイズ 閉じるがタップされた時の処理
    $(".close-button").on("click", function () {
        $(this).parent().next().slideToggle("fast");
        $(this).toggleClass("clicked");

        if ($(this).hasClass('clicked')) {
            if ($('html').attr('lang') == 'ja') {
                $(this).children("span").text("開く");
            } else if ($('html').attr('lang') == 'ar') {
                $(this).children("span").text("افتح");
            } else {
                $(this).children("span").text("open");
            }
        } else {
            if ($('html').attr('lang') == 'ja') {
                $(this).children("span").text("閉じる");
            } else if ($('html').attr('lang') == 'ar') {
                $(this).children("span").text("أغلق");
            } else {
                $(this).children("span").text("close");
            }
        }
		return false;
    });
});

//画面のリサイズに伴う処理
$(window).on('load resize', function () {
    var w = window.innerWidth ? window.innerWidth : $(window).width();
    var pc = 1025;

    if (w < pc) {
        //画面サイズが1025px未満のときの処理
        if ($('#head-btn-area1').length == 0) {
            //DOMを挿入
            var head_btn1 = $('<div id="head-btn-area1"></div>');
            head_btn1.append('<button id="global-menu-button" aria-label="メインメニュー" aria-controls="navi-global" aria-expanded= "false"></button>');
            head_btn1.insertAfter('#header-right .menu-language');

            var head_btn2 = $('<div id="head-btn-area2"></div>');
            if ($('#header-right .menu-language').length) {
                var i = 1;
                var j = 0;
                $('#header-right .menu-language > span').each(function () {
                    count_id = "head_btn_lang_" + i;
                    head_btn2.append($(this).html());
                    head_btn2.find('a').eq(j).attr('id',count_id);
                    i++;
                    j++;
                })
            }
            //head_btn2.append('<a href="http://www.mofa.go.jp/" id="head_btn_lang" title="English">English</a>');
            head_btn2.insertAfter('#header-right #head-btn-area1');
			
        }
		
		/*グロナビが無かったらボタンを表示させない*/
		if ($('#navi-global').length == 0) {
			$('#head-btn-area1').css('display', 'none');
		}

		//ハンバーガーメニュー内に閉じるボタン追加　修正 20200710 -----------------
		   var globalclose = $('<li id="globalclose"></li>');
            globalclose.append('<button class="innerCloseBtn" aria-label="メインメニュー" aria-controls="navi-global" aria-expanded="false" ></button>');

			globalclose.insertAfter('header + nav#navi-global > ul > li:last-of-type');
				//$('head').append('<style>#head-btn-area1 button:after { content: \'メニュー\'; color: #fff; font-size: 10px; }#head-btn-area1 button.button-close:after { content: \'閉じる\'; }</style>');
		//グロナビを検索より前に移動 20200710 -----------------
			var detached = $('#navi-global').detach();
			detached.insertAfter('#header-right #head-btn-area1');
			
		//ハンバーガーメニューの開閉判定 20220124 -----------------
			if ($('#global-menu-button').length == 1) {
				if ($('#navi-global').hasClass('show-global')) {
					$('#global-menu-button').addClass('button-close');
				}
			}


        if ($('#header-right #func').length == 1) {
            $('#func').appendTo('#header');
        }

    } else {
        if ($('#head-btn-area1').length == 1) {
            spReset()
        }
        if ($('#header-right #func').length == 0) {
            $('#func').insertAfter('#header-right .menu-language');
        }
    }
});


//画面のリサイズに伴う処理
$(window).on('load resize', function () {
    var w = window.innerWidth ? window.innerWidth : $(window).width();
    var sp = 767;
    var pc = 1025;

    if (w < sp) {

        //画面サイズが768px未満のときの処理
        var height = $('#contents-body > #main #page-title h1.title1').outerHeight();
        $('#local-menu').css('top', height + 'px');

        //右メニューをページタイトルに移動
        $("#page-title").append($("#local-menu"));

    } else if (sp < w && w < pc) {

        //画面サイズが768px以上1025px未満のときの処理
        $(".fixHeight").fixHeight();

        if ($('.content-minimum').length == 1) {
            $('#recomenmendinfo').removeClass('content-minimum');
        }

        //右メニューを元の位置に戻す
        $("#sub").prepend($("#local-menu"));
        $('#local-menu').css('display', '');

    } else if (pc <= w) {

        //画面サイズが1025px以上のときの処理

        $("#navi-global").removeClass("show-global");
        $("#navi-global").addClass("dsp-non");

        //グローバルメニューのサブメニュー表示の処理
        amazonmenu.init({
            menuid: 'navi-global'
        })
        //右メニューを元の位置に戻す
        $("#sub").prepend($("#local-menu"));
        $('#local-menu').css('display', '');
    }
});

$(window).on('load', function () {
    var w = window.innerWidth ? window.innerWidth : $(window).width();
    var pc = 1025;

    if (w < pc) {

        $("#navi-global > ul").addClass("navi-sp");
        $("#navi-global ul.navi-sp li").removeClass("hassub");
        $("#navi-global ul.navi-sp li").addClass("non-hassub");
        $(function () {
            //thisHeight = $("#top-menu").children(".menu-group").height(); //ターゲットの高さを取得
            firstHeight = $("#top-menu").outerHeight();
            thisHeight = $("#top-menu").children(".menu-group").height(); //ターゲットの高さを取得
            if((thisHeight + 40) >= firstHeight){//ターゲットと子要素の高さを比較
                openHeight = thisHeight + 40;//ターゲットより高い場合
            } else {
                openHeight = firstHeight;//ターゲットと同じ高さかそれ以下の場合
            }
        });
    }
});

$(window).on('resize', function () {
    var w = window.innerWidth ? window.innerWidth : $(window).width();
    var pc = 1025;

    if (w < pc) {
        if(w != currentWidth){

            $("#navi-global > ul").addClass("navi-sp");
            $("#navi-global ul.navi-sp li").removeClass("hassub");
            $("#navi-global ul.navi-sp li").addClass("non-hassub");
            $(function () {
                $("#top-menu").css('height','');
                if($('.more-menu span.si-show') == false){
                    firstHeight = $("#top-menu").outerHeight();
                }
                thisHeight = $("#top-menu").children(".menu-group").height(); //ターゲットの高さを取得
                if((thisHeight + 40) >= firstHeight){//ターゲットと子要素の高さを比較
                    openHeight = thisHeight + 40;//ターゲットより高い場合
                } else {
                    openHeight = firstHeight;//ターゲットと同じ高さかそれ以下の場合
                }
                if($('.more-menu span').hasClass('is-show')){
                    $("#top-menu").css('height',openHeight);
                }
            });
            currentWidth = window.innerWidth
        }
    }
});


var firstHeight;
var thisHeight;
var openHeight;

$(function () {
    $("#top-menu").addClass("is-hide"); //CSSで指定した高さにする

$('#top-menu .more-menu').on('click', function () {
    //トリガーをクリックしたら
    if (!$(this).find('span').hasClass("is-show")) {
        $(this).find('span').addClass("is-show").parent().parent().animate({ height: openHeight }, 200).removeClass("is-hide"); //高さを元に戻す
    } else {
        $(this).find('span').removeClass("is-show").parent().parent().animate({ height: firstHeight }, 200).addClass("is-hide"); //高さを制限する
}
    if ($('html').attr('lang') == 'ja') {
        $(this).find('span').toggleTextVal('閉じる', 'さらに表示する');
    } else if ($('html').attr('lang') == 'ar') {
        $(this).find('span').toggleTextVal('أغلق', 'أكثر من');
    } else {
        $(this).find('span').toggleTextVal('close', 'more');
    }
    $(this).toggleAttrVal('aria-expanded', 'true', 'false');
    $(this).next('#menu-grp').toggleAttrVal('aria-hidden', 'true', 'false');
    return false;
});
});


//スマートフォン用おすすめ情報形成
function changeLinkText() {
    $('#sub .photo-section .photo-box').each(function () {
        var linkText;
        if ($(this).find('a').length > 0) {
            if ($(this).find('.photo-box-a').find('.link-text').length == 0) {
                if ($(this).find('.photo-box-a').next('.photo-caption').length == 0) {//画像リンクあり、キャプション無し
                    linkText = $(this).find('img').attr('alt');
                } else if ($(this).find('.photo-box-a').next('.photo-caption').find('a').length == 0) {//画像リンクあり、キャプションにリンク無し
                    linkText = $(this).find('.photo-box-a').next('.photo-caption').text();
                } else {//画像リンクあり、キャプションあり
                    if ($(this).find('.photo-box-a').attr('href') == $(this).find('a').next('.photo-caption').find('a').attr('href')) {//画像リンクとキャプションリンクの参照先が同じ場合
                        linkText = $(this).find('.photo-box-a').next('.photo-caption').text();
                    } else {//画像リンクとキャプションリンクの参照先が違う場合
                        linkText = $(this).find('img').attr('alt');
                        $(this).find('.photo-box-a').next('.photo-caption').addClass('caption-link');
                    }
                }
                $('<span class="link-text">' + linkText + '</span>').appendTo($(this).find('.photo-box-a'));//画像リンクの文言をセット
            }
        }
    })
}
