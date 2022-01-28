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
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		var tabUrl = tabs[0].url
		currentURL = tabUrl;
		chrome.storage.local.get([`currentMarkId:${tabUrl}`, `faviconUrl:${tabUrl}`, `lastClickTS:${tabUrl}`, `nextMark:${tabUrl}`], function (items) {

			var lastClickTS = Object.values(items)[1] == undefined ? -1 : Object.values(items)[1];
			currentMarkId = Object.values(items)[0] == undefined ? -1 : Object.values(items)[0];
			nextMark = Object.values(items)[2] == undefined ? false : Object.values(items)[2];
			var faviconUrlStorage = Object.values(items)[3];

			// User clicked again - need to change badge
			if (Date.now() <= lastClickTS + 1000) {
				nextMark = true;
			} 
			else {
				nextMark = false;
			}

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
				currentMarkId = currentMarkId + 1 > marks.length ? 0 : currentMarkId + 1;
				chrome.action.setBadgeBackgroundColor({ color: '#ffffff' }, () => {
					chrome.action.setBadgeText({ tabId: tabs[0].id, text: marks[currentMarkId] });
				});
			}

			var currentTS = Date.now();

			chrome.storage.local.set({
				[`currentMarkId:${tabUrl}`]: currentMarkId,
				[`faviconUrl:${tabUrl}`]: faviconUrlStorage,
				[`lastClickTS:${tabUrl}`]: currentTS,
				[`nextMark:${tabUrl}`]: nextMark
			}, function () {
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
	chrome.storage.local.remove([`lastClickTS:${tabUrl}`, `currentMarkId:${tabUrl}`, `nextMark:${tabUrl}`, `faviconUrl:${tabUrl}`], function () {

	});
}, {
});