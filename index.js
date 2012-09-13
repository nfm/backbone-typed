// Generated by CoffeeScript 1.3.3
(function() {
  var Backbone, TypedModel, logr,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Backbone = require('backbone');

  logr = require('node-logr').getLogger("backbone-typed");

  exports.TypedModel = TypedModel = (function(_super) {

    __extends(TypedModel, _super);

    function TypedModel() {
      return TypedModel.__super__.constructor.apply(this, arguments);
    }

    TypedModel.prototype.set = function(key, value, options) {
      var attr, attrs, i, keys, typedSet, val, _i, _len, _ref, _ref1;
      attrs = attr = val = null;
      if (key === Object(key) || key === null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      if (this.types && attrs) {
        keys = Object.keys(attrs);
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          i = keys[_i];
          if (this.types[i] && attrs[i] !== null && attrs[i] !== void 0) {
            switch (this.types[i]) {
              case 'String':
                if (attrs[i] != null) {
                  attrs[i] = String(attrs[i]);
                }
                break;
              case 'Integer':
                if (attrs[i] != null) {
                  if (isNaN(attrs[i])) {
                    exports._logDataDrop(i, attrs[i], this.types[i]);
                    attrs[i] = null;
                  } else {
                    attrs[i] = parseInt(attrs[i]);
                  }
                }
                break;
              case 'Float':
                if (attrs[i] != null) {
                  if (isNaN(attrs[i])) {
                    exports._logDataDrop(i, attrs[i], this.types[i]);
                    attrs[i] = null;
                  } else {
                    attrs[i] = parseFloat(attrs[i]);
                  }
                }
                break;
              case 'Boolean':
                attrs[i] = (function() {
                  switch (attrs[i]) {
                    case "true":
                    case "1":
                      return true;
                    case "false":
                    case "0":
                      return false;
                    default:
                      return !!attrs[i];
                  }
                })();
                break;
              default:
                if (((_ref = this.types[i].prototype) != null ? _ref.__typeName : void 0) && this.types[i](attrs[i])) {

                } else {
                  typedSet = typeof this.types[i] === "string" ? this.types[i] : (_ref1 = this.types[i].prototype) != null ? _ref1.__typeName : void 0;
                  exports._logDataDrop(i, attrs[i], typedSet);
                  attrs[i] = null;
                }
            }
          }
        }
      }
      return TypedModel.__super__.set.call(this, key, value, options);
    };

    return TypedModel;

  })(Backbone.Model);

  exports._logDataDrop = function(name, originalVal, typed) {
    return logr.error("backbone-typed nulled value of:\"" + name + "\" value:\"" + originalVal + "\" type:\"" + typed + "\"");
  };

  exports.Types = {
    "String": "String",
    "Integer": "Integer",
    "Float": "Float",
    "Boolean": "Boolean",
    "Enum": function(obj) {
      var name, value, _vals;
      _vals = (function() {
        var _results;
        _results = [];
        for (name in obj) {
          value = obj[name];
          _results.push(value);
        }
        return _results;
      })();
      return exports._getSignedProtoFunc("Enum", function(lookup) {
        return __indexOf.call(_vals, lookup) >= 0;
      });
    }
  };

  exports._getSignedProtoFunc = function(typeName, callme) {
    var inner;
    inner = function() {
      return callme.apply(this, arguments);
    };
    inner.prototype.__typeName = typeName;
    return inner;
  };

}).call(this);
