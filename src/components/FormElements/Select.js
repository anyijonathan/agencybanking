import React from 'react'
import { Form } from 'react-bootstrap'

export function Select({ label, type = "text", placeholder = "", formik, name, options = [], ...props }) {
  return (
    <Form.Group className="mb-9">
      {label && <label>{label}</label>}
      <Form.Select size="lg" className={` ${formik.touched[name] && formik.errors[name] ? "border border-danger" : ""}`}
        value={formik.values[name]} onChange={formik.handleChange} name={name} id={name} {...props}
      >
        <option value="">Please Select</option>
        {options && options.map((opt, key) => (
          <option key={key} value={opt?.value}> {opt?.label} </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}
