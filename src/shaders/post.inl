/* File generated with Shader Minifier 1.1.6
 * http://www.ctrl-alt-test.fr
 */
#ifndef POST_INL_
# define POST_INL_
# define VAR_I "v"
# define VAR_O "z"

const char *post_frag =
 "#version 130\n"
 "uniform sampler2D z;"
 "out vec4 v;"
 "vec2 s=vec2(1920,1080);"
 "void main()"
 "{"
   "vec2 m=gl_FragCoord.xy/s,w=.4/s;"
   "vec3 c=texture(z,m).xyz;"
   "float e=clamp((2.5-1./(texture(z,m).w*.6))*.2,-1.,1.)*16.,f;"
   "for(f=0.;f<6.28;f+=.1)"
     "c+=texture(z,m+vec2(cos(f),sin(f))*w*e).xyz;"
   "v=vec4(c/62.8,1.);"
 "}";

#endif // POST_INL_
