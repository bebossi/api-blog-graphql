"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });
      Message.belongsTo(models.User, {
        foreignKey: "recipientId",
        as: "recipient",
      });
    }
  }
  Message.init(
    {
      content: DataTypes.STRING,
      chatId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: uuidv4(),
      },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
