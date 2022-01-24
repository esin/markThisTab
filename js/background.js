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
		chrome.storage.local.get(['lastClickTS', 'currentMarkId'], function (items) {
			console.log("GET: ", items.lastClickTS);
			console.log("GET currentMarkId: ", items.currentMarkId);

			currentMarkId = items.currentMarkId == undefined ? -1 : items.currentMarkId;

			var nextMark = false;

			// User clicked again - need to change badge
			if (Date.now() <= items.lastClickTS + 1000) {
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
				// console.log(' ' + currentMarkId + 1 > marks.length ? 0 : currentMarkId + 1 );
				currentMarkId = currentMarkId + 1 >= marks.length ? 0 : currentMarkId + 1;
				console.log("WTF SET currentMarkId: ", currentMarkId);
				chrome.action.setBadgeBackgroundColor({ color: '#ffffff' }, () => {
					chrome.action.setBadgeText({ tabId: tabs[0].id, text: marks[currentMarkId] });
				});
			}


			console.log("currentMarkId? ", currentMarkId);
			var currentTS = Date.now();

			chrome.storage.local.set({
				lastClickTS: currentTS,
				currentMarkId: currentMarkId
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
