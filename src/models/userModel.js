let usersCollection;

const initUsersCollection = (db)=>{
    usersCollection = db.collection('users')
}

const findUserByEmail = (email)=>{
    return usersCollection.findOne({email})
}

