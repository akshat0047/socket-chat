const moment = require('moment');

function formatMessage(username, text, color){
    return{
        username,
        color,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;