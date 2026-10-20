"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./EnquiryForm.module.css";

type EnquiryValues = { name: string; email: string; message: string };
type FieldName = keyof EnquiryValues;
type EnquiryErrors = Partial<Record<FieldName, string>>;

function validate(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.message.trim())
    errors.message = "Please tell us about your project.";
  return errors;
}

export function EnquiryForm() {
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [isComplete, setIsComplete] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values: EnquiryValues = {
      name: nameInput.current?.value ?? "",
      email: emailInput.current?.value ?? "",
      message: messageInput.current?.value ?? "",
    };
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setIsComplete(false);
    if (nextErrors.name) {
      nameInput.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailInput.current?.focus();
      return;
    }
    if (nextErrors.message) {
      messageInput.current?.focus();
      return;
    }
    // Keep the demo local. Clear the fields without sending or saving their values.
    event.currentTarget.reset();
    setIsComplete(true);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={() => setIsComplete(false)}
      noValidate
      aria-label="Demo project enquiry"
    >
      <p id="demo-notice">
        Demo form. Entries stay on this page only. Nothing is sent or saved.
      </p>
      <div className={styles.field}>
        <label htmlFor="enquiry-name">Name (required)</label>
        <input
          ref={nameInput}
          id="enquiry-name"
          type="text"
          autoComplete="off"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={
            errors.name ? "name-error demo-notice" : "demo-notice"
          }
        />
        {errors.name && (
          <p id="name-error" className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="enquiry-email">Email (required)</label>
        <input
          ref={emailInput}
          id="enquiry-email"
          type="email"
          autoComplete="off"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="enquiry-message">
          Tell us about your project (required)
        </label>
        <textarea
          ref={messageInput}
          id="enquiry-message"
          rows={4}
          autoComplete="off"
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>
      <button type="submit" className={styles.submit}>
        Discuss your project
      </button>
      <p className={styles.status} role="status">
        {isComplete
          ? "Demo only — your enquiry has not been sent or saved."
          : ""}
      </p>
    </form>
  );
}
