/* mu.kashida(text, n=3): stretch ONE word of a heading with tatweel (ـ), Mind Up rules.
   Picks the longest Arabic word, inserts after a letter that joins forward, near the middle. */
var mu=window.mu=window.mu||{};
mu.kashida=function(text,n){
  n=n||3; var NO="اأإآدذرزوؤةءى", AR=/[ء-ي]/, words=text.split(" "), best=-1, bl=0;
  words.forEach(function(w,k){var l=w.replace(/[^ء-ي]/g,"").length;if(l>bl&&l>=4){bl=l;best=k;}});
  if(best<0) return text;
  var w=words[best], mid=w.length/2, pos=-1, d=99;
  for(var j=1;j<w.length-1;j++){var c=w[j],nx=w[j+1];
    if(AR.test(c)&&AR.test(nx)&&NO.indexOf(c)<0&&!(j===1&&w[0]==="ا"&&c==="ل"&&w.length<5)){var dd=Math.abs(j+.5-mid);if(dd<d){d=dd;pos=j;}}}
  if(pos<0) return text;
  words[best]=w.slice(0,pos+1)+new Array(n+1).join("ـ")+w.slice(pos+1);
  return words.join(" ");
};
