//xhr error handing

 var getHttpRequest = function () {
  var httpRequest = false;

  if (window.XMLHttpRequest) {
    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
      httpRequest.overrideMimeType('text/xml');
    }
  }
  else if (window.ActiveXObject) {
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e) {}
    }
  }

  if (!httpRequest) {
    alert('Abort, unable to create XMLHTTP object');
    return false;
  }

  return httpRequest;
}

//Ajax form errors

var form = document.querySelectorAll('.form');
for (var i = 0; i < form.length; i++) {
    form[i].addEventListener("submit", function(e) {

        var errElem = this.querySelectorAll(".error_box");
        for (var i = 0; i < errElem.length; i++) {
          errElem[i].classList.remove("error_box");
          var span = errElem[i].querySelector('.error_txt');
          if (span) {
            span.parentNode.removeChild(span);
          }
        }

        e.preventDefault();
        var data = new FormData(this);
        var xhr = getHttpRequest();
        
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
              window.location.replace(response["redirect"]);
            }
            else {
              var errKey = Object.keys(response);
              for (var i = 0; i < errKey.length; i++) {
                var key = errKey[i];
                if (key == "taken") {
                  var input = document.querySelector('[name=uname]');
                }
                else if (key == "mtaken") {
                  var input = document.querySelector('[name=email]');
                }
                else {
                  var input = document.querySelector('[name='+key+']');
                }
                var span = document.createElement('span');
                span.className = "error_txt";
                span.innerHTML = response[key];
                input.parentNode.classList.add('error_box');
                input.parentNode.appendChild(span);
                if (response["redirect"]) {
                  window.location.replace(response["redirect"]);
                }
              }
            }
          }
        }
        
        xhr.open('POST', this.getAttribute('action'), true);
        xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
        xhr.send(data);

    });
}

//Field modification