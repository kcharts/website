

(function(S){

    var DOM = S.DOM, Event = S.Event,$ = S.all;

    var imitateInit = function(){
        _initInputText();
        _initRadio();
        _initCheckbox();
        _initSelect();
    };

    //模拟input[text]
    function _initInputText(){
    };

    //模拟radio
    function _initRadio(){
        var radioCls = '.K_groupRadio',
            GroupCls = '.K_commGroup',
            hideLayCls = '.K_hideValue',
            trigger = DOM.query(radioCls),
            dataValue = '';

        if(trigger.length == 0) return;
        S.each(trigger, function(el){
            Event.on(el, 'click', function(ev){
                hideLayCls = DOM.get(hideLayCls, DOM.parent(ev.target, GroupCls));
                clearAll();
                DOM.addClass(ev.target, 'checked');
                dataValue = DOM.attr(ev.target, 'data-value');
                DOM.val(hideLayCls, dataValue);
            });            
        });
        function clearAll(){
            S.each(trigger, function(el){
                DOM.removeClass(el, 'checked');            
            });            
        };
    };

    //模拟checkbox
    function _initCheckbox(){
        var checkCls = '.K_groupCheck',
            GroupCls = '.K_commGroup',
            hideLayCls = '.K_hideValue',
            trigger = DOM.query(checkCls),
            dataValue = '';

        if(trigger.length == 0) return;
        S.each(trigger, function(el){
            Event.on(el, 'click', function(ev){
                dataValue = '',
                hideLayCls = DOM.get(hideLayCls, DOM.parent(ev.target, GroupCls));
                DOM.toggleClass(ev.target, 'checked');
                if(DOM.hasClass(ev.target, 'checked')){
                    dataValue = DOM.attr(ev.target, 'data-value');
                }               
                DOM.val(hideLayCls, dataValue);
            });            
        });
    };

   
    //模拟select
    function _initSelect(){
        var selectCls = '.K_groupSelect',
            hideLayCls = '.K_hideValue',
            listCls = '.K_selectList',
            selectTxt = '.K_selectTxt',
            sanjiao = '.K_seTriangle',
            trigger = DOM.query(selectCls),
            dataValue = '',
            tri;

        if(trigger.length == 0) return;
        Event.delegate(document, 'click', selectCls, function(e){
            var $tgt = $(e.target),$ctgt =  $(e.currentTarget);
            S.log($ctgt.toggleClass('level'))
            $ctgt.toggleClass('level').all(listCls).toggle();
            $ctgt.all(sanjiao).toggleClass("up");
            if($tgt.hasClass(".K_selectLi")){
                $ctgt.all(hideLayCls).val($tgt.attr("data-value"));
                $ctgt.all(selectTxt).text($tgt.text());
            }
        });
    };


    S.ready(imitateInit);
})(KISSY);