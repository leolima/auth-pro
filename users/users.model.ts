import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { emailRegex } from '../common/utils'
import { environment } from '../common/environment'

// interfaces are not exported in typescript
export interface User extends mongoose.Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profiles: string[],
    matches(password: string): boolean,
    hasAny(...profiles: string[]): boolean
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>
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
    },
    profiles: {
        type: [String],
        required: false,
    }
})

userSchema.statics.findByEmail = function (email: string, projection: string) {
    return this.findOne({ email }, projection)
}

userSchema.methods.matches = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.hasAny = function (...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
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