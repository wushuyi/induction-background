//(function($){
//	$(document).ready(function (){

var $el = {};
$el.wrapper = $('#wrapper');
$el.scrollImg = $('.scroll-img', $el.wrapper);
$el.display = $('#display');

$el.wrapper.on('touchmove', function (evt) {
    evt.preventDefault();
});

//createjs.Ticker.timingMode = createjs.Ticker.RAF;
var anim = null;
var bgOffset = {
    X: 0
};
var touchLock = false;
var touchLockTimer = null;
var panMoveListener = function (evt) {
    var panOffsetX = evt.deltaX;
    $el.scrollImg.get(0).style.backgroundPositionX = bgOffset.X + panOffsetX + 'px';
};
var panEndListener = function (evt) {
    var panOffsetX = evt.deltaX;
    bgOffset.X = bgOffset.X + panOffsetX;
};
var touthStartListener = function (evt) {
    touchLock = true;
    if (touchLockTimer) {
        clearTimeout(touchLockTimer);
    }
    if (anim) {
        anim.pause();
        createjs.Tween.removeTweens(anim);
        var val = $el.scrollImg.get(0).style.backgroundPositionX.split('px')[0];
        bgOffset.X = parseInt(val);
    }
    //异步处理触摸响应 防止背景抖动
    setTimeout(function () {
        mc.on("panleft panright", panMoveListener);
        mc.on("panend", panEndListener);
    }, 0);
};
var touchEndListener = function (evt) {
    touchLockTimer = setTimeout(function () {
        touchLock = false;
    }, 800);
    mc.off("panleft panright", panMoveListener);
    mc.off("panend", panEndListener);
};
var tweenListener = function () {
    if (touchLock) {
        return false;
    }
    //console.log(bgOffset.X);
    $el.scrollImg.get(0).style.backgroundPositionX = parseInt(bgOffset.X) + 'px';
};

var mc = new Hammer.Manager($el.scrollImg.get(0));
var pan = new Hammer.Pan();
mc.add([pan]);
$el.scrollImg.on('touchstart', touthStartListener);
$el.scrollImg.on('touchend', touchEndListener);

gyro.frequency = 600;
gyro.startTracking(function (evt) {
    if (touchLock || !evt.gamma) {
        return false;
    }
    if (Math.abs(evt.gamma) > 10) {
        var offsetX = bgOffset.X + parseInt(evt.gamma) * 2;
    }
    if (!offsetX) {
        return false;
    }
    bgOffset.X = parseInt(bgOffset.X);
    if (anim) {
        anim.pause();
        createjs.Tween.removeTweens(anim);
    }
    anim = createjs.Tween.get(bgOffset).to({X: offsetX}, 1000);
    anim.addEventListener("change", tweenListener);

});

//	});
//})(window.jQuery);