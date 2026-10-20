"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./EnquiryForm.module.css";

type EnquiryValues = { name: string; email: string; message: string };
type FieldName = keyof EnquiryValues;
type EnquiryErrors = Partial<Record<FieldName, string>>;

function validateField(field: FieldName, value: string): string | undefined {
  const requiredErrors: Record<FieldName, string> = {
    name: "Please enter your name.",
    email: "Please enter your email.",
    message: "Please tell us about your project.",
  };
  if (!value.trim()) {
    return requiredErrors[field];
  }
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  return undefined;
}

function validate(values: EnquiryValues): EnquiryErrors {
  return {
    name: validateField("name", values.name),
    email: validateField("email", values.email),
    message: validateField("message", values.message),
  };
}

export function EnquiryForm() {
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [isComplete, setIsComplete] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);

  const focusAfterValidation = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    // Wait until the error descriptions exist before moving keyboard focus.
    focusAfterValidation.current?.focus();
    focusAfterValidation.current = null;
  }, [errors]);

  function handleFieldChange(field: FieldName, value: string) {
    setIsComplete(false);
    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: validateField(field, value),
      }));
    }
  }

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
      focusAfterValidation.current = nameInput.current;
      return;
    }
    if (nextErrors.email) {
      focusAfterValidation.current = emailInput.current;
      return;
    }
    if (nextErrors.message) {
      focusAfterValidation.current = messageInput.current;
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
          onChange={(event) => handleFieldChange("name", event.currentTarget.value)}
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
          onChange={(event) => handleFieldChange("email", event.currentTarget.value)}
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
          onChange={(event) =>
            handleFieldChange("message", event.currentTarget.value)
          }
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
      <p className={styles.status} role="status" aria-atomic="true">
        {isComplete
          ? "Demo only — your enquiry has not been sent or saved."
          : ""}
      </p>
    </form>
  );
}
