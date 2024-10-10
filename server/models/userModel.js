import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: 'Available',
    },
    profilePic: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
userSchema.methods.generateAuthToken = async function () {
  try {
    const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
    console.log(ADMIN_USER_ID)
    console.log(this._id)
    let token = jwt.sign(
      { id: this._id, email: this.email, role: this._id?.toString() === ADMIN_USER_ID ? "admin" : "guest" },
      process.env.SECRET,
      {
        expiresIn: '24h',
      }
    );

    return token;
  } catch (error) {
    console.log('error while generating token');
  }
};

const userModel = mongoose.model('User', userSchema);
export default userModel;
