import mongoose from "mongoose"

export interface IUser extends mongoose.Document {
  email: string
  stripeCustomerId?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
