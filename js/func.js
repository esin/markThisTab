function processIcon() {
    var el = document.querySelectorAll('head link[rel*="icon"]');
    //  if (!el) {
    //       el = document.createElement("link");
    //       el.setAttribute("rel", "shortcut icon");
    //       document.head.appendChild(link);
    //     }
    if (el) {

        var faviconUrl = el.href || window.location.origin + "/favicon.ico";

        // Remove existing favicons
        Array.prototype.forEach.call(el, function (node) {
            node.parentNode.removeChild(node);
        });

        var img = document.createElement("img");
        img.addEventListener("load", function () {
            var canvas = document.createElement("canvas");
            canvas.width = 16;
            canvas.height = 16;
            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0, 16, 16);

            context.beginPath();
            context.moveTo(0, 16);
            context.lineTo(16, 16);
            context.lineWidth = 4;
            context.strokeStyle = '#ff0000';
            context.stroke();

            var link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = canvas.toDataURL();

            document.getElementsByTagName('head')[0].appendChild(link);
        });
        img.src = faviconUrl;
    }

    return true;
};

//alert("yep, i'm working");
processIcon();
