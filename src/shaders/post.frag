#version 130
uniform sampler2D o;
out vec4 i;
vec2 iResolution=vec2(1920,1080);
void main()
{
   vec2 uv=gl_FragCoord.xy/iResolution;
   i=texture(o,uv);
   for(float r=.0,d=texture(o,uv).w*.6;r<6.3;r+=.1)i+=texture(o,clamp(uv+vec2(cos(r),sin(r))*(.4/iResolution)*(clamp((1./.4-1./(d))*.2,-1.,1.)*16.),.001,.999));
   i/=63;
}