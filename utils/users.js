const users = [];

// Join User
function userJoin(id, username, room){
    let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    const user = {id, username, room, color};
    users.push(user);
    return user;
}

// Get User
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin,
    getCurrentUser
}