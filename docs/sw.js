parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"OHOe":[function(require,module,exports) {
"use strict";function n(){return Math.random().toString(16).substr(2,8)}function t(t,e){var r=n(),i=[],o=!1,u=[];function f(n,t){void 0===t&&(t={self:!1}),i.forEach(function(e){(n.from.uid!==r||t.self)&&e(n)})}function s(n,i){void 0===i&&(i={});var s={input:n,from:{uid:r,name:e}};f(s,i),o?t.send(s):u.push({input:n,options:i})}var c={send:s,listen:function(n){return i.push(n),function(){var t=i.indexOf(n);i.splice(t,1)}},getUid:function(){return r}};return t.listen(f),t.ready().then(function(){o=!0,u.forEach(function(n){return s(n.input,n.options)}),u=[]}),c}Object.defineProperty(exports,"__esModule",{value:!0}),exports.createChannel=t;
},{}],"FCl4":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.setupChannelInServiceWorker=n,exports.createChannel=t;var e=require("./channel");function r(){var e="serviceWorker"in navigator;return{send:function(r){null!==navigator.serviceWorker.controller?navigator.serviceWorker.controller.postMessage(r):e||console.log("ServiceWorker не поддерживается данным браузером. Использование PlatformChannel не будет иметь эффекта.")},listen:function(e){var r=function(r){e(r.data)};return navigator.serviceWorker.addEventListener("message",r),function(){return navigator.serviceWorker.removeEventListener("message",r)}},ready:function(){return navigator.serviceWorker.getRegistration()}}}function n(e){e.addEventListener("message",function(r){r.waitUntil(e.clients.matchAll().then(function(e){e&&0!==e.length&&e.forEach(function(e){e.postMessage(r.data)})}))})}function t(n){var t=r();return(0,e.createChannel)(t,n)}
},{"./channel":"OHOe"}],"A5OK":[function(require,module,exports) {
"use strict";var e=require("./platform/channel/service-worker-channel");(0,e.setupChannelInServiceWorker)(self);
},{"./platform/channel/service-worker-channel":"FCl4"}]},{},["A5OK"], null)
//# sourceMappingURL=sw.js.map