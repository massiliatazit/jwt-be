const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    password: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
    refrechTokens: [{ token: { type: String } }],
  },
  { timestamps: true }
);
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else return null;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userobject = user.toObject();
  delete userobject.password;
  delete userobject.__v;

  return userobject;
};
UserSchema.pre("save", async function (next) {
  // pre hook to hash password before save

  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

module.exports = model("User", UserSchema);
