function draw(context) {

    // Green circle
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(4, 12, 5, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = "#177305";
    context.beginPath();
    context.arc(4, 12, 3, 0, 2 * Math.PI);
    context.fill();

}

function processIcon() {

    // chrome.storage.local.get(['lastClickTS', 'currentMarkId'], function (items) {
    //     console.log("GET: ", items.lastClickTS);
    //     console.log("GET currentMarkId: ", items.currentMarkId);
    // });

    var el = document.querySelectorAll('head link[rel~="icon"], head link[rel~="shortcut icon"]');

    var faviconUrl = window.location.origin + "/favicon.ico";
    
    // var faviconUrl = 'chrome://favicon/' + request.url; // waiting https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/
    // https://docs.google.com/document/d/1ksvSq1zF-9jYSfGOvNluyoTV0Ud9xl6r9HiAKONqmz8/edit

    if (el) {
        if (el.length > 0) {
            faviconUrl = el[0].href;
        }
    }

    // console.log(faviconUrl);
    // Remove existing favicons
    Array.prototype.forEach.call(el, function (node) {
        node.parentNode.removeChild(node);
    });

    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    var context = canvas.getContext("2d");

    var img = document.createElement("img");

    img.addEventListener("load", function () {
        context.drawImage(img, 0, 0, 16, 16);
        draw(context);

        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = canvas.toDataURL();

        document.getElementsByTagName('head')[0].appendChild(link);
    });

    // If something goes wrong with icon, just draw empty icon
    img.addEventListener("error", function () {

        context.clearRect(0, 0, 16, 16);
        draw(context);

        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = canvas.toDataURL();

        document.getElementsByTagName('head')[0].appendChild(link);
    });

    img.src = faviconUrl;


    return true;
};

processIcon();
