import * as mongoose from 'mongoose'
import { emailRegex } from '../common/utils'

// interfaces are not exported in typescript
export interface User extends mongoose.Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter a Name'],
        minlength: 3
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,// [true, 'This email is already being used'],
        trim: true,
        required: true,
        match: [emailRegex, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        select: false,
        required: true,
        minlength: 6
    }
})

export const User = mongoose.model<User>('User', userSchema)