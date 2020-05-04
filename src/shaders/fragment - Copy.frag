#version 130
uniform int m;
out vec4 o;
float iTime = m/float(44100)+68.;

int scene;


#define ha(n) fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)
#define box(p,c) length(max(vec3(0.),abs(p)-c))
#define ro(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define no(v) normalize(v)

vec2 iResolution=vec2(1280,720);
float det=.001,gt,maxdist=11.,pi=3.1459,z=0.,tube=0.,aperture=0.,tubedist=0.;
vec3 glow1=vec3(0),glow2=vec3(0),fcol,tubecolor=vec3(1.3,.3,0),medcolor = vec3(0,.3,2.);

float is(float s) 
{
	return step(float(abs(s-scene)),.1);
}

vec3 rnd23(vec2 p)
{
	vec3 p3 = fract(p.xyx * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}


vec3 path(float t) {
	vec3 p=vec3(sin(t*.5)*1.5,cos(t*.3)*1.5,t);
	float s=step(95.,iTime);
    p.x+=sin(t*.25)*3.*is(0)*s;
    p.xy*=s+is(0)<1.5?sin(t*.1):1.;
    p.xy*=1.-is(3);
    return p;
}

float tubes(vec3 p) {
    p.x+=sin(p.z)*.5*(1.-is(4));
    p.xy*=ro(p.z*1.5-gt*3.5);
    p.xy=abs(p.xy)-.1+(.2*is(4));
    p.xy-=.3-abs(p.z-z)*.05;
    float d=(length(p.xy)-.1+abs(.5-fract(p.z*10.))*.01)*.8+.05*is(4);
    return max(d,-abs(p.z-z)+tubedist*10.+5.);
}


float de(vec3 p) {
    p.xy-=path(p.z).xy;
    float pz=p.z,t=tubes(p),m=100.;
    p.xy*=ro((1.-is(3))*gt*(1.+sin(floor(p.z))));
    p.xy*=ro(is(3)*-gt+floor(p.z));
    float a=atan(p.y,p.x)/pi*8.;
    vec2 id=vec2(floor(a),floor(p.z*2.+floor(gt*(1.+is(3)*2.)*5.)));
    float h=step(.85,ha(id*.156));
    fcol=mix(.2+h*no(rnd23(id))*.7,max(.2,sin(id.y+id.x))*medcolor,is(3));
    fcol+=fract(id.y*.5+id.x*.5)*step(96.,iTime);
    p=vec3(fract(p.z*2.)-.5, length(p.xy)-aperture, fract(a)-.5);
    //p.yz*=ro((is(0)+is(1))*pi*smoothstep(.5,1.,-sin(gt*1.1+pz*.05)));
	p.yz*=ro((is(0)+is(1))*pi*smoothstep(.5,1.01,1.01));
    p.yz*=ro(z*is(4));
    float b=box(p,vec3(.34,0,.43))*.5-.01;
    tube=step(t,b);
    p*=2.;
    for (int i=0; i<8; i++) { 
        p=abs(p)/dot(p,p)-.5;
        if (i>1) m=min(m,min(abs(p.x),abs(p.y)));
    }
    fcol+=m*(1.-tube);
    fcol=mix(fcol,tubecolor*max(0.5,sin(pz*1.5+gt*3.)),tube);
    glow1+=max(0.,(.5-b))*h*fcol;
    glow2+=max(0.,(.5-t))*fcol;
    return min(b,t);
}

//texto

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

vec3 frases(vec2 uv, int t) {
	uint la=831u,ld=524519u,le=463u,lf=271u,lg=751u,lh=819u,li=3276u,lj=65656u,ll=195u,lm=24627u,ln=49203u,lo=255u,lp= 799u,lr=33567u,ls=1006u,lt=3084u,lu=243u,ly=25600u,l0=3207u,l1=265216u,l2=2437u,l7=3076u,l9=3462u;
	uint frase1[]=uint[](lf,ll,la,ls,lh,lp,la,lr,lt,ly,0u,l2,l0,l2,l0,999u);
	uint frase2[]=uint[](lo,ln,ll,li,ln,le,0u,le,ld,li,lt,li,lo,ln,999u);
	uint frase3[]=uint[](lj,lu,ll,ly,0u,l1,l7,0u,la,ln,ld,0u,l1,l9,999u);
	uint frase4[]=uint[](ls,lt,la,ly,0u,lh,lo,lm,le,999u);

	float ti=max(0.,iTime-68.),cc=0.,s1=t==1?1.:0.,s2=t==2?1.:0.,s3=t==3?1.:0.,s4=t==4?1.:0.;
    uint let;
    vec2 p=uv*(1.7-.7*s1);
	p.y-=.84-s1*.38;
    p.x-=.1+s2*.65+s3*.65+s4*.93;
    p*=10.;
    vec3 c=vec3(0.),ic=vec3(1.,0.,0.);
    ic.xy*=ro(5.*(uv.x+uv.y)+ti*3.);
    p.x+=max(0.,2.-ti);
    for (int i=0; i<50; i++) {
        p.y+=sin(float(i)*2.+ti*1.5)*.2*max(1.,100.-ti*40.);
        if (t==1) let = frase1[i];
        if (t==2) let = frase2[i];
        if (t==3) let = frase3[i];
        if (t==4) let = frase4[i];
        if (let == 999u) break;
        c+=no(.1+abs(ic))*pow(max(0., 1.-letra(p, let)),8.)*.6+pow(max(0., 1.-letra(p, let)),15.);
        p.x-=1.1;
    }
	return c;
//    return c*min(1.,ti*.3);
}

void main()
{
    vec2 uv=(gl_FragCoord.xy-iResolution*.5)/iResolution.y;
    gt=iTime;
    if (iTime > 25.5) scene = 1;
	if (iTime > 35.) scene = 0;
	if (iTime > 45.5) scene = 2;
	if (iTime > 56.) scene = 0;
	if (iTime > 66.) scene = 3;
	if (iTime > 96.) scene = 0;
	if (iTime > 116.) scene = 4;
	if (iTime > 126.5) scene = 1;
	if (iTime > 131.5) scene = 2;
	if (iTime > 135.) scene = 4, gt*=-2.;

    gt+=smoothstep(94.5,96.,gt)*2.-step(96.,gt);
    
    tubedist=sin(gt*.3+1.);
    aperture=1.5-tubedist*.5+max(0.,10.-gt*2.);
    
    if (scene == 2) gt*=.7;
    if (scene == 3) aperture=1.+sin(uv.y*2.)*.7, maxdist=7., gt*=.3, tubedist=1.;

    float tpath=gt*3.4,totdist=0., d;

    vec3  dir=no(vec3(uv,.7)),from=path(tpath),adv=path(tpath+2.),fw=no(adv-from),rt=no(cross(fw,vec3(0,1,0))),p, col=vec3(0.), back=col;
    dir=mat3(rt,cross(rt,fw),fw)*dir;

    from.y-=(1.-smoothstep(0.,1.,tubedist))*is(0);
    if (scene == 1) from=vec3(0.,-2.4,tpath), uv*=ro(-1.), dir=no(vec3(uv,.4)).xzy;
    if (scene == 2) from.y+=1.5, aperture=1., dir=no(vec3(uv,.35)).xzy, dir.yz*=ro(2.7);
    if (scene==4) aperture=1.5, tubedist=-1., dir.xz*=ro(gt), from.x+=.8;

    z=from.z;
   
    for (int i=0; i<150; i++) {
    	p=from+totdist*dir;
        d=de(p)*(1.+ha(dir.xy)*.1);
        if (d<det||totdist>maxdist) break;
    	totdist+=d;        
    }
    if (d<.1) {
    	p-=det*dir;
        vec3 c=fcol,d=vec3(0,.01,0),n=no(vec3(de(p-d.yxx),de(p-d.xyx), de(p-d.xxy))-de(p));
		p.xy-=path(p.z).xy;
    	c+=tubecolor*smoothstep(tubedist*10.+3.,tubedist*10.+5.,p.z-z)*.7*max(0.,dot(no(p.xy),n.xy))*(1.-tube);
    	col=c*(max(tube,max(0.,dot(dir,n)))+.2)+pow(max(0.,dot(vec3(0,0,1),reflect(dir,n))),10.+tube*5.)*(.6-.2*is(3));
    } else {
        totdist=maxdist;
        p=abs(fract(p*.02+.1)-.5);
        for (int i=0;i<7;i++) p=abs(p)/dot(p,p)-.8;
        back+=length(p)*abs(p)*.0025;
    }
    col=col*(1.-sqrt(totdist/maxdist))+glow1*.03+glow2*.05+back;
    col*=clamp(137.-iTime,0.,1.);

	col+=frases(gl_FragCoord.xy/iResolution*vec2(1.78,1.),int((iTime-68)*.15)+1);
	
    o = vec4(col,1.);
}