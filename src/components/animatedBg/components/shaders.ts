export const vertex = `
  #define PI 3.14159265359

  uniform float u_time;
  uniform float u_pointsize;
  uniform float u_noise_amp_1;
  uniform float u_noise_freq_1;
  uniform float u_spd_modifier_1;
  uniform float u_noise_amp_2;
  uniform float u_noise_freq_2;
  uniform float u_spd_modifier_2;

  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 1e4); }
  float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

  float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

    // Four corners in 2D of a tile
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Simple 2D lerp using smoothstep envelope between the values.
    // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
    //			mix(c, d, smoothstep(0.0, 1.0, f.x)),
    //			smoothstep(0.0, 1.0, f.y)));

    // Same code, with the clamps in smoothstep and common subexpressions
    // optimized away.
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  mat2 rotate2d(float angle){
      return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
  }

  void main() {
    vUv = uv;

    gl_PointSize = u_pointsize;

    vec3 pos = position;
    // pos.xy is the original 2D dimension of the plane coordinates
    pos.z += noise(pos.xy * u_noise_freq_1 + u_time * u_spd_modifier_1) * u_noise_amp_1;
    // add noise layering
    // minus u_time makes the second layer of wave goes the other direction
    pos.z += noise(rotate2d(PI / 2.) * pos.yx * u_noise_freq_2 - u_time * u_spd_modifier_2 * 0.6) * u_noise_amp_2;

    vec4 mvm = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvm;
  }
  `

export const fragment = `
  uniform vec3 u_bgMain;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;

  uniform float u_time;
  uniform float u_cspd_modifier_1;
  uniform float u_cspd_modifier_2;
  uniform float u_cspd_modifier_3;
  uniform float u_cspd_modifier_4;

  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec3 rgb(float r, float g, float b) {
    return vec3(r / 255., g / 255., b / 255.);
  }

  void main() {
    vec3 c1 = rgb(u_color1.r, u_color1.g, u_color1.b);
    vec3 c2 = rgb(u_color2.r, u_color2.g, u_color2.b);
    vec3 c3 = rgb(u_color3.r, u_color3.g, u_color3.b);
    vec3 c4 = rgb(u_color4.r, u_color4.g, u_color4.b);
    vec3 bgMain = rgb(u_bgMain.r, u_bgMain.g, u_bgMain.b);

    float noise1 = snoise(vUv + u_time * u_cspd_modifier_1);
    float noise2 = snoise(vUv * 2. + u_time * u_cspd_modifier_2);
    float noise3 = snoise(vUv * 2. + u_time * u_cspd_modifier_3);
    float noise4 = snoise(vUv * 2. + u_time * u_cspd_modifier_4);

    vec3 color = mix(bgMain, c1, noise1 * .6);
    color = mix(color, c2, noise2 * .4);
    color = mix(color, c3, noise3 * .2);
    color = mix(color, c4, noise4 * .8);

    float border = smoothstep(0.1, 0.6, vUv.x);
    color = mix(color, bgMain, 1. -border);

    gl_FragColor = vec4(color, 1.0);
  }
  `
