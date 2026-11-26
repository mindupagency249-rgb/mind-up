/* Mind Up Tools engine v1 (26 Nov 2026). One question per screen, gate before result, posts to the live
   diagnosis /exec (doPost -> Diagnosis Inbox). Every tool = a TOOL config + this file + brand.css. */
(function(){
  var ENDPOINT="https://script.google.com/macros/s/AKfycbypkmlijmb-NVYGN4fnwCGe4raME5Iu_gc4U8HcJE__iBk7ZvV_xZ0nd6Ke9_JVPDZ4/exec";
  var WA="249119744949";
  var T=window.TOOL, A={}, i=-1, card=document.getElementById("card"), bar=document.getElementById("bar");
  var GATE=[
    {id:"name",t:"اسمك الكريم؟",type:"short",req:true,ph:"مثلاً: أحمد عثمان"},
    {id:"whatsapp",t:"رقم الواتساب (عشان نرسل ليك النتيجة والتوصية)",type:"short",req:true,ph:"مثلاً: 0912345678",inputmode:"tel"},
    {id:"business",t:"اسم الشركة أو البزنس",type:"short",req:true,ph:"مثلاً: شركة النيل للتجارة"},
    {id:"email",t:"الإيميل (اختياري)",type:"short",ph:"name@company.com",inputmode:"email"}
  ];
  var Q=T.questions.concat([{id:"_gate",type:"gatehead"}]).concat(GATE);
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}
  function lbl(o){return typeof o==="string"?o:o.l;} function val(o){return typeof o==="string"?o:o.v;}
  window.MU={esc:esc,wa:function(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t);},
    money:function(n){if(!isFinite(n))return "–";var r=Math.abs(n)>=100?Math.round(n):Math.round(n*10)/10;return "$"+r.toLocaleString("en-US");},
    pct:function(n){return isFinite(n)?(Math.round(n*1000)/10)+"%":"–";}};
  function visible(q){return !q.when||q.when(A);}
  function go(d){do{i+=d;}while(Q[i]&&!visible(Q[i]));render();}
  function setBar(){var n=Q.length, p=i<0?0:Math.min(100,Math.round(i/n*100));if(bar)bar.style.width=p+"%";}
  function intro(){
    var h='<div class="intro" style="display:flex;flex-direction:column;gap:14px">'+T.intro+'</div>';
    h+='<div class="nav"><span class="hint">'+esc(T.duration||"دقيقة واحدة")+'</span><button class="btn primary" id="start">يلا نبدأ</button></div>';
    card.innerHTML=h;document.getElementById("start").onclick=function(){go(1)};
  }
  function render(){
    setBar(); if(i<0) return intro(); var q=Q[i]; if(!q) return submit();
    var h, cnt=Q.filter(visible).indexOf(q)+1, tot=Q.filter(visible).length;
    if(q.type==="gatehead"){
      h='<div class="qnum">خطوة أخيرة</div><h2 class="q">نتيجتك جاهزة ✅</h2><p>أكتب بياناتك عشان تظهر ليك النتيجة كاملة مع التوصية، وتحفظها عندنا لو حبيت نراجعها معاك.</p>';
      h+='<div class="nav"><button class="btn ghost" id="back">رجوع</button><button class="btn primary" id="next">التالي</button></div>';
      card.innerHTML=h; bind(q); return;
    }
    h='<div class="qnum">'+cnt+' من '+tot+'</div><h2 class="q">'+esc(q.t)+(q.req?' <span class="req">*</span>':'')+'</h2>';
    if(q.d) h+='<p class="hint">'+esc(q.d)+'</p>';
    if(q.type==="single"||q.type==="yesno"){
      var opts=q.type==="yesno"?[{v:"نعم",l:"نعم"},{v:"لا",l:"لا"}]:q.opts;
      h+='<div class="opts'+(q.type==="yesno"?' yn':'')+'">'+opts.map(function(o){var v=val(o);return '<button class="opt" data-v="'+esc(v)+'" aria-pressed="'+(A[q.id]===v)+'">'+esc(lbl(o))+(o.d?'<small>'+esc(o.d)+'</small>':'')+'</button>';}).join("")+'</div>';
    } else {
      h+='<input id="in" '+(q.type==="number"?'inputmode="decimal" dir="ltr"':'')+(q.inputmode?' inputmode="'+q.inputmode+'"':'')+' placeholder="'+esc(q.ph||"")+'" value="'+esc(A[q.id]||"")+'">';
    }
    h+='<div class="err" id="err"></div><div class="nav"><button class="btn ghost" id="back">رجوع</button><button class="btn primary" id="next">'+(Q[i+1]?'التالي':'أعرض النتيجة')+'</button></div>';
    card.innerHTML=h; bind(q);
  }
  function num(s){s=String(s||"").replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[,،\s$]/g,"");return s===""?NaN:Number(s);}
  function bind(q){
    var inp=document.getElementById("in"), err=document.getElementById("err");
    document.getElementById("back").onclick=function(){go(-1)};
    card.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){A[q.id]=b.getAttribute("data-v");setTimeout(function(){go(1)},140);render();};});
    if(inp){inp.focus();inp.onkeydown=function(e){if(e.key==="Enter")document.getElementById("next").click();};}
    document.getElementById("next").onclick=function(){
      if(inp){var v=inp.value.trim();
        if(q.type==="number"){var n=num(v);if(v===""&&!q.req){A[q.id]="";return go(1);}if(!isFinite(n)||n<0){err.textContent="أكتب رقم بس (مثلاً 120)";return;}if(q.min!=null&&n<q.min){err.textContent=q.minMsg||"الرقم صغير شديد";return;}A[q.id]=n;}
        else{if(q.req&&!v){err.textContent="محتاجين الخانة دي";return;}
          if(q.id==="whatsapp"&&v.replace(/\D/g,"").length<9){err.textContent="الرقم ناقص، راجعه";return;}
          if(q.id==="email"&&v&&!/^\S+@\S+\.\S+$/.test(v)){err.textContent="الإيميل ما مكتوب صاح";return;}
          A[q.id]=v;}
        if(q.check){var m=q.check(A);if(m){err.textContent=m;return;}}
      } else if(q.type!=="gatehead"&&q.req&&!A[q.id]){err&&(err.textContent="اختار واحدة");return;}
      go(1);
    };
  }
  function submit(){
    if(bar)bar.style.width="100%";
    var R=T.compute(A);
    var payload=Object.assign({},A,{tool:T.id,tool_name:T.name,source:"🧮 أداة: "+T.name,segment_ar:"أداة – "+T.name,
      sector:R.sector||"",stage:R.stage||"",constraint:R.constraint,score:R.score,tier:R.tier,
      pain_text:R.summary,results:R.store||{},tags:(R.tags||[]).join(", "),submitted_at:new Date().toISOString(),page:"tool-"+T.id+"-v1",
      next:"",urgency:"",start:"",invest:"",time:"",role:A.role||""});
    delete payload._gate;
    card.innerHTML='<h2 class="q">ثواني، بنحسب النتيجة...</h2>';
    var show=function(){card.innerHTML=T.result(A,R);window.scrollTo({top:0,behavior:"smooth"});};
    var test=/[?&]test=1/.test(location.search);
    if(test){payload.name="اختبار – "+payload.name;}
    fetch(ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}).then(show,show);
  }
  render();
})();
