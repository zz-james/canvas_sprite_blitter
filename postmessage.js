/**
 * Created with JetBrains WebStorm.
 * User: james
 * Date: 02/05/13
 * Time: 00:12
 * To change this template use File | Settings | File Templates.
 */

var count = 0;
var messageName = "zero-timeout-message";

function handleMessage(event) {
    event.stopPropagation();
    console.log("boo");
    count++;
    if(count < 500) {
        window.postMessage(messageName, "*");
    }
}

window.addEventListener("message", handleMessage, true);

window.postMessage(messageName, "*");