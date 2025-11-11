export const noiseVertex = `
  void main() {

    vec4 mvm = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvm;
  }
`

export const noiseFragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  uniform vec3 u_color1;
  uniform vec3 u_color2;

  uniform vec4 u_frag;

  vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
  }

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

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  vec3 rgb(float r, float g, float b) {
    return vec3(r / 255., g / 255., b / 255.);
  }

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    float t = 1.0;
    t = snoise(u_time+st)*0.1;

    // Randomize position
    st += snoise(t*st*6.)*0.2; // Animate the coordinate space

    // Animate white shape
    vec3 color = rgb(0., 0., 0.);
    color -= smoothstep(.02,.09, noise(st*7.));

    // Animate Color
    vec3 bgMain = rgb(255., 255., 255.);
    vec3 c1 = rgb(u_color1.r, u_color1.g, u_color1.b);
    vec3 c2 = rgb(u_color2.r, u_color2.g, u_color2.b);

    vec3 color2 = mix(bgMain, c1, t * 40.);
    color2 = mix(color2, c2, t * 20.);

    color *= color2;
    gl_FragColor = vec4(0.05-color, 1.0);
}
  `
