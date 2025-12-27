let usersCollection;

const initUsersCollection = (db)=>{
    usersCollection = db.collection('users')
}

const findUserByEmail = (email)=>{
    return usersCollection.findOne({email})
}

const createUser = (user)=>{
    return usersCollection.insertOne(user)
}

module.exports = {
    initUsersCollection,
    findUserByEmail,
    createUser
}

