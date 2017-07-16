var cssList=[];

document.addEventListener("DOMContentLoaded",function(){
  document.querySelector("#url-add").addEventListener("click",addUrl,true);
  document.querySelector("#css-add").addEventListener("click",addCss,true);
  document.querySelector("#css").addEventListener("submit",submitCss,true);
  document.querySelector("#delete-css").addEventListener("click",removeCss,true);
  document.querySelector("#pane-css select").addEventListener("change",getCss,true);
  createCssList();
});



// cssList chane
// urlList and cssList recreate
chrome.storage.onChanged.addListener(function(changes,napespace){
  if(changes.csses){
      console.log("onChange csses");
    cssList=[];
    for (i=0;i<changes.csses.newValue.length;i++){
      cssList.push(changes.csses.newValue[i].name);
    }
    cssList.sort();
    console.log("cssList: ",cssList);
    getCssList();
    setCssLitforUrl()
  }
});



// initialize
function createCssList(){
chrome.storage.local.get("csses",function(v){
  console.log("createCssList");
  cssList=[];
  for(i in v.csses){
    cssList.push(v.csses[i].name);
  }
  cssList.sort();
  getUrlList();
  getCssList();
  getCss();
});
}

function setCssLitforUrl(){
  console.log(arguments.callee.name);
  forms = document.querySelectorAll("#pane-url main form.url");
  for(n in Object.keys(forms)){
    form = forms[n];
    select = form.querySelector("select");
    if(select){
      console.log(select,select.value);
      selected = select.value;
      var child;
      while(child = select.lastChild){ select.removeChild(child);}
      console.log(select);
      for(n in cssList){
        option = document.createElement("option");
        option.setAttribute('value',cssList[n]);
        option.appendChild(document.createTextNode(cssList[n]));
        select.add(option);
      }
      if(selected != -1){
        select.value=selected
      }
    }
  }
}


function getUrlList(){
  chrome.storage.local.get("urls",function(v){
    console.log("getUrlList");
    forms = document.querySelectorAll("#pane-url main form");
    for(n in Object.keys(forms)){
      document.querySelector("#pane-url main").removeChild(forms[n]);
    }
    for(n in v.urls){
      item = v.urls[n]
      console.log("url:",item);
      form = newUrl();
      form.querySelector(".url").value=item.url;
      form.querySelector(".css").value=item.css;
      document.querySelector("#pane-url main").appendChild(form);
    }
    forms = document.querySelectorAll("#pane-url main form");
//    for(n in Object.keys(forms)){
//        i = Array.prototype.map.call(v.urls,function(e){ return e.url}).indexOf(forms[n].querySelector(".url").value);
//        if(i!=-1){
//          forms[n].querySelector(".css").value = v.urls[i].css;
//        }
//    }
  });
}

function newUrl(){
  console.log(arguments.callee.name);
  form = document.createElement("form");
  form.className="url";
  url = document.createElement("input");
  url.type="text";
  url.className="url";
  css = document.createElement("select");
  css.className="css";
  for(n in cssList){
    option = document.createElement("option");
    option.value=cssList[n];option.text=cssList[n];
    css.appendChild(option);
  }
  reset = document.createElement("button");
  reset.type="reset";
  reset.innerHTML="リセット";
  submit = document.createElement("button");
  submit.type="submit";
  submit.innerHTML="保存";
  remove = document.createElement("button");
  remove.type="button";
  remove.innerHTML="削除";
  form.appendChild(url);
  form.appendChild(css);
  form.appendChild(reset);
  form.appendChild(submit);
  form.appendChild(remove);
  form.addEventListener("submit",submitUrl.bind(form));
  remove.addEventListener("click",removeUrl.bind(form));
  console.log(form);
  return form;
}

function removeUrl(){
  console.log(arguments.callee.name);
  form = this;
  url = this.querySelector(".url").value;
  css = this.querySelector(".css").value;
  chrome.storage.local.get({urls:[]},function(v){
    for(i in v.urls){
      item = v.urls[i];
      if (item.url == url){
        v.urls.splice(i,1);
        chrome.storage.local.set({urls:v.urls},setOk);
        console.log(this);
        document.querySelector("#pane-url main").removeChild(form);
        return;
      }
    }
  });
}

function submitUrl(e){
  e.preventDefault();
  url = this.querySelector(".url").value;
  css = this.querySelector(".css").value;
  console.log("submitUrl",url,css);
  chrome.storage.local.get({urls:[]},function(v){
    for(i in v.urls){
      item = v.urls[i];
      if (item.url == url){
        item.css = css;
        chrome.storage.local.set({urls:v.urls},setOk);
        return;
      }
    }
    v.urls.push({"url":url,"css":css});
    chrome.storage.local.set({urls:v.urls},setOk);
    getUrlList();
  });
}
function addUrl(){
  form = newUrl();
  document.querySelector("#pane-url main").appendChild(form);
}

function submitCss(e){
  e.preventDefault();
  select = document.querySelector("#pane-css select");
  selected = Array.prototype.map.call(select.childNodes,function(e){ return e.selected}).indexOf(true);
  if(selected==-1){
    return;
  }
  name = select.childNodes[selected].value
  console.log("name: ",name);
  if(!name){
    console.log("no selected");
    return;
  }
  css = document.querySelector("#pane-css textarea").value;
  console.log("css: ",css);
  chrome.storage.local.get("csses",function(v){
    for(n in v.csses){
      item = v.csses[n];
      if(item.name==name){
        item.css=css;
        chrome.storage.local.set({csses:v.csses},setOk());
        return
      }
    }
    if(!v.csses){
    v.csses=[]
    }
    v.csses.push({"name":name,"css":css});
    chrome.storage.local.set({csses:v.csses},setOk());
  });
}

function setOk(){
  console.log("saved");
}


function getOk(value){
  console.log(value.css);
}







function getCss(){
  console.log(arguments.callee.name);
  select = document.querySelector("#pane-css select");
  selected = Array.prototype.map.call(select.childNodes,function(e){ return e.selected}).indexOf(true);
  if(selected==-1){
    console.log("no selected");
    return;
  }
  name = select.childNodes[selected].value
  console.log("name: ",name);
  
  chrome.storage.local.get("csses",function(v){
    for(n in v.csses){
      item = v.csses[n]
      console.log(item);
      if(name == item.name){
        document.querySelector("#pane-css textarea").value = item.css;
      }
    }
  });

}

function getCssList(){
  console.log(arguments.callee.name);
    if(!cssList){
      console.log("cssList not set");
      return;
    }
    select = document.querySelector("#pane-css select");
    var child;
    while(child = select.lastChild){select.removeChild(child)};
    for(n=0; n<cssList.length;n++){
      option = document.createElement("option");
      option.value=cssList[n];option.text=cssList[n];
      select.add(option);
    }
    console.log(document.querySelector("#pane-css select"));
}

function addCss(){
  console.log(arguments.callee.name);
    name = document.querySelector("#css-name").value;
    select = document.querySelector("#pane-css select");
    if(cssList.indexOf(name)==-1){
      var child;
      while(child = select.lastChild){select.removeChild(child)};
      option = document.createElement("option");
      option.setAttribute("value",name);
      option.textContent=name;
      select.add(option);
      for(n=0;n<cssList.length;n++){
        option = document.createElement("option");
        option.value=cssList[n];option.text=cssList[n];
        select.add(option);
      }
    } else {
      console.log(name,"is already exist");
    }
}

function removeCss(){
  console.log(arguments.callee.name);
    name = document.querySelector("#pane-css select").value;
    chrome.storage.local.get("csses",function(v){
      i = Array.prototype.map.call(v.csses,function(e){ return e.name}).indexOf(name);
      if(i!=-1){
        v.csses.splice(i,1);
      }
      chrome.storage.local.set({csses:v.csses},setOk);
    });
}
