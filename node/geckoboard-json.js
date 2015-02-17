/**
 * Creates suitable JSON for Geckoboard's Number and Secondary Stat widget
 * https://developer.geckoboard.com/#number-and-secondary-stat
 * @param  {Integer} number, the number to display
 * @param  {Text} text, the text to display
 * @return {JSON} Formatted as per: https://developer.geckoboard.com/#number-and-secondary-stat
 */
function numberAndSecondaryStat (number, text) {
  var output = {
    "item": [
      {
        "value": number,
        "text": text
      }
    ]
  };
  return output;
}

/**
 * Creates suitable JSON for Geckoboard's Funnel widget
 * https://developer.geckoboard.com/#funnel
 * @param  {Array} arr, Array of objects
 * @param  {String} valueFieldName, Name of the object field to use as the value
 * @param  {String} labelFieldName, Name of the object field to use as the label
 * @return {JSON} Formatted as per: https://developer.geckoboard.com/#funnel
 */
function funnel (arr, valueFieldName, labelFieldName) {
  // geckboard funnel holds a maximum of 8 items
  if (arr.length > 8) {
    arr = arr.slice(0,8);
  }

  var steps = [];
  for (var i = 0; i < arr.length; i++) {
    var step = {
      "value": arr[i][valueFieldName],
      "label": arr[i][labelFieldName]
    };
    steps.push(step);
  }
  var output = {
    "item": steps
  };
  return output;
}

/**
 * Creates suitable JSON for Geckoboard's Line Chart widget
 * https://developer.geckoboard.com/#line-chart
 * @param  {Array} arr, Array of objects
 * @param  {String} valueFieldName, Name of the object field to plot
 * @param  {String} labelFieldName, Name of the object field to use as the x-axis label
 * @param  {[type]} options (.color as hexcode color, .usingDate:true will shorted dates to 'MM-DD')
 * @return {JSON} Formatted as per: https://developer.geckoboard.com/#line-chart
 */
function lineChart (arr, valueFieldName, labelFieldName, options) {
  if (arr.length > 120) {
    arr = arr.slice(0,120);
  }

  var geckoboardJSON = {};
  var item = []; // this stores the values
  var settings = {};
  var axisx = [];
  var axisy = [];

  if (options) {
    if (options.color) {
      color = options.color;
      settings.color = color;
    }
  }

  for (var i = 0; i < arr.length; i++) {
    item.push(arr[i][valueFieldName]);
    axisx.push(arr[i][labelFieldName]);
  }

  if (options && options.usingDates) {
    for (var j = 0; j < axisx.length; j++) {
      var d = new Date(axisx[j]);
      var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
      var dd  = d.getDate().toString();
      axisx[j] =  (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
    }
  }

  var lowest;
  var highest;

  for (var i = 0; i < item.length; i++) {
    var thisItem = item[i];
    if (!lowest || (thisItem < lowest)) {
      lowest = thisItem;
    }
    if (!highest || (thisItem > highest)) {
      highest = thisItem;
    }
  }

  lowest = Math.round(lowest * 100) / 100;
  highest = Math.round(highest * 100) / 100;

  axisy = [lowest, highest];

  settings.axisx = axisx;
  settings.axisy = axisy;
  geckoboardJSON.item = item;
  geckoboardJSON.settings = settings;

  return geckoboardJSON;
}

module.exports = {
  numberAndSecondaryStat: numberAndSecondaryStat,
  funnel: funnel,
  lineChart: lineChart
};

