

function readLegend() {
    var reader = new FileReader();

    var fileUrl = chrome.extension.getURL("translation_legend.txt");

    var text = reader.readAsText(fileUrl);
}