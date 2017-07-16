chrome.storage.local.get(["urls","csses"],function(v){
  for(n in v.urls){
    re = new RegExp(v.urls[n].url);
    console.log(re.test(document.URL));
    if (re.test(document.URL)){
      css = v.urls[n].css;
    }
  }
  if(css){
    i = Array.prototype.map.call(v.csses,function(e){return e.name}).indexOf(css);
    if(i!=-1){
      csstext = v.csses[i].css;
    }
  }
  if(csstext){
    style = document.createElement("style");
    style.innerHTML=csstext;
    head = document.querySelector("head");
    head.appendChild(style);
  }
});