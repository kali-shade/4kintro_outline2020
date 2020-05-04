// Mipmap fake glossy thing!
#version 130
uniform sampler2D o;
out vec4 i;
uniform int m;
float iTime=float(m/float(44100))+68.;
vec2 iResolution=vec2(1280,720);

#define rot2D(a) mat2(cos(a),sin(a),-sin(a),cos(a))

#define la 831u
//#define lb 1u+2u+4u+8u+8192u+32u+256u+512u+128u+64u
//#define lc 1u+2u+4u+8u+128u+64u
#define ld 524519u
#define le 463u
#define lf 271u
#define lg 751u
#define lh 819u
#define li 3276u
#define lj 65656u
//#define lk 1u+2u+8192u+32768u+256u
#define ll 195u
#define lm 24627u
#define ln 49203u
#define lo 255u
#define lp 799u
//#define lq 1u+2u+4u+8u+16u+32u+64u+128u+32768u
#define lr 33567u
#define ls 1006u
#define lt 3084u
#define lu 243u
//#define lv 131072u+65536u+2u+16u
//#define lw 4096u+32768u+1u+2u+16u+32u
//#define lx 4096u+8192u+16384u+32768u
#define ly 25600u
//#define lz 4u+8u+64u+128u+8192u+4096u
#define l0 3207u
#define l1 265216u
#define l2 2437u
//#define l3 4u+128u+256u+1024u+2048u
//#define l4 1024u+2048u+256u+2u
//#define l5 1024u+256u+2u+4u+128u
//#define l6 1u+1024u+256u+2u+4u+128u
#define l7 3076u
//#define l8 1u+2u+4u+128u+256u+1024u+2048u
#define l9 3462u

// aca se define la frase l+(letra o numero)
uint frase1[]=uint[](lf,ll,la,ls,lh,lp,la,lr,lt,ly,0u,l2,l0,l2,l0,999u);
uint frase2[]=uint[](lo,ln,ll,li,ln,le,0u,le,ld,li,lt,li,lo,ln,999u);
uint frase3[]=uint[](lj,lu,ll,ly,0u,l1,l7,0u,la,ln,ld,0u,l1,l9,999u);
uint frase4[]=uint[](ls,lt,la,ly,0u,lh,lo,lm,le,999u);

float iti;

float linea(vec2 uv, vec4 vert){
    uv-=vert.xy;
    vec2 pos=vert.zw;
    return length(uv-pos*clamp(dot(uv,pos)/dot(pos,pos),0.3,0.8));
}

float letra(vec2 uv, uint letra) {
    uv*=1.3;
    vec4 d = vec4(0.5,-0.5,1.,0.);
	float s = 1.; 
    s = (letra & 1u     ) > 0u ? min(s,linea(uv, d.wwwx)) : s; // vertical -1, -1
	s = (letra & 2u     ) > 0u ? min(s,linea(uv, d.wxwx)) : s; // vertical -1,  1
	s = (letra & 4u     ) > 0u ? min(s,linea(uv, d.wzxw)) : s; // horizont -1,  1
	s = (letra & 8u     ) > 0u ? min(s,linea(uv, d.xzxw)) : s; // horizont  1,  1 
 	s = (letra & 16u    ) > 0u ? min(s,linea(uv, d.zxwx)) : s; // vertical  1,  1
 	s = (letra & 32u    ) > 0u ? min(s,linea(uv, d.zwwx)) : s; // vertical  1, -1
 	s = (letra & 64u    ) > 0u ? min(s,linea(uv, d.xwxw)) : s; // horizont  1, -1
 	s = (letra & 128u   ) > 0u ? min(s,linea(uv, d.wwxw)) : s; // horizont -1, -1
 	s = (letra & 256u   ) > 0u ? min(s,linea(uv, d.wxxw)) : s; // horizont -1,  0
 	s = (letra & 512u   ) > 0u ? min(s,linea(uv, d.xxxw)) : s; // horizont  1,  0
 	s = (letra & 1024u  ) > 0u ? min(s,linea(uv, d.xwwx)) : s; // vertical  0, -1
 	s = (letra & 2048u  ) > 0u ? min(s,linea(uv, d.xxwx)) : s; // vertical  0,  1
 	s = (letra & 4096u  ) > 0u ? min(s,linea(uv, d.wwxx)) : s; // diagonal -1, -1
 	s = (letra & 8192u  ) > 0u ? min(s,linea(uv, d.xxxx)) : s; // diagonal  1,  1
 	s = (letra & 16384u ) > 0u ? min(s,linea(uv, d.wzxy)) : s; // diagonal -1,  1
 	s = (letra & 32768u ) > 0u ? min(s,linea(uv, d.xxxy)) : s; // diagonal  1, -1
 	s = (letra & 65536u ) > 0u ? min(s,linea(uv, d.wxxy)) : s; // diagona2 -1, -1
 	s = (letra & 131072u) > 0u ? min(s,linea(uv, d.xwxx)) : s; // diagona2  1, -1
 	s = (letra & 262144u) > 0u ? min(s,linea(uv, d.wxxx)) : s; // diagona2 -1,  1
 	s = (letra & 524288u) > 0u ? min(s,linea(uv, d.xzxy)) : s; // diagona2  1,  1
    return s;
}

vec3 texto(vec2 uv, int t) {
	float ti=max(0.,iTime-68.),cc=0.,s1=t==1?1.:0.,s2=t==2?1.:0.,s3=t==3?1.:0.,s4=t==4?1.:0.;
    uint let;
    vec2 p=uv*(1.7-.7*s1);
	p.y-=.84-s1*.38;
    p.x-=.1+s2*.65+s3*.65+s4*.93;
    p*=10.;
    vec3 c=vec3(0.),ic=vec3(1.,0.,0.);
    ic.xy*=rot2D(5.*(uv.x+uv.y)+ti*3.);
    p.x+=max(0.,2.-ti);
    for (int i=0; i<50; i++) {
        p.y+=sin(float(i)*2.+ti*1.5)*.2*max(1.,100.-ti*40.);
        if (t==1) let = frase1[i];
        if (t==2) let = frase2[i];
        if (t==3) let = frase3[i];
        if (t==4) let = frase4[i];
        if (let == 999u) break;
        c+=normalize(.1+abs(ic))*pow(max(0., 1.-letra(p, let)),8.)*.6+pow(max(0., 1.-letra(p, let)),15.);
        p.x-=1.1;
    }
	return c;
//    return c*min(1.,ti*.3);
}

void main()
{
	vec2 uv=gl_FragCoord.xy/iResolution;
	vec3 col=texture(o,uv).rgb;
	int f=int((iTime-68)*.15)+1;
	col+=texto(uv*vec2(1.78,1.),f);
	i = vec4(col,1);
}