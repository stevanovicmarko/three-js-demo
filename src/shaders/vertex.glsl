// Following uniforms must be declared if we're using RawShaderMaterial instead of ShaderMaterial
// uniform mat4 projectionMatrix;
/// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// attribute vec2 uv;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}