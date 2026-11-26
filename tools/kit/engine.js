/* Mind Up Tools engine v2 (26 Nov 2026).
   Every tool = mini sales diagnosis, mapped to the CRM:
     1) شركتك  (fixed): size → segment/ICP, sector, role → decision role
     2) الحسبة (tool-specific questions from window.TOOL.questions)
     3) أهدافك (fixed): 90-day goal (Need), monthly growth budget (Budget), start (Timing), wanted next step, pain in own words
     4) بياناتك (fixed gate): name, WhatsApp, company, email (optional), contact time
   Lead Score /100 = Fit 40 + Authority 15 + Budget 20 + Timing 15 + Pain 10 (tool gives pain 0-10).
   Bands (Drive «شرح النظام»): 0-30 Lead magnet · 31-60 Workshop · 61-80 Business Direction · 81-100 Appointment.
   Posts to the live diagnosis /exec doPost → Diagnosis Inbox (column G = «🧮 أداة: <name>»). */
(function(){
  var ENDPOINT="https://script.google.com/macros/s/AKfycbypkmlijmb-NVYGN4fnwCGe4raME5Iu_gc4U8HcJE__iBk7ZvV_xZ0nd6Ke9_JVPDZ4/exec";
  var WA="249119744949";
  var T=window.TOOL, A={}, i=-1, card=document.getElementById("card"), bar=document.getElementById("bar");

  /* ---------- fixed CRM blocks (same in every tool; edit here once) ---------- */
  var SIZE=[ // → segment + Fit points
    {v:"s1",l:"أقل من 10,000$ في الشهر",d:"بزنس صغير",seg:"small",ar:"بزنس صغير",fit:5},
    {v:"m1",l:"10,000$ – 50,000$ في الشهر",d:"شركة متوسطة",seg:"medium",ar:"بزنس متوسط",fit:28},
    {v:"m2",l:"50,000$ – 100,000$ في الشهر",d:"شركة متوسطة كبيرة",seg:"medium",ar:"بزنس متوسط",fit:36},
    {v:"a1",l:"أكتر من 100,000$ في الشهر",d:"شركة كبيرة",seg:"classA",ar:"شركة كبيرة (Class A)",fit:40},
    {v:"a2",l:"مجموعة أو شركة رائدة في قطاعها",d:"أكتر من 200 موظف",seg:"classA",ar:"شركة كبيرة (Class A)",fit:40}
  ];
  var ROLE=[ // → Contacts «دوره في القرار» + Authority points
    {v:"owner",l:"المالك أو المؤسس",dr:"Decision maker",au:15},
    {v:"ceo",l:"المدير العام أو التنفيذي",dr:"Decision maker",au:15},
    {v:"mkt",l:"مدير التسويق أو البراند",dr:"Influencer",au:10},
    {v:"sales",l:"مدير المبيعات أو التوزيع",dr:"Influencer",au:10},
    {v:"staff",l:"موظف وبجمع معلومات",dr:"Gatekeeper",au:3}
  ];
  var BUDGET=[{v:"0",l:"ما في ميزانية حالياً",p:0},{v:"1",l:"أقل من 500$",p:5},{v:"2",l:"500$ – 2,000$",p:12},{v:"3",l:"2,000$ – 5,000$",p:17},{v:"4",l:"أكتر من 5,000$",p:20}];
  var START=[{v:"now",l:"فوراً، الأسبوع ده",p:15,u:10},{v:"month",l:"خلال الشهر ده",p:11,u:7},{v:"q",l:"خلال 3 شهور",p:6,u:4},{v:"explore",l:"لسه بستكشف",p:1,u:2}];
  var NEXT=[{v:"report",l:"النتيجة بس، وأقرر براي"},{v:"session",l:"جلسة 20 دقيقة نراجع النتيجة سوا"},{v:"proposal",l:"عرض مبدئي لشركتنا"}];
  var NEXT_AR={report:"النتيجة فقط",session:"جلسة مراجعة 20 دقيقة",proposal:"عرض مبدئي"};
  var SEC="شركتك", SEC2=T.section||"الحسبة", SEC3="أهدافك", SEC4="بياناتك";

  var HEAD=[
    {id:"size",sec:SEC,t:"حجم مبيعات شركتكم في الشهر تقريباً؟",d:"عشان نقارن نتيجتك بشركات في نفس حجمك. الرقم ما بيظهر لأي زول.",type:"single",req:true,opts:SIZE},
    {id:"sector",sec:SEC,t:"شركتكم في ياتو قطاع؟",type:"single",req:true,opts:["أغذية ومنتجات استهلاكية (FMCG)","تجارة وتوزيع","طاقة وطاقة شمسية","بنوك ومدفوعات وخدمات مالية","اتصالات وتقنية","تعليم","صحة وأدوية","صناعة وتصنيع","عقارات ومقاولات","مجال تاني"]},
    {id:"role",sec:SEC,t:"دورك في الشركة؟",type:"single",req:true,opts:ROLE}
  ];
  var TAIL=[
    {id:"goal",sec:SEC3,t:"أهم هدف عندكم في الـ90 يوم الجاية؟",type:"single",req:true,opts:["نزيد المبيعات بشكل واضح","نجيب عملاء جدد أكتر","نحوّل الاستفسارات لمبيعات أكتر","نرجّع العملاء القدام ونزيد تكرار الشراء","نبني فريق ونظام مبيعات ما معتمد على شخص واحد","ندخل سوق أو منتج جديد"]},
    {id:"budget",sec:SEC3,t:"الميزانية الشهرية المتاحة للنمو (تسويق ومبيعات)؟",type:"single",req:true,opts:BUDGET},
    {id:"start",sec:SEC3,t:"لو لقيتوا الحل المناسب، متين بتبدوا؟",type:"single",req:true,opts:START},
    {id:"next",sec:SEC3,t:"عايز شنو بعد النتيجة؟",type:"single",req:true,opts:NEXT},
    {id:"pain_text",sec:SEC3,t:"أكبر حاجة مضايقاك في المبيعات أو النمو هسي؟ (اختياري)",d:"بكلماتك، سطر واحد بيكفي.",type:"long",ph:"مثلاً: الاستفسارات كتيرة لكن البيع قليل"}
  ];
  var GATE=[
    {id:"_gate",type:"gatehead"},
    {id:"name",sec:SEC4,t:"اسمك الكريم؟",type:"short",req:true,ph:"مثلاً: أحمد عثمان"},
    {id:"whatsapp",sec:SEC4,t:"رقم الواتساب",type:"short",req:true,ph:"مثلاً: 0912345678",inputmode:"tel"},
    {id:"business",sec:SEC4,t:"اسم الشركة",type:"short",req:true,ph:"مثلاً: شركة النيل للتجارة"},
    {id:"email",sec:SEC4,t:"إيميل العمل (اختياري)",type:"short",ph:"name@company.com",inputmode:"email"},
    {id:"time",sec:SEC4,t:"أنسب وقت نتواصل معاك؟",type:"single",req:true,opts:["الصباح (9 – 12)","الظهر (12 – 4)","المساء (4 – 9)"]}
  ];
  T.questions.forEach(function(q){q.sec=q.sec||SEC2;});
  var Q=HEAD.concat(T.questions,TAIL,GATE);

  /* ---------- helpers ---------- */
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}
  function lbl(o){return typeof o==="string"?o:o.l;} function val(o){return typeof o==="string"?o:o.v;}
  function pick(list,v){for(var k=0;k<list.length;k++)if(list[k].v===v)return list[k];return {};}
  window.MU={esc:esc,wa:function(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t);},
    money:function(n){if(!isFinite(n))return "–";var r=Math.abs(n)>=100?Math.round(n):Math.round(n*10)/10;return "$"+r.toLocaleString("en-US");},
    pct:function(n){return isFinite(n)?(Math.round(n*1000)/10)+"%":"–";}};
  function visible(q){return !q.when||q.when(A);}
  function go(d){do{i+=d;}while(Q[i]&&!visible(Q[i]));render();}
  function setBar(){var p=i<0?0:Math.min(100,Math.round(i/Q.length*100));if(bar)bar.style.width=p+"%";}
  function intro(){
    var h='<div class="intro" style="display:flex;flex-direction:column;gap:14px">'+T.intro+'</div>';
    h+='<div class="nav"><span class="hint">'+esc(T.duration||"دقيقتين تقريباً")+'</span><button class="btn primary" id="start">يلا نبدأ</button></div>';
    card.innerHTML=h;document.getElementById("start").onclick=function(){go(1)};
  }
  function render(){
    setBar(); if(i<0) return intro(); var q=Q[i]; if(!q) return submit();
    var vis=Q.filter(function(x){return visible(x)&&x.type!=="gatehead";}), cnt=vis.indexOf(q)+1, h;
    if(q.type==="gatehead"){
      h='<div class="qnum">خطوة أخيرة</div><h2 class="q">نتيجتك جاهزة ✅</h2><p>أكتب بياناتك عشان تظهر ليك النتيجة كاملة مع التوصية، ونحفظها ليك لو حبيت نراجعها معاك.</p>';
      h+='<div class="nav"><button class="btn ghost" id="back">رجوع</button><button class="btn primary" id="next">التالي</button></div>';
      card.innerHTML=h; bind(q); return;
    }
    h='<div class="qnum">'+esc(q.sec||"")+' · '+cnt+' من '+vis.length+'</div><h2 class="q">'+esc(q.t)+(q.req?' <span class="req">*</span>':'')+'</h2>';
    if(q.d) h+='<p class="hint">'+esc(q.d)+'</p>';
    if(q.type==="single"||q.type==="yesno"){
      var opts=q.type==="yesno"?[{v:"نعم",l:"نعم"},{v:"لا",l:"لا"}]:q.opts;
      h+='<div class="opts'+(q.type==="yesno"?' yn':'')+'">'+opts.map(function(o){var v=val(o);return '<button class="opt" data-v="'+esc(v)+'" aria-pressed="'+(A[q.id]===v)+'">'+esc(lbl(o))+(o.d?'<small>'+esc(o.d)+'</small>':'')+'</button>';}).join("")+'</div>';
    } else if(q.type==="long"){
      h+='<textarea id="in" placeholder="'+esc(q.ph||"")+'">'+esc(A[q.id]||"")+'</textarea>';
    } else {
      h+='<input id="in" '+(q.type==="number"?'inputmode="decimal" dir="ltr"':'')+(q.inputmode?' inputmode="'+q.inputmode+'"':'')+' placeholder="'+esc(q.ph||"")+'" value="'+esc(A[q.id]||"")+'">';
    }
    var last=!Q.slice(i+1).some(visible);
    h+='<div class="err" id="err"></div><div class="nav"><button class="btn ghost" id="back">رجوع</button><button class="btn primary" id="next">'+(last?'أعرض النتيجة':'التالي')+'</button></div>';
    card.innerHTML=h; bind(q);
  }
  function num(s){s=String(s||"").replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[,،\s$]/g,"");return s===""?NaN:Number(s);}
  function bind(q){
    var inp=document.getElementById("in"), err=document.getElementById("err");
    document.getElementById("back").onclick=function(){go(-1)};
    card.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){A[q.id]=b.getAttribute("data-v");render();setTimeout(function(){go(1)},160);};});
    if(inp){inp.focus();if(inp.tagName==="INPUT")inp.onkeydown=function(e){if(e.key==="Enter")document.getElementById("next").click();};}
    document.getElementById("next").onclick=function(){
      if(inp){var v=inp.value.trim();
        if(q.type==="number"){var n=num(v);if(v===""&&!q.req){A[q.id]="";return go(1);}if(!isFinite(n)||n<0){err.textContent="أكتب رقم بس (مثلاً 120)";return;}if(q.min!=null&&n<q.min){err.textContent=q.minMsg||"الرقم صغير شديد";return;}A[q.id]=n;}
        else{if(q.req&&!v){err.textContent="محتاجين الخانة دي";return;}
          if(q.id==="whatsapp"&&v.replace(/\D/g,"").length<9){err.textContent="الرقم ناقص، راجعه";return;}
          if(q.id==="email"&&v&&!/^\S+@\S+\.\S+$/.test(v)){err.textContent="الإيميل ما مكتوب صاح";return;}
          A[q.id]=v;}
        if(q.check){var m=q.check(A);if(m){err.textContent=m;return;}}
      } else if(q.type!=="gatehead"&&q.req&&!A[q.id]){if(err)err.textContent="اختار واحدة";return;}
      go(1);
    };
  }
  /* ---------- CRM scoring ---------- */
  function lead(R){
    var sz=pick(SIZE,A.size), rl=pick(ROLE,A.role), bd=pick(BUDGET,A.budget), st=pick(START,A.start);
    var pain=Math.max(0,Math.min(10,R.pain||0));
    var s=(sz.fit||0)+(rl.au||0)+(bd.p||0)+(st.p||0)+pain;
    var band=s<=30?"Lead magnet – رعاية":s<=60?"Workshop – ورشة":s<=80?"Business Direction – مكالمة أحمد":"Appointment – جلسة مع المؤسس";
    var tier=s>=81?"Hot":s>=61?"Warm":s>=31?"Nurture":"Cold";
    return {score:s,band:band,tier:tier,seg:sz.seg||"",seg_ar:sz.ar||"",size_l:sz.l||"",decision:rl.dr||"",role_l:rl.l||"",
      budget_l:bd.l||"",start_l:st.l||"",urgency:st.u||"",breakdown:{fit:sz.fit||0,authority:rl.au||0,budget:bd.p||0,timing:st.p||0,pain:pain}};
  }
  function submit(){
    if(bar)bar.style.width="100%";
    var R=T.compute(A), L=lead(R); R.lead=L;
    var test=/[?&]test=1/.test(location.search);
    var payload={
      name:(test?"اختبار – ":"")+A.name, whatsapp:A.whatsapp, email:A.email||"", business:A.business,
      source:"🧮 أداة: "+T.name, segment_ar:L.seg_ar, segment:L.seg, sector:A.sector, role:L.role_l, stage:L.size_l,
      constraint:R.constraint, score:L.score, tier:L.tier, urgency:L.urgency, start:L.start_l, invest:L.budget_l,
      next:NEXT_AR[A.next]||A.next, time:A.time, pain_text:A.pain_text||"",
      tool:T.id, tool_name:T.name, decision_role:L.decision, goal:A.goal, lead_band:L.band, score_breakdown:L.breakdown,
      tool_score:R.score, tool_summary:R.summary, tool_results:R.store||{}, tool_answers:T.questions.reduce(function(o,q){o[q.id]=A[q.id];return o;},{}),
      tags:(R.tags||[]).join(", "), page:"tool-"+T.id+"-v2", submitted_at:new Date().toISOString()
    };
    card.innerHTML='<h2 class="q">ثواني، بنحسب النتيجة...</h2>';
    var show=function(){card.innerHTML=T.result(A,R)+nextStep(L);window.scrollTo({top:0,behavior:"smooth"});};
    fetch(ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}).then(show,show);
  }
  function nextStep(L){ // one next step, chosen by what they asked + who they are. No promises, no prices.
    var M=window.MU, name=A.name, biz=A.business, big=(L.seg==="medium"||L.seg==="classA");
    var msg, label;
    if(A.next==="proposal"&&big){label="أطلب عرض مبدئي لشركتكم";msg="السلام عليكم، أنا "+name+" ("+L.role_l+") من "+biz+". عملت أداة «"+T.name+"» وعايزين عرض مبدئي من Mind Up.";}
    else if(A.next==="session"||big){label="أحجز جلسة 20 دقيقة نراجع النتيجة";msg="السلام عليكم، أنا "+name+" من "+biz+". عملت أداة «"+T.name+"» وعايز جلسة 20 دقيقة نراجع النتيجة.";}
    else {label="عايز الخطوة الجاية المناسبة لي";msg="السلام عليكم، أنا "+name+" من "+biz+". عملت أداة «"+T.name+"». شنو الخطوة المناسبة لي؟";}
    var h='<div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">';
    h+='<a class="cta" href="../../" target="_blank" rel="noopener">أعمل التشخيص المجاني الكامل لبزنسك ←</a>';
    h+='<div class="wa"><a href="'+M.wa(msg)+'" target="_blank" rel="noopener">'+label+'<span>واتساب ←</span></a></div>';
    h+='<p class="hint">الأرقام دي محسوبة من إجاباتك إنت. لو الزر ما فتح واتساب، راسلنا على <span class="num">0119744949</span>.</p></div>';
    return h;
  }
  render();
})();
