KISSY.use("dom,event",function(S,D,E){

  function updateParentFiddleUrl(url){
    if(window != parent ){
      var el = parent.document.getElementById("J_Fiddle");
      if(el){
        D.attr(el,"href",url);
      }
    }
  }

  if(window.config.href){
    updateParentFiddleUrl(window.config.href);
  }
});