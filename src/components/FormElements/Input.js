import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Form } from 'react-bootstrap';

export function Input({
  label,
  pattern,
  inputmode,
  maxlength,
  type,
  placeholder = '',
  formik,
  name,
  passwordToggleFunction,
  passwordType,
  showError = false,
  ...props
}) {
  return (
    <Form.Group className="mb-9">
      {label && <label>{label}</label>}
      <div className="d-flex align-items-center w-100">
        <Form.Control
          size="lg"
          inputMode={inputmode}
          pattern={pattern}
          maxLength={maxlength}
          className={`${
            formik.touched[name] && formik.errors[name] ? 'border border-danger' : null
          }`}
          onChange={formik.handleChange}
          name={name}
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          {...props}
        />
        <div
          style={{ marginLeft: '-45px', cursor: 'pointer', width: '40px', height: '40px' }}
          className={`d-flex align-items-center justify-content-center ${
            type && type !== 'password' && type !== 'text' && 'd-none'
          }`}
        >
          {type === 'password' && (
            <FontAwesomeIcon icon={faEyeSlash} onClick={passwordToggleFunction} />
          )}
          {type && type === 'text' && (
            <FontAwesomeIcon icon={faEye} onClick={passwordToggleFunction} />
          )}
        </div>
      </div>

      {showError && formik.touched[name] && formik.errors[name] && (
        <p className="text-danger">{formik.errors[name]}</p>
      )}
    </Form.Group>
  );
}
