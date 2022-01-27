chrome.contextMenus.create({
	id: "mark_tab",
	title: "Mark this tab!",
	contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener(menu => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ['js/func.js'],
		});
	});
});

const marks = ["🟢", "🔵", "🟣", "🔴", "🟠", "🟡", "⚪", "⚫", ""];

var currentMarkId = -1;
var nextMark = false;
var currentURL = "";

chrome.action.onClicked.addListener((tab) => {
	console.log('---BEGIN');
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		var tabUrl = tabs[0].url
		currentURL = tabUrl;
		console.log(tabUrl);
		chrome.storage.local.get([`currentMarkId:${tabUrl}`, `lastClickTS:${tabUrl}`, `nextMark:${tabUrl}`], function (items) {

			console.log("FIRST: ", Object.values(items)[0], Object.values(items)[1], Object.values(items)[2]);

			var lastClickTS = Object.values(items)[1] == undefined ? -1 : Object.values(items)[1];
			currentMarkId = Object.values(items)[0] == undefined ? -1 : Object.values(items)[0];
			nextMark = Object.values(items)[2] == undefined ? false : Object.values(items)[2];
			console.log("background.js: ", lastClickTS, currentMarkId, nextMark);
			// var dtNow = Date.now();
			// console.log("SUB: ", dtNow, dtNow - lastClickTS, lastClickTS);

			// User clicked again - need to change badge
			if (Date.now() <= lastClickTS + 1000) {
				nextMark = true;
			} 
			else {
				nextMark = false;
			}

			console.log("next mark? ", nextMark ? "yes" : "no");

			if (!nextMark) {
				if (currentMarkId == -1) {
					currentMarkId = 0;
					chrome.action.setBadgeBackgroundColor({ color: '#ffffff' }, () => {
						chrome.action.setBadgeText({ tabId: tabs[0].id, text: marks[currentMarkId] });
					});

				} else {
					chrome.action.setBadgeBackgroundColor({ color: '#ffffff' }, () => {
						chrome.action.setBadgeText({ tabId: tabs[0].id, text: '' });
					});
					currentMarkId = -1;
				}
			}

			if (nextMark) {
				currentMarkId = currentMarkId + 1 >= marks.length ? 0 : currentMarkId + 1;
				console.log("WTF SET currentMarkId: ", currentMarkId);
				chrome.action.setBadgeBackgroundColor({ color: '#ffffff' }, () => {
					chrome.action.setBadgeText({ tabId: tabs[0].id, text: marks[currentMarkId] });
				});
			}

			console.log("currentMarkId? ", currentMarkId);
			var currentTS = Date.now();

			chrome.storage.local.set({
				[`lastClickTS:${tabUrl}`]: currentTS,
				[`currentMarkId:${tabUrl}`]: currentMarkId,
				[`nextMark:${tabUrl}`]: nextMark
			}, function () {
				console.log("SET currentTS: ", currentTS);
				console.log("SET currentMarkId: ", currentMarkId);
			});
		});

		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ['js/func.js'],
		});
	});
});

chrome.webNavigation.onCompleted.addListener(function (details) {
	var tabUrl = details.url;
	chrome.storage.local.remove([`lastClickTS:${tabUrl}`, `currentMarkId:${tabUrl}`, `nextMark:${tabUrl}`], function () {
		console.log("DELETE ITEMS");
	});
}, {
});