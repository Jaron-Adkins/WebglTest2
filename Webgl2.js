/*
precision is how many float point the shader has
vec[int] is a vector of int values
uniforms are constants between shaders, gpu and cpu
attribute static variable?
varying dynamic variables?
*/
function run() {
  glMatrix.mat4.rotateZ(matrix, matrix, Math.PI / 100);
  gl.uniformMatrix4fv(matrixLocation, false, matrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(run);
}

const vertexShaderText = `
attribute vec2 position;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 matrix;

void main() {
  fragColor = vertColor;
  gl_Position = matrix * vec4(position, 0.0, 1.0);
}
`;
const fragmentShaderText = `
precision mediump float;
varying vec3 fragColor;

void main() {
  gl_FragColor = vec4(fragColor, 1.0);
}
`;
//js arrays are a default 64 float while webgl is expecting 32
const vert = new Float32Array([
  -0.5,  0.5,
  -0.5, -0.5,
   0.5, -0.5,
]);
const vertColor = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]);
var matrix = glMatrix.mat4.create();
const can = document.createElement("canvas");
const gl = can.getContext("webgl2");
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
const program = gl.createProgram();
//buffer(creates memory for gpu)
const vertBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

//Resize window
document.body.appendChild(can);
can.width = window.innerWidth;
can.height = window.innerHeight;
gl.viewport(0, 0, can.width, can.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

//shaders
gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
//if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) console.error("Error", gl.getShaderInfoLog(vertexShader));
gl.compileShader(fragmentShader);

//program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//binding js data to gl attributes
//gl.bindBuffer() will replace the previously binded gpu location
const positionLocation = gl.getAttribLocation(program, "position");
gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

const colorLocation = gl.getAttribLocation(program, "vertColor");
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertColor, gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorLocation);

gl.useProgram(program);

//bind js data to webgl uniforms
const matrixLocation = gl.getUniformLocation(program, "matrix");

run();