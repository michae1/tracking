(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)){ return; }
    js = d.createElement(s); js.id = id;
    js.onload = function(){
        // remote script has loaded
    };
    js.src = "//domain/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'unique-tag'));