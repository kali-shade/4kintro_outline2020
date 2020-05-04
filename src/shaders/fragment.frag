#version 130
uniform int m;
out vec4 o;
float iT = m/float(44100);

int scene;

vec2 res=vec2(1920,1080);


#define ha(n) fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)
#define ro(a) mat2(cos(a),sin(a),-sin(a),cos(a))
//#define ro(a) mat2(cos(a+vec4(0,11,33,0))) 
#define no(v) normalize(v)
#define sm(a,b,c) smoothstep(a,b,c)

float det=.001,gt,maxdist=11.,pi=3.1459,z=0.,tube=0.,ap=0.,tubedist=0.;
vec3 glow1=vec3(0),glow2=vec3(0),fcol,tbc=vec3(1.3,.3,0),mdc=vec3(0,.3,2.);

float is(float s) 
{
	return step(float(abs(s-scene)),.1);
}

float tubes(vec3 p) {
    p.x+=sin(p.z)*.5*(1.-is(4));
    p.xy*=ro(p.z*1.5-gt*3.5);
    p.xy=abs(p.xy)-.1+(.2*is(4));
    p.xy-=.3-abs(p.z-z)*.05;
    float d=(length(p.xy)-.1+abs(.5-fract(p.z*10.))*.01)*.8+.05*is(4);
    return max(d,-abs(p.z-z)+tubedist*10.+5.);
}

vec3 path(float t) {
    float s = step(95.,iT);
    return vec3( vec2( sin(t*.5)*1.5 + sin(t*.25)*3.*is(0)*s,
                       cos(t*.3)*1.5 )
                  * ( s+is(0) < 1.5 ? sin(t*.1) : 1. )
//                  *  ( 1. - is(3) )
                , t );
}



float de(vec3 p) {
    p.xy -= path(p.z).xy;
    float pz = p.z, fz=floor(pz), t = tubes(p), m=1e2, a,h;
    p.xy *= ro(  gt * mix(1.+sin(fz), -1., is(3) ) + fz );
    a = atan(p.y,p.x)*2.55;
    vec2 id = floor( vec2( a, pz*2.+floor(gt*(5.+is(3)/.1))) );
    h = step (.85, ha(id*.156) );

	vec3 p3=fract(id.xyx * vec3(.1031, .1030, .0973));
    p3+=dot(p3, p3.yxz+33.33);

    fcol = ( scene==3 ? max(.2,sin(id.y+id.x)) * vec3(0,.3,2) : .2+h*no(fract((p3.xxy+p3.yzz)*p3.zyx))*.7 )
           + fract(id.y*.5+id.x*.5) *step(96.,iT);
    p = vec3( fract(pz*2.)-.5 , length(p.xy)-ap , fract(a)-.5 );
//  p.yz *= ro( (is(0)+is(1))*3.*sm(.5,1.,-sin(gt*1.1+pz*.07)) + z*is(4)+(sin(p.z+gt))*is(3)*.1);
    p.yz *= ro( (is(0)+is(1))*3.*sm(.5,1.,-sin(gt*1.1+pz*.07)) + z*is(4));

    float b = length(max(abs(p)-vec3(.34,0,.43),0.))*.5-.01;
    tube = step(t,b);
    p += p;
    for (int i=0; ++i<9; m = i>0?min(m,min(abs(p.x),abs(p.y))):0 )
        p = abs(p)/dot(p,p)-.5 ;
  
    fcol = mix( fcol+m*(1.-tube), tbc*max(.5,sin(pz*1.5+gt*3.)) , tube);
    glow1 += max(0.,.5-b) *fcol *h;
    glow2 += max(0.,.5-t) *fcol;
    return min(b,t);
}
/*
vec4 text() {
	 vec2 U = gl_FragCoord.xy;
	 vec2 R = res.xy;
     vec4 O = vec4(0);
     U /= R.y;
     float ti = iT-68.,v ; int t = int(ti*.15) + 1; // skip +1

     ti = max(0.,ti);
     vec2 p = U * ( t==1 ? 10. : 17.), A,D;
     p.y -= t==1 ? 4.6 : 8.4;
     p.x -= t==2 ? 7.5 : t==3 ? 7.5 : t==4 ? 10.3 : 1.;

     vec4 c = O-O, C=c, S = vec4(.5,-.5,1,0), V;
     C.xy = normalize( .1 + abs( cos( 5.*(U.x+U.y)+ti*3.+vec2(0,11) )));
     p.x += max(0.,2.-ti);
     for (int l, k=15*t-15, i=0; i<15 && k<54; i++,k++) {
         p.y += sin(float(i)*2.+ti*1.5) * .2 * max(1.,100.-ti*40.);
         {
         int a = 831,  d = 524519, e = 463,   f = 271, g = 751,   h =819,   I = 3276, j = 65656,
             L = 195,  m = 24627  ,n = 49203, o = 255, q = 33023, r =33567, s = 1006, T = 3084,
             u = 243,  y = 25600, l0 = 3207, l1 = 265216, l2 = 2437, l7= 3076, l9 = 3462;
             l = int[] ( f,L,a,s,h,799,a, r,T,y,0 ,l2,l0,l2,l0, o,n,L,I,n,e,0 ,e,d,I,T,I,o,n, 0,j,u,L,y,0 ,l1,l7,0 ,a,n,d,0 ,l1,l9,0 , s,T,a,y,0 ,h,o,m,e)[k];}
         v = 1.;
         for( int i=0; i<20; i++, l/=2 )
             if (l%2 > 0)
                 V = vec4[](S.wwwx,S.wxwx,S.wzxw,S.xzxw,S.zxwx,S.zwwx,S.xwxw,S.wwxw,S.wxxw,S.xxxw,S.xwwx,S.xxwx,S.wwxx,S.xxxx,S.wzxy,S.xxxy,S.wxxy,S.xwxx,S.wxxx,S.xzxy)[i],
                 A = 1.3*p - V.xy, D = V.zw,
                 v = min(v,length(A-D*clamp(dot(A,D)/dot(D,D),.3,.8)));
         c += C * pow(1.-v,8.) *.6 + pow(1.-v,15.);
         p.x -= 1.1;
     }
     return O + c * min(1.,ti*.3);
}
*/


void main()
{
    vec2 uv = (gl_FragCoord.xy-res*.5)/res.y;

    gt=iT;
//    scene=int[](0,1,0,2,0,3,0,4,1,2)[int(step(25.5,iT)+step(35.,iT)+step(45.5,iT)+step(56.,iT)+step(66.,iT)+step(96.,iT)+step(116.,iT)+step(126.5,iT)+step(131.5,iT)+step(135.,iT))];
//    if (iT > 135.) scene = 4,


	float dp0=1.,dp1=.8,dp2=.9,dp=1.0;
    gt=iT;
    if (iT > 25.5) scene = 1, dp0 = 1.65, dp1 = -0.6, dp2 = 1.0;
	if (iT > 35.) scene = 0, dp0 = 1.0,dp1=0.8,dp2=0.9;
	if (iT > 45.5) scene = 2, dp0 = 1.1, dp1 = 8.0, dp2 = 0.8;
	if (iT > 56.) scene = 0, dp0 = 1.0,dp1=0.8,dp2=0.9;
	if (iT > 66.) scene = 3, dp0 = 0.7, dp1 = 1.1, dp2 = 0.7;
	if (iT > 96.) scene = 0, dp0 = 1.0,dp1=0.8,dp2=0.9;
	if (iT > 116.) scene = 4, dp0 = 0.4, dp1 = -1.0, dp2 = -0.4;
	if (iT > 126.5) scene = 1, dp0 = 1.65, dp1 = -0.6, dp2 = 1.0;
	if (iT > 131.5) scene = 2, dp0 = 1.1, dp1 = 8.0, dp2 = 0.8;
	if (iT > 135.) scene = 4, dp0 = 1.0, dp1 = 1.0, dp2 = 1.0, gt*=-2.;

    gt += sm(94.5,96.,gt) *2. -step(96.,gt);
   
    tubedist = sin(gt*.3+1.);
    ap = 1.5-tubedist*.5 + max(0.,10.-gt*2.);
   
    if (scene == 2) gt *= .7;
    if (scene == 3) ap = cos(gt)*.3+1.+sin(uv.y*2.)*.7, maxdist=7., gt*=.3, tubedist=1.;

    float tpath = gt*3.4,totdist = 0., d;

    vec3 from = path(tpath),
          adv = path(tpath+2.),
           fw = no(adv-from),
           rt = no(vec3(-fw.z,0,fw)),
          col = vec3(0), back=col, p,
          dir = mat3(rt,cross(rt,fw),fw) *no(vec3(uv,.7));

    from.y -= sm(1.,0.,tubedist) *is(0);
    if (scene == 1) from = vec3(0.,-2.4,tpath), uv *= ro(-1.), dir = no(vec3(uv,.4)).xzy;
    if (scene == 2) from.y += 1.5, ap = 1. , dir = no(vec3(uv,.35)).xzy, dir.yz *= ro(2.7);
    if (scene == 4) from.x +=  .8, ap = 1.5, tubedist = -1., dir.xz *= ro(gt);

    z=from.z;
  
    for ( int i=0; ++i<151; totdist += d) {
        p = from+totdist*dir;
        d = de(p) * (1.+ha(dir.xy)*.1);
        if ( d<det || totdist>maxdist ) break;   
    }
    if (d<.1) {
        p -= det*dir;
        vec3 c=fcol, d=vec3(0,.01,0), n=no(vec3(de(p-d.yxx),de(p-d.xyx), de(p-d.xxy))-de(p));
        p.xy -= path(p.z).xy;
        c += tbc * sm(tubedist*10.+3., tubedist*10.+5., p.z-z)
                 *.7 *max(0.,dot(no(p.xy),n.xy)) *(1.-tube);
        col = c * ( max(tube,max(0.,dot(dir,n))) + .3 )
              + pow(max(0.,reflect(dir,n).z),10.+tube*5.)
                * (.6-.2*is(3));
    } else {
        totdist = maxdist;
        p = abs(fract(p*.02+.1)-.5);
        for (int i=0;++i<8;) p = abs(p)/dot(p,p)-.8;
        back += dot(p,p)*.001;
    }
//    col = col*(1.-sqrt(totdist/maxdist)) + glow1*.03 +glow2*.05 +back;
//    col*= clamp(137.-iT,0.,1.);

    dp=totdist/maxdist;
    col=col*(1.-sqrt(dp))+glow1*.03+glow2*.05+back;
    col*=clamp(137.-iT,0.,1.);
    o = vec4(col,dp0-(dp2-dp*dp1));
    //o = vec4(col,1);
}