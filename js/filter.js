/*
 * Kopeikin Remover - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Kostadin Kostadinov from the web page.
 */

// Variables
var regex = /Kostadin Kostadinov|Костадин Костадинов|Възраждане|Vazrazhdane/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Костадин Костадинов'), :contains('Kostadin Kostadinov'), :contains('Vazrazhdane'), :contains('Възраждане')";


// Functions
function filterMild() {
	console.log("Filtering Trump with Mild filter...");
	return document.querySelectorAll(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Filtering Trump with Default filter...");
	return document.querySelectorAll(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering Trump with Vindictive filter...");
	return document.querySelectorAll(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else if (filter == "aggro") {
	   return filterDefault();
   } else {
     return filterMild();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}


// Implementation
if (search) {
   console.log("Копейкин бе намерен на страницата on page! - Премахване на елементи...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", kopeiki: elements.length}, function(response) {
			  console.log("Премахнати " + elements.length + " копейки.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
