import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({

  username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true

    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true

    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true

    },
    password: {
        type: String,
        required: [true, "password is required"]

    },



},
    {
        timestamps: true

    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)

}
export const User = mongoose.model("User", userSchema)