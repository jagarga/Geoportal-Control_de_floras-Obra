// Ol3-Google-Maps. See https://github.com/mapgears/ol3-google-maps/
// License: https://github.com/mapgears/ol3-google-maps/blob/master/LICENSE
// Version: v0.4

(function (root, factory) {
  if (typeof exports === "object") {
    module.exports = factory(root.ol);
  } else if (typeof define === "function" && define.amd) {
    define(['ol'], factory);
  } else {
    root.olgm = factory(root.ol);
  }
}(this, function (ol) {
  var OL3GOOGLEMAPS = {};
  var g,l=this;
function m(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function n(a,b,c){n=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return n.apply(null,arguments)}function p(a,b){var c=a.split("."),d=OL3GOOGLEMAPS||l;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d[e]?d=d[e]:d=d[e]={}:d[e]=b}
function r(a,b){function c(){}c.prototype=b.prototype;a.j=b.prototype;a.prototype=new c;a.fa=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};function t(a,b){this.e=a;this.a=b};function u(a,b){return a<b?-1:a>b?1:0};var v=[156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,.5971642833948135,.298582141697,.14929107084,.07464553542,.03732276771];
function w(a){var b=null;return b=a instanceof ol.geom.Point?a.getCoordinates():a instanceof ol.geom.Polygon?a.getInteriorPoint().getCoordinates():ol.extent.getCenter(a.getExtent())}function x(a){var b="",c=null;"string"===typeof a?0===a.indexOf("rgba")?c=y(a):b=a:Array.isArray(a)&&(c=a);null!==c&&(b=["rgb(",c[0],",",c[1],",",c[2],")"].join(""));return b}
function B(a){var b=null,c=null;"string"===typeof a?0===a.indexOf("rgba")&&(c=y(a)):Array.isArray(a)&&(c=a);c&&void 0!==c[3]&&(b=+c[3]);return b}function C(a){var b=null;a instanceof ol.style.Style?b=a:a instanceof ol.layer.Vector||a instanceof ol.Feature?(b=a.getStyle())&&b instanceof Function&&(b=b()[0]):a instanceof Function&&(b=a()[0]);return b}function y(a){var b=null;(a=a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/))&&a.length&&(b=[+a[1],+a[2],+a[3],+a[4]]);return b}
function D(a,b){a.forEach(ol.Observable.unByKey);a.length=0;b&&(b.forEach(E),b.length=0)};function F(a){this.set("font","normal 10px sans-serif");this.set("textAlign","center");this.set("textBaseline","middle");this.set("zIndex",1E3);this.setValues(a)}window.google&&window.google.maps&&r(F,google.maps.OverlayView);g=F.prototype;g.J=!1;g.L=0;g.U=0;g.changed=function(a){switch(a){case "fontColor":case "fontFamily":case "fontSize":case "fontWeight":case "strokeColor":case "strokeWeight":case "text":case "textAlign":case "textBaseline":ca(this);break;case "maxZoom":case "minZoom":case "offsetX":case "offsetY":case "position":this.draw()}};
function ca(a){var b=a.a;if(b){var c=b.style,d=a.get("fontColor");if(d&&(c.zIndex=a.get("zIndex"),c=b.getContext("2d"),c.clearRect(0,0,b.width,b.height),c.textBaseline=a.get("textBaseline"),c.strokeStyle=a.get("strokeColor"),c.fillStyle=d,c.font=a.get("font"),c.textAlign=a.get("textAlign"),d=a.get("text"))){var e=b.width/2,b=b.height/2;if(a=Number(a.get("strokeWeight")))c.lineWidth=a,c.strokeText(d,e,b);c.fillText(d,e,b)}}}
g.onAdd=function(){var a=this.a=document.createElement("canvas");a.style.position="absolute";a.getContext("2d").lineJoin="round";ca(this);var b=this.getPanes();b&&b.markerLayer.appendChild(a)};g.draw=function(){if(this.J)da(this);else{var a=this.a;if(a){var a=a.getContext("2d"),b=a.canvas.height;this.U=a.canvas.width;this.L=b;da(this)&&(this.J=!0)}}};
function da(a){var b=a.get("position");if(!b)return!1;var c=a.getProjection();if(!c)return!1;var c=c.fromLatLngToDivPixel(b),d=a.L,e=a.U,f=a.get("offsetX")||0,h=a.get("offsetY")||0,b=a.a.style;b.top=c.y-d/2+h+"px";b.left=c.x-e/2+f+"px";c=a.get("minZoom");d=a.get("maxZoom");void 0===c&&void 0===d?a="":(a=a.getMap())?(a=a.getZoom(),a=a<c||a>d?"hidden":""):a="";b.visibility=a;return!0}g.onRemove=function(){var a=this.a;a&&a.parentNode&&a.parentNode.removeChild(a)};function ea(a,b){var c=null;if(a instanceof ol.geom.Point)c=G(a,b);else if(a instanceof ol.geom.LineString||a instanceof ol.geom.Polygon){var d=void 0!==b?b.getView().getProjection():"EPSG:3857",c=[],e,f;f=a instanceof ol.geom.LineString?a.getCoordinates():a.getCoordinates()[0];for(var h=0,k=f.length;h<k;h++)e=ol.proj.transform(f[h],d,"EPSG:4326"),c.push(new google.maps.LatLng(e[1],e[0]));d=null;a instanceof ol.geom.LineString?d=new google.maps.Data.LineString(c):d=new google.maps.Data.Polygon([c]);
c=d}return c}function G(a,b){var c=void 0!==b?b.getView().getProjection():"EPSG:3857",d;d=a instanceof ol.geom.Point?a.getCoordinates():a;c=ol.proj.transform(d,c,"EPSG:4326");return new google.maps.LatLng(c[1],c[0])}
function fa(a,b){var c=null,d=C(a);if(d){var c={},e=d.getStroke();if(e){var f=e.getColor();f&&(c.strokeColor=x(f),f=B(f),null!==f&&(c.strokeOpacity=f));(e=e.getWidth())&&(c.strokeWeight=e)}if(e=d.getFill())if(e=e.getColor())c.fillColor=x(e),e=B(e),null!==e&&(c.fillOpacity=e);if(f=d.getImage()){d={};e={};if(f instanceof ol.style.Circle){e.path=google.maps.SymbolPath.CIRCLE;var h=f.getStroke();if(h){var k=h.getColor();k&&(e.strokeColor=x(k));e.strokeWeight=h.getWidth()}if(h=f.getFill())if(h=h.getColor())e.fillColor=
x(h),h=B(h),e.fillOpacity=null!==h?h:1;(f=f.getRadius())&&(e.scale=f)}else f instanceof ol.style.Icon&&((h=f.getSrc())&&(e.url=h),h=f.getScale(),(k=f.getAnchor())&&(e.anchor=void 0!==h?new google.maps.Point(k[0]*h,k[1]*h):new google.maps.Point(k[0],k[1])),(k=f.getOrigin())&&(e.origin=new google.maps.Point(k[0],k[1])),f=f.getSize())&&(e.size=new google.maps.Size(f[0],f[1]),void 0!==h&&(e.scaledSize=new google.maps.Size(f[0]*h,f[1]*h)));Object.keys(d).length?c.icon=d:Object.keys(e).length&&(c.icon=
e)}0===Object.keys(c).length?c.visible=!1:void 0!==b&&(c.zIndex=2*b)}return c};function H(a,b){this.h=[];this.M=[];t.call(this,a,b)}r(H,t);H.prototype.g=function(){};H.prototype.f=function(){D(this.h,this.M)};function I(a,b,c,d,e){this.b=c;this.d=d;this.i=e;H.call(this,a,b)}r(I,H);g=I.prototype;g.n=null;g.k=null;
g.g=function(){I.j.g.call(this);var a=this.b.getGeometry(),b=this.b.getGeometry(),b=ea(b,void 0);this.n=new google.maps.Data.Feature({geometry:b});this.d.add(this.n);(b=fa(this.b,this.i))&&this.d.overrideStyle(this.n,b);if(b=C(this.b)){var c=b.getText();if(c){var b={align:"center",position:G(w(a)),zIndex:2*this.i+1},d=c.getText();d&&(b.text=d);(d=c.getFont())&&(b.font=d);(d=c.getFill())&&(d=d.getColor())&&(b.fontColor=d);if(d=c.getStroke()){var e=d.getColor();e&&(b.strokeColor=e);(d=d.getWidth())&&
(b.strokeWeight=d)}(d=c.getOffsetX())&&(b.offsetX=d);(d=c.getOffsetY())&&(b.offsetY=d);(d=c.getTextAlign())&&(b.textAlign=d);(c=c.getTextBaseline())&&(b.textBaseline=c);this.k=new F(b);this.k.setMap(this.a)}}b=this.h;this.c=a.on("change",this.F,this);b.push(this.c);b.push(this.b.on("change:"+this.b.getGeometryName(),this.X,this))};g.f=function(){this.d.remove(this.n);this.n=null;this.k&&(this.k.setMap(null),this.k=null);I.j.f.call(this)};
g.F=function(){var a=this.b.getGeometry();this.n.setGeometry(ea(a));this.k&&(a=G(w(a)),this.k.set("position",a))};g.X=function(){var a=this.h;ol.Observable.unByKey(this.c);a.splice(a.indexOf(this.c),1);this.c=this.b.getGeometry().on("change",this.F,this);a.push(this.c);this.F()};function J(a,b,c,d){this.b=[];this.d=[];this.i=d;this.c=c;H.call(this,a,b)}r(J,H);g=J.prototype;g.g=function(){J.j.g.call(this);this.c.getFeatures().forEach(this.S,this);var a=this.h;a.push(this.c.on("addfeature",this.W,this));a.push(this.c.on("removefeature",this.$,this))};g.f=function(){this.c.getFeatures().forEach(this.Q,this);J.j.f.call(this)};g.W=function(a){this.S(a.feature)};g.$=function(a){this.Q(a.feature)};
g.S=function(a){var b=this.e,c=this.a,d=this.i;this.b.push(a);b=new I(b,c,a,d,this.b.indexOf(a));b.g();this.d.push({feature:a,r:b})};g.Q=function(a){a=this.b.indexOf(a);-1!==a&&(this.b.splice(a,1),this.d[a].r.f(),this.d.splice(a,1))};var K=Array.prototype,ga=K.indexOf?function(a,b,c){return K.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if("string"==typeof a)return"string"==typeof b&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};var L;a:{var ha=l.navigator;if(ha){var ia=ha.userAgent;if(ia){L=ia;break a}}L=""};var ja=-1!=L.indexOf("Opera")||-1!=L.indexOf("OPR"),M=-1!=L.indexOf("Trident")||-1!=L.indexOf("MSIE"),N=-1!=L.indexOf("Gecko")&&-1==L.toLowerCase().indexOf("webkit")&&!(-1!=L.indexOf("Trident")||-1!=L.indexOf("MSIE")),O=-1!=L.toLowerCase().indexOf("webkit");function ka(){var a=l.document;return a?a.documentMode:void 0}
var la=function(){var a="",b;if(ja&&l.opera)return a=l.opera.version,"function"==m(a)?a():a;N?b=/rv\:([^\);]+)(\)|;)/:M?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:O&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(L))?a[1]:"");return M&&(b=ka(),b>parseFloat(a))?String(b):a}(),ma={};
function P(a){var b;if(!(b=ma[a])){b=0;for(var c=String(la).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var h=c[f]||"",k=d[f]||"",z=RegExp("(\\d*)(\\D*)","g"),s=RegExp("(\\d*)(\\D*)","g");do{var q=z.exec(h)||["","",""],A=s.exec(k)||["","",""];if(0==q[0].length&&0==A[0].length)break;b=u(0==q[1].length?0:parseInt(q[1],10),0==A[1].length?0:parseInt(A[1],10))||u(0==q[2].length,0==A[2].length)||
u(q[2],A[2])}while(0==b)}b=ma[a]=0<=b}return b}var na=l.document,oa=na&&M?ka()||("CSS1Compat"==na.compatMode?parseInt(la,10):5):void 0;var Q;(Q=!M)||(Q=M&&9<=oa);var pa=Q,qa=M&&!P("9");!O||P("528");N&&P("1.9b")||M&&P("8")||ja&&P("9.5")||O&&P("528");N&&!P("8")||M&&P("9");function R(a,b){this.type=a;this.a=this.b=b}R.prototype.c=function(){};function S(a){S[" "](a);return a}S[" "]=function(){};function T(a,b){R.call(this,a?a.type:"");this.d=this.a=this.b=null;if(a){this.type=a.type;this.b=a.target||a.srcElement;this.a=b;var c=a.relatedTarget;if(c&&N)try{S(c.nodeName)}catch(d){}this.d=a;a.defaultPrevented&&this.c()}}r(T,R);T.prototype.c=function(){T.j.c.call(this);var a=this.d;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,qa)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var ra="closure_listenable_"+(1E6*Math.random()|0),sa=0;function ta(a,b,c,d,e){this.p=a;this.a=null;this.src=b;this.type=c;this.B=!!d;this.b=e;++sa;this.s=this.A=!1}function ua(a){a.s=!0;a.p=null;a.a=null;a.src=null;a.b=null};function va(a){this.src=a;this.a={};this.b=0};var U="closure_lm_"+(1E6*Math.random()|0),V={},wa=0;
function xa(a,b,c,d,e){if("array"==m(b)){for(var f=0;f<b.length;f++)xa(a,b[f],c,d,e);return null}c=ya(c);if(a&&a[ra])a=a.a(b,c,d,e);else{f=c;if(!b)throw Error("Invalid event type");c=!!d;var h=W(a);h||(a[U]=h=new va(a));var k=h,z=b.toString(),h=k.a[z];h||(h=k.a[z]=[],k.b++);var s;b:{for(s=0;s<h.length;++s){var q=h[s];if(!q.s&&q.p==f&&q.B==!!d&&q.b==e)break b}s=-1}-1<s?(d=h[s],d.A=!1):(d=new ta(f,k.src,z,!!d,e),d.A=!1,h.push(d));d.a||(e=za(),d.a=e,e.src=a,e.p=d,a.addEventListener?a.addEventListener(b.toString(),
e,c):a.attachEvent(Aa(b.toString()),e),wa++);a=d}return a}function za(){var a=Ba,b=pa?function(c){return a.call(b.src,b.p,c)}:function(c){c=a.call(b.src,b.p,c);if(!c)return c};return b}
function E(a){if("number"==typeof a||!a||a.s)return!1;var b=a.src;if(b&&b[ra])return b.ga(a);var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.B):b.detachEvent&&b.detachEvent(Aa(c),d);wa--;if(c=W(b)){var d=a.type,e;if(e=d in c.a){e=c.a[d];var f=ga(e,a),h;(h=0<=f)&&K.splice.call(e,f,1);e=h}e&&(ua(a),0==c.a[d].length&&(delete c.a[d],c.b--));0==c.b&&(c.src=null,b[U]=null)}else ua(a);return!0}function Aa(a){return a in V?V[a]:V[a]="on"+a}
function Ca(a,b,c,d){var e=1;if(a=W(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.B==c&&!f.s&&(e&=!1!==Da(f,d))}return Boolean(e)}function Da(a,b){var c=a.p,d=a.b||a.src;a.A&&E(a);return c.call(d,b)}
function Ba(a,b){if(a.s)return!0;if(!pa){var c;if(!(c=b))a:{c=["window","event"];for(var d=l,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new T(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(h){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.a;f;f=f.parentNode)e.push(f);for(var f=a.type,k=e.length-1;0<=k;k--)c.a=e[k],d&=Ca(e[k],f,!0,c);for(k=0;k<e.length;k++)c.a=e[k],d&=Ca(e[k],f,!1,c)}return d}return Da(a,
new T(b,this))}function W(a){a=a[U];return a instanceof va?a:null}var Ea="__closure_events_fn_"+(1E9*Math.random()>>>0);function ya(a){return"function"==m(a)?a:a[Ea]||(a[Ea]=function(b){return a.handleEvent(b)})};function X(a,b){H.call(this,a,b)}r(X,H);g=X.prototype;g.v=null;g.g=function(){X.j.g.call(this);var a=this.e.getView(),b=this.h;b.push(a.on("change:center",this.u,this));b.push(a.on("change:resolution",this.H,this));this.M.push(xa(window,"resize",this.ba,!1,this));this.u();this.H()};g.f=function(){X.j.f.call(this)};g.u=function(){var a=this.e.getView(),b=a.getProjection(),a=a.getCenter();"array"==m(a)&&(a=ol.proj.transform(a,b,"EPSG:4326"),this.a.setCenter(new google.maps.LatLng(a[1],a[0])))};
g.H=function(){var a=this.e.getView().getResolution();if("number"==typeof a){var b;b=null;for(var a=Math.round(1E3*a)/1E3,c=0,d=v.length;c<d;c++)if(a==Math.round(1E3*v[c])/1E3){b=c;break}null!==b&&this.a.setZoom(b)}};g.ba=function(){null===this.v||l.clearTimeout(this.v);this.v=window.setTimeout(n(this.ea,this),100)};g.ea=function(){this.u();this.v=null};function Y(a){a=void 0!==a?a:{};ol.layer.Group.call(this,a);this.a=void 0!==a.mapTypeId?a.mapTypeId:google.maps.MapTypeId.ROADMAP;this.c=a.styles?a.styles:null}r(Y,ol.layer.Group);Y.prototype.b=function(){return this.a};function Z(a,b,c){this.t=[];this.C=[];this.b=[];this.D=[];this.i=new X(a,b);this.N=c;this.K=b.getDiv();this.c=a.getViewport();this.d=a.getTargetElement();H.call(this,a,b);if(this.e.getView().getCenter())this.e.once("postrender",function(){this.G=!0;this.q()},this);else this.e.getView().once("change:center",function(){this.e.once("postrender",function(){this.G=!0;this.q()},this);this.q()},this)}r(Z,H);g=Z.prototype;g.o=!1;g.G=!1;
g.g=function(){Z.j.g.call(this);var a=this.e.getLayers();a.forEach(this.T,this);var b=this.h;b.push(a.on("add",this.Y,this));b.push(a.on("remove",this.Z,this))};g.f=function(){this.e.getLayers().forEach(this.R,this);Z.j.f.call(this)};g.Y=function(a){this.T(a.element)};g.Z=function(a){this.R(a.element)};
g.T=function(a){if(a instanceof Y)this.t.push(a),this.C.push({layer:a,h:[a.on("change:visible",this.q,this)]}),this.q();else if(a instanceof ol.layer.Vector&&this.N){var b=this.e,c=this.a,d=a.getSource();if(d){this.D.push(a);var e=new google.maps.Data({map:c}),f=fa(a);f&&e.setStyle(f);b=new J(b,c,d,e);c=a.getOpacity();e={data:e,r:b,layer:a,h:[],opacity:c};e.h.push(a.on("change:visible",this.aa.bind(this,e),this));this.w(e);this.b.push(e)}}};
g.R=function(a){if(a instanceof Y)a=this.t.indexOf(a),-1!==a&&(this.t.splice(a,1),D(this.C[a].h),this.C.splice(a,1),this.q());else if(a instanceof ol.layer.Vector&&this.N){var b=this.D.indexOf(a);if(-1!==b){this.D.splice(b,1);var c=this.b[b];D(c.h);c.data.setMap(null);c.r.f();a.setOpacity(c.opacity);this.b.splice(b,1)}}};
function Fa(a){var b=a.e.getView().getCenter();!a.o&&a.G&&b&&(a.d.removeChild(a.c),a.d.appendChild(a.K),a.a.controls[google.maps.ControlPosition.TOP_LEFT].push(a.c),a.i.g(),google.maps.event.trigger(a.a,"resize"),a.i.u(),a.i.H(),a.o=!0,a.b.forEach(a.w,a))}
g.q=function(){var a=null;this.e.getLayers().getArray().slice(0).reverse().every(function(b){return b instanceof Y&&b.getVisible()&&-1!==this.t.indexOf(b)?(a=b,!1):!0},this);if(a){this.a.setMapTypeId(a.a);var b=a.c;b?this.a.setOptions({styles:b}):this.a.setOptions({styles:null});Fa(this)}else this.o&&(this.a.controls[google.maps.ControlPosition.TOP_LEFT].removeAt(0),this.d.removeChild(this.K),this.d.appendChild(this.c),this.i.f(),this.c.style.position="relative",this.b.forEach(this.I,this),this.o=
!1)};g.w=function(a){a.layer.getVisible()&&this.o&&(a.r.g(),a.layer.setOpacity(0))};g.I=function(a){a.r.f();a.layer.setOpacity(a.opacity)};g.aa=function(a){a.layer.getVisible()?this.w(a):this.I(a)};function $(a){this.b=[];var b=document.createElement("div");b.style.height="inherit";b.style.width="inherit";b=new google.maps.Map(b,{disableDefaultUI:!0,disableDoubleClickZoom:!0,draggable:!1,keyboardShortcuts:!1,mapTypeId:google.maps.MapTypeId.ROADMAP,scrollwheel:!1,streetViewControl:!1});t.call(this,a.map,b);this.c=new Z(this.e,this.a,void 0!==a.watchVector?a.watchVector:!0);this.b.push(this.c)}r($,t);g=$.prototype;g.l=!1;
g.O=function(){if(!this.l){for(var a=0,b=this.b.length;a<b;a++)this.b[a].g();this.l=!0}};g.P=function(){if(this.l){for(var a=0,b=this.b.length;a<b;a++)this.b[a].f();this.l=!1}};g.ca=function(){return this.l&&this.c.o};g.V=function(){return this.a};g.da=function(){this.l?this.P():this.O()};p("olgm.OLGoogleMaps",$);$.prototype.activate=$.prototype.O;$.prototype.deactivate=$.prototype.P;$.prototype.getGoogleMapsActive=$.prototype.ca;$.prototype.getGoogleMapsMap=$.prototype.V;$.prototype.toggle=$.prototype.da;p("olgm.layer.Google",Y);Y.prototype.getMapTypeId=Y.prototype.b;p("olgm.interaction.defaults",function(a){a=void 0!==a?a:{};a.altShiftDragRotate=!1;a.dragPan=!1;a.pinchRotate=!1;return ol.interaction.defaults(a).extend([new ol.interaction.DragPan])});p("olgm.gm.MapLabel",F);
F.prototype.changed=F.prototype.changed;F.prototype.onAdd=F.prototype.onAdd;F.prototype.draw=F.prototype.draw;F.prototype.onRemove=F.prototype.onRemove;
  return OL3GOOGLEMAPS.olgm;
}));

