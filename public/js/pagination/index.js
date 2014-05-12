KISSY.add(function(S,Template,Base){
    
    var $ = S.all,
        Evt = S.Event,
        PRE_CLS = "ks-pagination-prev",
        NEXT_CLS = "ks-pagination-next",
        PAGE_CLS = "ks-pagination-page",
        NEXT_D_CLS = "ks-pagination-nextdisable",
        PRE_D_CLS = "ks-pagination-predisable",
        GLOBAL_CLS = "ks-pagination-global";
    
    function Pagination(cfg){
        
        var self = this;
        
        self.config = S.mix({
                totalPage:0,
                curPage:0,
                autoRender:true,
                pageSize:10,
                tpl:{
                    page:"<a class='ks-pagination' href='javascript:void(0)'>{{page}}</a>",
                    curPage:"<strong class='current'>{{curPage}}</strong>",
                    prevPage:"<a class='pre' href='#{{prevPage}}'>prev</a>",
                    nextPage:"<a class='next' href='#{{nextPage}}'>next</a>",
                    prevDisable:"<a class='pre-disable' href='#{{prevPage}}'>prev</a>",
                    nextDisable:"<a class='next-disable' href='#{{nextPage}}'>next</a>",
                    more:"<span class='more'>...</span>"
                }
            },cfg,undefined,undefined,true);

        self._html = "";

        self.setPageInfo({
            totalPage:self.config.totalPage,
            curPage:self.config.curPage,
            pageSize:self.config.pageSize
        });
        
        self.config.autoRender && self.render();
        
        
    }

    S.extend(Pagination,Base,{

        setPageInfo:function(param){

            var self = this,

                param = param || {};

                self._totalPage = param.totalPage || self._totalPage;

                self._curPage = param.curPage || self._curPage;

                self._pageSize = param.pageSize || self._pageSize;

        },

        setPage:function(page){

            this.setPageInfo({curPage:Math.round(page)});

        },
        getDom:function(){

            var self = this,
                tpl = self.config.tpl,
                totalPage = self._totalPage,
                curPage = self._curPage,
                pageSize = self._pageSize,
                isOdd = pageSize % 2,
                middleOffset = isOdd ? Math.ceil(pageSize / 2) : Math.floor(pageSize / 2),
                beginPage = curPage - middleOffset + 1 <= 1 ? 1 : curPage - middleOffset + 1,
                endPage = beginPage + pageSize -1 >= totalPage ? totalPage : beginPage + pageSize -1,
                html = "";

            if(endPage - beginPage + 1 < pageSize && totalPage >= pageSize){

                var offset = pageSize - (endPage - beginPage + 1);

                if(beginPage - offset >= 1){
                    beginPage = beginPage - offset;
                } else{
                    endPage = endPage + offset;
                }
            }

            curPage == 1 ? html += "<span class='option'><span class='"+PRE_D_CLS+" "+GLOBAL_CLS+"'>"+Template(tpl.prevDisable).render({prevPage:self._curPage || 0}) + "</span>" : beginPage > 1 ? html += "<span class='option'>" + "<span class='"+PRE_CLS+" "+GLOBAL_CLS+"'>" + Template(tpl.prevPage).render({prevPage:self._curPage - 1 || 0}) + "</span>" + tpl.more : html += "<span class='option'>" + "<span class='"+PRE_CLS+" "+GLOBAL_CLS+"'>" + Template(tpl.prevPage).render({prevPage:self._curPage - 1 || 0}) + "</span>";
           
            for(var i = beginPage;i <= endPage;i++){
                
                html += (i == curPage ?  Template(tpl.curPage).render({curPage:i}) : "<span class='"+GLOBAL_CLS+" "+PAGE_CLS+"' page="+i+">"+ Template(tpl.page).render({page:i})+ "</span>") ;
            }
                
            curPage == totalPage ? html += "<span class='"+GLOBAL_CLS+" "+NEXT_D_CLS+"'>"+Template(tpl.nextDisable).render({nextPage:totalPage || 0})+"</span>" : endPage < totalPage ? html += tpl.more + "<span class='"+GLOBAL_CLS+" "+NEXT_CLS+"'>"+Template(tpl.nextPage).render({nextPage:Math.round(self._curPage) + 1 >= totalPage ? totalPage : Math.round(self._curPage) + 1}) + "</span></span>" : html += "<span class='"+GLOBAL_CLS+" "+NEXT_CLS+"'>"+Template(tpl.nextPage).render({nextPage:Math.round(self._curPage) + 1 >= totalPage ? totalPage : Math.round(self._curPage) + 1})+"</span></span>";
                
            self._html = html + "</span>";

        // S.log(self._html);
            
            return html;

        },
        //渲染
        render:function(){
            
            var self = this;
            
            if(!self.config.container) return;

            self.getDom();
            
            $(self.config.container).html(self._html);

            self._bindEvt(self.config);

            self.fire("afterRender");
            
            self.config.callback && self.config.callback(self);

        },
        //获取当前页
        getCurPage:function(){
            
            return this._curPage;
    
        },
        //获取总页数
        getTotalPage:function(){
            
            return this._totalPage;
            
        }
        ,//事件绑定
        _bindEvt:function(param){
            
            var self = this,page;
            
            if(!param.container) return;
            
            var container = param.container;
            
            Evt.detach($("."+GLOBAL_CLS,$(container)),'click');
            
            Evt.on($("."+GLOBAL_CLS,$(container)),"click",function(e){

                e.preventDefault();
                
                 var $tgt = $(e.currentTarget);
                //如果是页码 则分页
                if($tgt.hasClass(GLOBAL_CLS)){
                    
                    if($tgt.hasClass(PAGE_CLS)){
                        
                        page = Math.round($tgt.attr("page"));

                    }else if($tgt.hasClass(PRE_CLS)){
                        //上一页
                        page = self.getCurPage() - 1;

                    }else if($tgt.hasClass(NEXT_CLS)){
                        //下一页           
                        var totalPage = self.getTotalPage(),
                            curPage = self.getCurPage();

                        page = curPage < totalPage ? Math.round(curPage) + 1: curPage;

                    }

                    self.config.onclick && self.config.onclick(page);

                }
                
            });
        }

    });

    return Pagination;

},{requires:['template','./index.css','base']});