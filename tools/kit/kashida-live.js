/* Applies mu.kashida (3× ـ) to side headings and important titles, including content the engine renders later. */
(function(){
var NO="اأإآدذرزوؤةءى",AR=/[ء-ي]/,K="ـ";
function k(t,n){n=n||3;if(t.indexOf(K)>=0)return t;var w=t.split(" "),b=-1,bl=0;
 w.forEach(function(x,i){var l=x.replace(/[^ء-ي]/g,"").length;if(l>bl&&l>=4){bl=l;b=i}});
 if(b<0)return t;var x=w[b],m=x.length/2,p=-1,d=99;
 for(var j=1;j<x.length-1;j++){var c=x[j];if(AR.test(c)&&AR.test(x[j+1])&&NO.indexOf(c)<0){var dd=Math.abs(j+.5-m);if(dd<d){d=dd;p=j}}}
 if(p<0)return t;w[b]=x.slice(0,p+1)+Array(n+1).join(K)+x.slice(p+1);return w.join(" ")}
var SEL=".hero .tag,.qnum,.box h3,.intro .q";
function run(){document.querySelectorAll(SEL).forEach(function(el){if(el.dataset.k)return;el.dataset.k=1;
 var tn=[].filter.call(el.childNodes,function(n){return n.nodeType===3&&/[ء-ي]{4}/.test(n.nodeValue)});
 if(tn.length){var big=tn.sort(function(a,b){return b.nodeValue.length-a.nodeValue.length})[0];big.nodeValue=k(big.nodeValue)}})}
window.muKashida=k;
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("DOMContentLoaded",run);run();
})();
