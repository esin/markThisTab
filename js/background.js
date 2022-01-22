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

chrome.action.onClicked.addListener((tab) => {

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.action.setBadgeBackgroundColor({ color: '#ffffff' }, () => {
			chrome.action.setBadgeText({ tabId: tabs[0].id, text: ' 🟢' });
		});
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ['js/func.js'],
		});
	});
});
