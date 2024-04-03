'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'))

var _asyncToGenerator2 = _interopRequireDefault(require('@babel/runtime/helpers/asyncToGenerator'))

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
)

var _react = _interopRequireWildcard(require('react'))

var _reactLeaflet = require('react-leaflet')

var _shpjs = _interopRequireDefault(require('shpjs'))

var _excluded = ['data']

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null
  var cacheBabelInterop = new WeakMap()
  var cacheNodeInterop = new WeakMap()
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop
  })(nodeInterop)
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj}
  }
  var cache = _getRequireWildcardCache(nodeInterop)
  if (cache && cache.has(obj)) {
    return cache.get(obj)
  }
  var newObj = {}
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc)
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  newObj.default = obj
  if (cache) {
    cache.set(obj, newObj)
  }
  return newObj
}

var ShapeFile = function ShapeFile(props) {
  var _useState = (0, _react.useState)(null),
    geoJSONData = _useState[0],
    setGeoJSONData = _useState[1]

  var data = props.data,
    geoJSONProps = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded)
  ;(0, _react.useEffect)(
    function () {
      var parseData = /*#__PURE__*/ (function () {
        var _ref = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/ _regenerator.default.mark(function _callee() {
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.t0 = setGeoJSONData
                    _context.next = 3
                    return (0, _shpjs.default)(props.data)

                  case 3:
                    _context.t1 = _context.sent
                    ;(0, _context.t0)(_context.t1)

                  case 5:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })
        )

        return function parseData() {
          return _ref.apply(this, arguments)
        }
      })()

      parseData()
    },
    [props.data]
  )
  return /*#__PURE__*/ _react.default.createElement(
    _reactLeaflet.GeoJSON,
    (0, _extends2.default)(
      {
        key: Math.random(),
        data: geoJSONData,
      },
      geoJSONProps
    )
  )
}

var _default = ShapeFile
exports.default = _default
