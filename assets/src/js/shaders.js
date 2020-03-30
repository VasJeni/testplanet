var loadTextResource = function(url) {
    return new Promise(function(resolve, reject){

        var request = new XMLHttpRequest();

        request.open('GET', url, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                resolve(request.responseText);
            }else{
                reject('Error: HTTP status - ' + request.status + ' on resource ' + url);
            }
        };

        request.send();

    });
};

var initWebGL =  function() {
    var VRText, FSText;
    loadTextResource('shaders/vertexShader.glsl')
        .then(function(result){
        VSText = result;
        return loadTextResource('shaders/fragmentShader.glsl');
    })
        .then(function(result){
            FSText = result;
            return StartWebGL(VSText, FSText)
        })
        .catch(function (error) {
            alert("Errors with loading resources. See console");
            console.log(error);
        })
};
var StartWebGL = function (vertexShaderText, fragmentShaderText) {
  var canvas = document.getElementById('backgroud');
  var gl = canvas.getContext('webgl');

  if (!gl) {
      alert('Your brouser does not support WebGL');
      return;
  }
  canvas.height = gl.canvas.clientHeight;
  canvas.width= gl.canvas.clientWidth;

  gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

  console.log(gl);
};

document.addEventListener('DOMContentLoaded', function () {
    initWebGL();
});