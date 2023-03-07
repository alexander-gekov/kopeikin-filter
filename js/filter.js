/*
 * Kopeikin Remover - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Kostadin Kostadinov from the web page.
 */

// Variables
var regex = /Kostadin Kostadinov|Костадин Костадинов|Възраждане|Vazrazhdane/i;
var search = regex.exec(document.body.innerText);

let elements = [...document.querySelectorAll("*")].filter(e => e.childNodes && [...e.childNodes].find(n => n.nodeValue?.match(regex)));

// Functions
function filterMild() {
	console.log("Премахване на копейки със слабо филтриране...");
	return elements.filter(e => "h1,h2,h3,h4,h5,p,span,li".includes(e.tagName));
}

function filterDefault () {
	console.log("Премахване на копейки с нормално филтриране...");
	return elements.filter(e=>e.parentNode.childNodes.length == 1).map(e=>e.parentNode).filter(e => e.closest("div"));
}

function filterVindictive() {	
	console.log("Премахване на копейки със строго филтриране...");
	return elements.filter(e => !"body,html".includes(e.tagName));
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
	console.log("Елементи за филтриране: ", elements);
	fadeOut(elements);
}

function fadeOut(elements) {
	// Fade out all elements
	elements.forEach(function(element) {
		element.style.opacity = 1;
		(function fade() {
			if ((element.style.opacity -= .1) < 0) {
				element.style.display = "none";
			} else {
				requestAnimationFrame(fade);
			}
		})();
	}
	);
}


// Implementation
function hideKostadinov() {
	if (search) {
	console.log("Копейкин бе намерен на страницата on page! - Премахване на елементи...");
	chrome.storage.sync.get({
		filter: 'aggro',
	}, function(items) {
		console.log("Сенситивност на филтъра: " + items.filter);
		elements = getElements(items.filter);
		filterElements(elements);
		// elements = document.querySelectorAll('.feed');
		// elements.forEach((el) => {
		// const content = el.innerHTML.toLowerCase();
		// if (content.matchAll(regex)) {
		// 	el.style.display = 'none';
		// }
		// });
		chrome.runtime.sendMessage({method: "saveStats", kopeiki: elements.length}, function(response) {
				console.log("Премахнати " + elements.length + " копейки.");
			});
		});
	chrome.runtime.sendMessage({}, function(response) {});
	}
}

hideKostadinov();

function hideKostadinovFb() {
	console.log("scrolling");
	const elements = document.querySelectorAll('.feed');
	elements.forEach((el) => {
	  const content = el.innerHTML.toLowerCase();
	  if (content.includes('kostadinov')) {
		el.style.display = 'none';
	  }
	});
  }
  
  window.addEventListener('scroll', hideKostadinov);