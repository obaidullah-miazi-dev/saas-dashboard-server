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

const findUserById = (id)=>{
    return usersCollection.findOne({_id: id})
}

module.exports = {
    initUsersCollection,
    findUserByEmail,
    createUser,
    findUserById
}

