import User from "./user";
import Note from "./note";
import RefreshToken from "./refreshToken";

Note.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export { User, Note, RefreshToken };