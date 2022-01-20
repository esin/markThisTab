chrome.contextMenus.create({
	id: "mark_tab",
	title: "Mark this tab!",
	contexts: ["all"]
});

// chrome.contextMenus.create({
// 	id: "mark_tab_with_circle",
// 	title: "With circle",
// 	parentId: "mark_tab",
// 	contexts:["all"]
//   });
  

chrome.contextMenus.onClicked.addListener(menu => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ['js/func.js'],
		});
	});
});
