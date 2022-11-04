import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { emailRegex } from '../common/utils'
import { environment } from '../common/environment'

// interfaces are not exported in typescript
export interface User extends mongoose.Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string): Promise<User>
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

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email })
}

const hashPassword = (obj, next) => {
    bcrypt.hash(obj['password'], environment.security.saltRounds)
        .then(hash => {
            obj['password'] = hash
            next()
        })
        .catch(next)
}

const saveMiddleware = function (next) {
    const user: User = <User>this
    if (!user.isModified('password')) {
        next()
    } else {
        hashPassword(user, next)
    }
}

const updateMiddleware = function (next) {
    const user: User = <User>this
    if (!this.getUpdate()['password']) {
        next()
    } else {
        hashPassword(this.getUpdate(), next)
    }
}

// Encrypt password before save
userSchema.pre('save', saveMiddleware)

// Encrypt password before update (patch)
userSchema.pre('findOneAndUpdate', updateMiddleware)

// Encrypt password before update (put)
userSchema.pre('replaceOne', updateMiddleware)

export const User = mongoose.model<User, UserModel>('User', userSchema)