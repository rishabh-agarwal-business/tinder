import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAuthUser extends Document {
    email: string;
    password: string;
    isVerfied: boolean;
    comparePassword(candidate: string): Promise<boolean>;
}

const authUserSchema = new Schema<IAuthUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        isVerfied: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

authUserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

authUserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export const AuthUser = model<IAuthUser>("AuthUser", authUserSchema);