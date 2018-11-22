import React from "react"

export default ({ handleChange, value, index }) => (
  <div>
    <input
      name="quantity"
      type="number"
      onChange={handleChange}
      value={value}
      data-index={index}
    />
    <button name="subtract" data-index={index} onClick={handleChange}>
      -
    </button>
    <button name="add" data-index={index} onClick={handleChange}>
      +
    </button>
  </div>
)
