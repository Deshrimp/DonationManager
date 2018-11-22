module.exports = function(sequelize, DataTypes) {
  var items = sequelize.define("items", {
    rfc: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "centers",
        key: "rfc"
      },
      validate: {
        len: [1]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        len: [1]
      }
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  })
  return items
}
