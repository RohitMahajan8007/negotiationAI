let negotiations = [];
let users = [];

const getNegotiation = (userId) => {
    return negotiations.find(n => n.userId === userId && n.status === 'negotiating');
};

const saveNegotiation = (neg) => {
    const index = negotiations.findIndex(n => n.userId === neg.userId && n.status === 'negotiating');
    if (index !== -1) {
        negotiations[index] = neg;
    } else {
        if (!neg.status) neg.status = 'negotiating';
        negotiations.push(neg);
    }
    return neg;
};

const getNegotiationsByUserId = (userId) => {
    return negotiations.filter(n => n.userId === userId);
};

const saveUser = (user) => {
    if (!user.credits) user.credits = 10000;
    users.push(user);
    return user;
};

const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};

const findUserByUsername = (username) => {
    return users.find(u => u.username === username);
};

const getAllNegotiations = () => {
    return negotiations;
};

const deleteNegotiation = (userId) => {
    negotiations = negotiations.filter(n => n.userId !== userId);
};

module.exports = { 
    getNegotiation, 
    saveNegotiation, 
    getNegotiationsByUserId, 
    saveUser, 
    findUserByEmail, 
    findUserByUsername, 
    getAllNegotiations,
    deleteNegotiation 
};
