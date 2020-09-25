const fs = require("fs");

/**
 * In case the index.html is supposed to be used as the options/settings page (via manifest)
 * and the same identical angular application should also be used inside the popup, this
 * little script can help to automate the generation OF an identical popup.html
 * with the correct settings in it. Manifest must then declare index.html for options and popup.html for popup
 *
 * In order to develop very easily, the best practice would be to put the desired extensionMode right into index.html
 * declare index.html for the type of extension you want to test in manifest (say for the popup) and then do an npm start to be
 * able to debug in realtime
 */

fs.readFile("dist/bookmarks/index.html", "utf8", (err, data) => {
  data = data.replace(
    `var extensionMode = 'options';`,
    `var extensionMode = 'popup';`
  );
  fs.writeFileSync("dist/bookmarks/popup.html", data, "utf8");
});
