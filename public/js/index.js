(function (S) {
    var $ = S.all;

    var $J_Iframe = $("#J_Iframe"),
        $J_ChartName = $("#J_ChartName"),
        $J_ChartContent = $("#J_ChartContent");

    $("li", $("#J_MenuBar")).on("mouseenter", function (e) {
        var $content = $(".hide-content", $(e.currentTarget)),
            height = $content.height();
        $content.stop().animate({marginTop: -height, opacity: 1}, 0.4, "easeOut");
    });

    $("li", $("#J_MenuBar")).on("mouseleave", function (e) {
        $(".hide-content", $(e.currentTarget)).stop().animate({marginTop: 0, opacity: 0}, 0.3, "easeIn");
    });


    // KISSY.use('gallery/slide/1.1/',function(S,Slide){
    //   var s = new Slide('JSlide',{
    //     triggerSelector:'li',//触碰节点为a
    //     eventType:'click',//点击触碰点切换
    //     autoSlide:true,
    //       effect:'hSlide', //垂直切换
    //       timeout:4000,
    //       speed:700,
    //       selectedClass:'current'
    //   });
    // });

    //轮播
    (function () {
        S.use('gallery/slide/1.1/index', function (S, Slide) {
            var banner = new Slide('JSlide', {
                effect: 'fade',
                autoSlide: true,
                timeout: 3000,
                speed: 600,
                eventType: 'mouseover',
                selectedClass: 'selected',
                hoverStop: true
            });
            $('.b-prev').on('click', function (e) {
                e.halt();
                banner.previous().stop().play();
            });
            $('.b-next').on('click', function (e) {
                e.halt();
                banner.next();
            });
        });
    })();

    KISSY.use("event,switchable", function (S, Event, Switchable) {
        var Carousel = Switchable.Carousel;

        var carousel = new Carousel('#J_ChartList', {
            effect: 'scrollx',
            easing: 'easeOutStrong',
            viewSize: [131],
            circular: true,
            prevBtnCls: 'prev',
            nextBtnCls: 'next',
            disableBtnCls: 'disable'
        });

        $(".chart-icon", $("#J_ChartIcons")).on("click", function (e) {
            var $tgt = $(e.currentTarget),
                $a = $("a", $tgt),
                name = $tgt.attr("chartname"),
                content = $tgt.attr("chartcontent");
            $J_ChartName.text(name);
            $J_ChartContent.text(content);
            $J_Iframe.attr("src", "demos/" + $tgt.attr("charttype") + ".html");
            $("a", $("#J_ChartIcons")).removeClass("cur");
            $a.addClass("cur");
        });

        $(".chart-icon", $("#J_ChartIcons")).on("click", function (e) {
            var $tgt = $(e.currentTarget),
                $a = $("a", $tgt),
                name = $tgt.attr("chartname"),
                content = $tgt.attr("chartcontent");
            $J_ChartName.text(name);
            $J_ChartContent.text(content);
            $J_Iframe.attr("src", "demos/" + $tgt.attr("charttype") + ".html");
            $("a", $("#J_ChartIcons")).removeClass("cur");
            $a.addClass("cur");
        });

    });
})(KISSY);
