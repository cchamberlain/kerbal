webpackJsonp([0,1],{

/***/ 561:
/*!************************************************!*\
  !*** ../src/app/routes/routes/Frames/index.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar path = 'frames';\nvar getComponent = function getComponent(nextState, cb) {\n  return __webpack_require__.e/* nsure */(8, function (require) {\n    return cb(null, __webpack_require__(/*! ./components/Frames */ 560).default);\n  });\n};\nexports.default = { path: path, getComponent: getComponent };\n\n/*****************\n ** WEBPACK FOOTER\n ** ../src/app/routes/routes/Frames/index.js\n ** module id = 561\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../src/app/routes/routes/Frames/index.js?");

/***/ },

/***/ 563:
/*!*************************************************!*\
  !*** ../src/app/routes/routes/NoMatch/index.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = { path: '*',\n    getComponent: function getComponent(nextState, cb) {\n        __webpack_require__.e/* nsure */(7, function (require) {\n            return cb(null, __webpack_require__(/*! ./components/NoMatch */ 562).default);\n        });\n    }\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ../src/app/routes/routes/NoMatch/index.js\n ** module id = 563\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../src/app/routes/routes/NoMatch/index.js?");

/***/ },

/***/ 565:
/*!**********************************************!*\
  !*** ../src/app/routes/routes/Test/index.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = { path: 'test',\n    getComponent: function getComponent(nextState, cb) {\n        __webpack_require__.e/* nsure */(6, function (require) {\n            return cb(null, __webpack_require__(/*! ./components/Test */ 564).default);\n        });\n    },\n    getChildRoutes: function getChildRoutes(location, cb) {\n        __webpack_require__.e/* nsure */(3, function (require) {\n            return cb(null, [__webpack_require__(/*! ./routes/Grids */ 569).default, __webpack_require__(/*! ./routes/Forms */ 567).default]);\n        });\n    }\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ../src/app/routes/routes/Test/index.js\n ** module id = 565\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../src/app/routes/routes/Test/index.js?");

/***/ }

});