/* 학과 데이터의 기본 틀과 첫 18개 학과입니다.
   나머지 학과는 d-*.js 파일에 계열별로 나뉘어 있고, 모두 같은 형식(D, A)으로 DEPTS에 추가돼요.
   새 학과를 넣으려면 d-*.js 중 알맞은 파일에 D(...) 덩어리를 같은 형식으로 붙여 넣으세요. */
/* 주제는 [주제, 교과, 참고 논문(선택)] 형식이에요. 참고 논문은 [[제목, 주소], …] 로 적어요. */
const A=(name,k,s,d)=>({name,k:k.split(","),T:[{lv:"발전",t:s[0],sub:s[1],ref:s[2]||[]},{lv:"심화",t:d[0],sub:d[1],ref:d[2]||[]}]});
/* ---- 영역별 주제 4개 (t-*.js 파일에서 TOP(...)으로 채워요) ----
   순서: 발전 2개 → 심화 1개 → 도전 1개. (기초 단계 주제는 뺐어요)  각 주제는 [주제, 교과, 참고 논문(선택)]
   참고 논문은 R("제목","NODE번호") 로 적어요. 주소는 DBpia 논문 페이지로 만들어져요. */
const LVS=["발전","발전","심화","도전"];
const R=(t,n)=>[t,"https://www.dbpia.co.kr/journal/articleDetail?nodeId="+n];
const RD=(t,n)=>[t,"https://www.dbpia.co.kr/journal/detail?nodeId="+n];
/* ---- 키워드 기반 주제 (k-*.js 파일에서 K(...)로 채워요) ----
   주제 한 개 = [DBpia 핵심 키워드, 주제, 연계 교과, 탐구 방법]
   순서: 발전 2개 → 심화 1개 → 도전 1개. 키워드를 누르면 DBpia에서 그 키워드로 검색해요. */
const DBS=k=>"https://www.dbpia.co.kr/search/topSearch?searchOption=all&query="+encodeURIComponent(k);
const K=(name,areas)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("K: 학과 없음 "+name);
  if(areas.length!==d.areas.length) throw new Error("K: 영역 수 "+name);
  areas.forEach((arr,i)=>{
    if(arr.length!==LVS.length) throw new Error("K: 주제 수 "+name+" "+i);
    d.areas[i].T=arr.map((x,j)=>({lv:LVS[j],kw:x[0],t:x[1],sub:x[2],ref:[],how:x[3],next:x[4]}));
  });
  d.kdone=true;
};
/* ---- 핵심 주제 지도 (c-*.js 파일에서 C(...)로 채워요) ----
   C(학과, "요즘 주목 주제1,주제2,…", [["교과목","핵심 주제1,주제2,…"], …], 출처)
   출처: "SK" = 성균관대 학과별 교육과정 로드맵, ["제목","주소"] = 학과 홈페이지, 0 = 여러 대학의 일반적인 교육과정 구성 */
const CSRC={SK:["성균관대 2024 학과별 교육과정 로드맵 (PDF)","https://www.skku.edu/_res/skku/etc/y241028_1.pdf"]};
const C=(name,hot,courses,src)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("C: 학과 없음 "+name);
  const sp=s=>s.split(",").map(x=>x.trim()).filter(Boolean);
  d.core={hot:sp(hot),courses:courses.map(c=>({c:c[0],k:sp(c[1])})),src:typeof src==="string"?CSRC[src]:(src||null)};
};
/* ---- 전공 수업별 탐구 주제 (c-*.js 파일에서 CS(...)로 채워요) ----
   CS(학과, [ [과목명, [ [주제, 탐구 방법, 이어가기], … ], 의외의과목이면 true], … ]) */
const CS=(name,courses)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("CS: 학과 없음 "+name);
  d.cs=(d.cs||[]).concat(courses.map(c=>({c:c[0],T:c[1].map(t=>({t:t[0],how:t[1],next:t[2]})),x:!!c[2]})));
};
/* ---- DBPIA 논문 속 생기부 주제 (b-*.js 파일에서 DB(...)로 채워요) ----
   DB(학과, [ [검색어(학과 이름·전공 수업·주목받는 주제), "학과"|"수업"|"주목", [ {id,title,journal,ym,use,kw,t,how,next}, … ]], … ]) */
const DB=(name,items)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("DB: 학과 없음 "+name);
  d.db=(d.db||[]).concat(items.map(i=>({label:i[0],type:i[1],T:i[2]})));
};
/* ---- 전공 관련 주목받는 주제 (x-*.js 파일에서 HX(...)로 채워요) ----
   HX(학과, [ [주목받는 주제(키워드), 한 줄 설명, [ [주제, 탐구 방법, 이어가기], … ]], … ]) */
const HX=(name,items)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("HX: 학과 없음 "+name);
  d.hx=(d.hx||[]).concat(items.map(i=>({k:i[0],why:i[1],T:i[2].map(t=>({t:t[0],how:t[1],next:t[2]}))})));
};
/* ---- 교과목 키워드별 탐구 주제 (ck-*.js 파일에서 KT(...)로 채워요) ----
   KT(학과, `키워드|주제1|주제2…` 한 줄에 키워드 하나) */
const KT=(name,txt)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("KT: 학과 없음 "+name);
  d.kt=d.kt||{};
  txt.split("\n").map(l=>l.trim()).filter(Boolean).forEach(l=>{const a=l.split("|").map(x=>x.trim()).filter(Boolean);d.kt[a[0]]=(d.kt[a[0]]||[]).concat(a.slice(1));});
};
const TOP=(name,areas)=>{
  const d=DEPTS.find(x=>x.name===name);
  if(!d) throw new Error("학과를 찾을 수 없어요: "+name);
  areas.forEach((arr,i)=>{ d.areas[i].T=arr.map((t,j)=>({lv:LVS[j],t:t[0],sub:t[1],ref:t[2]||[]})); });
};
const D=(name,alias,track,subs,areas)=>({name,alias:alias.split(","),track,s:subs.split(","),areas});

const DEPTS=[
D("컴퓨터공학·소프트웨어학과","컴퓨터공학과,컴퓨터,컴공,소프트웨어,SW,인공지능,AI,정보통신,전산,소프트웨어학과,소프트웨어공학,컴퓨터과학,지능형소프트웨어","공학","정보,수학,물리학=물리,확률과 통계=확률/통계,미적분",[]),
D("전기전자·반도체공학과","전기전자공학부,전기,전자,반도체,회로,전자공학,전기공학,제어,반도체공학과,반도체공학,반도체융합,시스템반도체,지능형반도체","공학","물리학=물리,수학,화학,정보,미적분",[]),
D("기계공학과","기계,자동차,항공,로봇,메카트로닉스","공학","물리학=물리,수학,정보,미적분,기술·가정=기술/가정",[]),
D("화학공학·배터리공학과","화학공학과,화학,화공,신소재,고분자,에너지,이차전지·배터리공학과,배터리,이차전지,배터리공학,전지,2차전지","공학","화학,물리학=물리,수학,생명과학,지구과학,화학=화학,정보",[]),
D("건축학·건축공학과","건축학과,건축,건축공학,도시,실내,설계,건축공학과,건축시공,건축구조,건축설비","공학","물리학=물리,수학,미술,기술·가정=기술/가정,통합사회=사회,화학",[]),
D("생명과학·생화학과","생명과학과·생명공학과,생명,생물,바이오,유전,분자,생명공학,생화학과,생화학,분자생물,분자생명,화학생물,글로벌바이오·비즈니스융합학부,글로벌바이오,바이오비즈니스,바이오경영,바이오융합,송도","자연","생명과학,화학,통계=통계/확률,정보,수학,화학=화학,물리학=물리,경제,영어",[]),
D("의예과·의학과","의대,의학,의사,의과대학,임상","의약학","생명과학,화학,확률과 통계=확률/통계,윤리=윤리,보건",[]),
D("간호학과","간호,보건,돌봄,응급","의약학","생명과학,보건,윤리=윤리,확률과 통계=확률/통계,국어",[]),
D("약학과","약학,약사,제약,신약,의약품","의약학","화학,생명과학,수학,확률과 통계=확률/통계,보건",[]),
D("통계학과·수학과","통계,수학,수리,데이터사이언스,응용수학","자연","수학,확률과 통계=확률/통계,미적분,기하,정보",[]),
D("경영·회계·경영정보학과","경영학과,경영,회계,마케팅,창업,무역,경영정보학과,경영정보,MIS,정보시스템,IT경영,디지털경영,세무·회계학과,세무,세무학,회계학,세금","사회","경제,수학,통계=통계/확률,사회문화=사회문화,통합사회=통합사회,정보,통합사회=사회,정치와 법=정치/법",[]),
D("경제학과","경제,금융,무역,재정,통계","사회","경제,수학,확률과 통계=확률/통계,통합사회=통합사회,사회문화=사회문화",[]),
D("법학과","법,법률,변호사,로스쿨,검사,판사","사회","정치와 법=정치와 법/정치,윤리=윤리,국어,사회문화=사회문화,통합사회=통합사회",[]),
D("심리학과","심리,상담,인지,발달,정신건강","사회","심리학=심리,통계=통계/확률,생명과학,사회문화=사회문화,국어",[]),
D("교육학과","교육,교사,교대,사범대,교육학,교원","교육","교육학=교육학,국어,통계=통계/확률,사회문화=사회문화,윤리=윤리",[]),
D("정치외교학과","정치,외교,국제,행정,국제관계","사회","정치와 법=정치/법,세계시민=세계시민/국제,사회문화=사회문화,경제,윤리=윤리",[]),
D("미디어커뮤니케이션·디지털콘텐츠학과","미디어커뮤니케이션학과,신문방송,미디어,언론,방송,커뮤니케이션,광고,홍보,저널리즘,디지털콘텐츠학부,디지털콘텐츠,콘텐츠,문화기술,CT,Culture Technology,콘텐츠융합,K콘텐츠","사회","국어,사회문화=사회문화,정보,미술,통계=통계/확률,음악",[]),
D("환경공학·기후변화학과","환경공학과,환경,기후,에너지,지구환경,대기,수질,기후변화융합학부,기후변화,기후정책,기후융합,탄소,지속가능","공학","지구과학=지구과학,화학,물리학=물리,생명과학,통합사회=통합사회,지구과학,통합사회=사회,정치와 법=정치/법,경제,외국어=외국어/영어",[])
];

/* ---- 교과서 속 생기부 주제 (tb-*.js 파일에서 TB(...)로 채워요) ----
   TB({book:"과목(출판사)", unit:"단원", page:"쪽", act:"읽기자료·탐구활동 이름", t:"생기부 주제", how:"탐구 방법", next:"이어가기(후속 탐구)", depts:["학과명", …]})
   교과서 본문은 옮기지 않고, 어느 교과서 어느 활동에서 출발했는지만 적어요. */
const TBOOK=[];
const TB=o=>{
  if(!o||!o.t||!o.book) throw new Error("TB: 주제·교과서 정보가 필요해요");
  (o.depts||[]).forEach(n=>{if(!DEPTS.find(x=>x.name===n)) throw new Error("TB: 학과 없음 "+n);});
  TBOOK.push(o);
};
/* ---- DBpia 이용순 논문에서 출발한 주제 (p-*.js 파일에서 POP(...)로 채워요) ---- */
const POP=(name,arr)=>{const d=DEPTS.find(x=>x.name===name);if(!d) throw new Error("POP: 학과 없음 "+name);d.pop=(d.pop||[]).concat(arr);};
/* ---- '요즘 주목받는 주제' 키워드별 추천 주제 (h-*.js 파일에서 HT(...)로 채워요) ---- */
const HT=(name,txt)=>{const d=DEPTS.find(x=>x.name===name);if(!d) throw new Error("HT: 학과 없음 "+name);
  d.ht=d.ht||{};txt.split("\n").map(l=>l.trim()).filter(Boolean).forEach(l=>{const a=l.split("|").map(x=>x.trim()).filter(Boolean);d.ht[a[0]]=(d.ht[a[0]]||[]).concat(a.slice(1));});};
/* ---- 기초 학문 탐구 (f-*.js 파일에서 FD/FM으로 채워요) ---- */
const FOUND={};
const FD=(name,txt)=>{FOUND[name]=(FOUND[name]||[]).concat(txt.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const a=l.split("|").map(x=>x.trim());return {t:a[0],how:a[1],next:a[2]};}));};
const FM=(name,arr)=>{const d=DEPTS.find(x=>x.name===name);if(!d) throw new Error("FM: 학과 없음 "+name);d.fd=arr;};
