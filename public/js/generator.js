KISSY.use("overlay",function(S,Overlay){
    KISSY.Config.debug = true;
    var $ = S.all, anim = S.Anim;
    var $J_SelContent = $("#J_SelContent");
    $("#J_SelType").on("click", function (e) {
        var tar = this;
        e.preventDefault();
        $(tar).all('.arrow').toggleClass('arrow-up arrow-down');
        if (!$J_SelContent.hasClass("isdown")) {
            // $J_SelContent.addClass("isdown").stop().animate({height:"114px"},1,function(){});
            $J_SelContent.addClass("isdown").show();
            anim('#J_SelContent', {"height": "114px"}, 0.5, 'swing',function () {
            }).run();
        } else {
            // $J_SelContent.removeClass("isdown").stop().animate({height:0},1,function(){});
            $J_SelContent.removeClass("isdown");
            anim('#J_SelContent', {"height": "0"}, 0.5, 'swing',function () {
                $J_SelContent.hide();
            }).run();
        }
    })

    $("li", $("#J_SelContent")).on("click", function (e) {
        $("a", $(e.currentTarget)).addClass("cur")
        $(e.currentTarget).siblings().all("a").removeClass("cur");
        $("#J_TxtType").text($(e.currentTarget).attr("data-type"));
        $J_SelContent.removeClass("isdown").hide().fadeOut();
    })
    window.getSerieData = function(){

    }
    // window.showPop = function(iframeWindow){
    //     S.log($("#J_series",$(iframeWindow.document))[0])
    //     if (!window.pop) {
    //         var o = new Overlay.Dialog({
    //             width: 750,
    //             height: 400,
    //             align: {
    //                 points: ['cc', 'cc']
    //             },
    //             mask:true,
    //             elStyle: {
    //                 position: S.UA.ie == 6 ? "absolute" : "fixed"
    //             },
    //             bodyContent: $("#J_series",$(iframeWindow.document))[0],
    //             headerContent: "<div class='kc-title'>填充数据</div>"
    //         });
    //         window.pop = o;
    //         o.on("hide",function(){
    //          iframeWindow.updateArea($("#J_series").val())
    //         });
    //     }
    //     window.pop.center();
    //     window.pop.show();
    // }
});