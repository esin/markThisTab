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

chrome.action.onClicked.addListener((tab) => {
	console.log('---BEGIN');
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		var tabUrl = tabs[0].url
		console.log(tabUrl);
		chrome.storage.local.get([`lastClickTS:${tabUrl}`, `currentMarkId:${tabUrl}`], function (items) {
			// console.log("GET1: ", Object.values(items)[1]);
			// console.log("GET: ", items.lastClickTS);
			// console.log("GET currentMarkId: ", items.currentMarkId);

			currentMarkId = Object.values(items)[0] == undefined ? -1 : Object.values(items)[0];
			var lastClickTS = Object.values(items)[1] == undefined ? -1 : Object.values(items)[1];
			var nextMark = false;

			// User clicked again - need to change badge
			if (Date.now() <= lastClickTS + 1000) {
				nextMark = true;
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
				[`currentMarkId:${tabUrl}`]: currentMarkId
			}, function () {
				console.log("SET: ", currentTS);
				console.log("SET currentMarkId: ", currentMarkId);
			});
		});

		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ['js/func.js'],
		});
	});
});
