var dexbootstrap = window.dexquerydeps || {};

require("../lib/bootstrap-multiselect/bootstrap-multiselect");
require("../lib/bootstrap-toggle/bootstrap-toggle");

//dexbootstrap.slider = require("../lib/bootstrap-slider/bootstrap-slider");

// This fixes a JQueryUI/Bootstrap icon conflict.
if ($.fn.button.noConflict != undefined) {
  $.fn.button.noConflict();
}

module.exports = dexbootstrap;