import React from "react"
import categories from "../../data/categories"

const Categories = categories.map(({ category, categoria }) => (
  <option key={category} value={category}>
    {categoria}
  </option>
))

export default ({ index, value, handleChange }) => (
  <select
    data-index={index}
    value={value}
    onChange={handleChange}
    name="category"
  >
    {Categories}
  </select>
)
