#version 130
uniform sampler2D o;
out vec4 i;
vec2 iResolution=vec2(1920,1080);

void main()
{
   vec2 uv=gl_FragCoord.xy/iResolution,ps =.4/iResolution;
   vec3 col=texture(o,uv).rgb;
   float bs=(clamp((1.0 / .4 - 1.0 / (texture(o, uv).w*.6))*.2, -1.0, 1.0))*16.,r;
   for (r=.0;r<6.28;r+=.1)col+=texture(o,uv+vec2(cos(r),sin(r))*ps*bs).rgb;
   i = vec4(col/62.8,1.0);
}