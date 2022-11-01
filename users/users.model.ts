import * as mongoose from 'mongoose'

// interfaces are not exported in typescript
export interface User extends mongoose.Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
})

export const User = mongoose.model<User>('User', userSchema)