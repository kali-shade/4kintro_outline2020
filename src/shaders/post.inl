/* File generated with Shader Minifier 1.1.6
 * http://www.ctrl-alt-test.fr
 */
#ifndef POST_INL_
# define POST_INL_
# define VAR_I "v"
# define VAR_O "c"

const char *post_frag =
 "#version 130\n"
 "uniform sampler2D c;"
 "out vec4 v;"
 "vec2 m=vec2(1920,1080);"
 "void main()"
 "{"
   "vec2 s=gl_FragCoord.xy/m;"
   "v=texture(c,s);"
   "for(float f=0.,e=texture(c,s).w*.6;f<6.3;f+=.1)"
     "v+=texture(c,clamp(s+vec2(cos(f),sin(f))*(.4/m)*(clamp((2.5-1./e)*.2,-1.,1.)*16.),.001,.999));"
   "v/=63;"
 "}";

#endif // POST_INL_
