import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../Components/ErrorMessage.jsx";
import Loader from "../Components/Loader.jsx";
import { UNIVERSITIES } from "../constants/universities";
import {
  CLUB_FIELD_MAP,
  createClub,
  getClub,
  updateClub,
} from "../services/clubsApi";
import { mapFieldErrors } from "../services/formErrors";
import "./CreateEvent.css";

const emptyClub = {
  name: "",
  university: "",
  description: "",
  contactEmail: "",
  logoUrl: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Client-side checks run before we send anything to the server.
function validate(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Club name is required.";
  else if (form.name.trim().length > 100) {
    errors.name = "Club name must be 100 characters or fewer.";
  }
  if (!form.university) errors.university = "Choose a university.";
  if (!form.description.trim()) errors.description = "Add a short description.";
  if (form.contactEmail.trim() && !EMAIL_PATTERN.test(form.contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email address.";
  }
  if (form.logoUrl.trim() && !/^https?:\/\//i.test(form.logoUrl.trim())) {
    errors.logoUrl = "Logo URL must start with http:// or https://.";
  }

  return errors;
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span className="field-error" id={id}>
      {message}
    </span>
  );
}

// Loads one club for the edit page (same pattern as useEvent).
function useClub(id) {
  const [result, setResult] = useState({ key: null, club: null, error: null });
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${id}|${reloadCount}`;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getClub(id)
      .then((club) => {
        if (!cancelled) setResult({ key: requestKey, club, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: requestKey, club: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [id, requestKey]);

  const loading = Boolean(id) && result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    club: loading ? null : result.club,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}

// The form itself. `initialValues` is the club being edited (or emptyClub).
function ClubFormFields({ clubId, initialValues, successMessage }) {
  const navigate = useNavigate();
  const isEdit = Boolean(clubId);

  const [form, setForm] = useState(initialValues);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(successMessage ?? "");
  const [saving, setSaving] = useState(false);

  const clientErrors = useMemo(() => validate(form), [form]);
  const errors = { ...(showErrors ? clientErrors : {}), ...serverErrors };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSuccess("");
    setServerErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);
    setFormError("");
    setSuccess("");

    // Check required fields before sending.
    if (Object.keys(clientErrors).length > 0) return;

    setSaving(true);
    try {
      if (isEdit) {
        const updated = await updateClub(clubId, form);
        setForm({ ...emptyClub, ...updated });
        setServerErrors({});
        setSuccess("Club saved.");
      } else {
        const created = await createClub(form);
        // Go to the new club's edit page; the message is passed in router state.
        navigate(`/clubs/${created.id}/edit`, {
          replace: true,
          state: { success: `"${created.name}" was created.` },
        });
      }
    } catch (error) {
      // 400: show each server error next to its field.
      const fieldErrors = mapFieldErrors(error.fieldErrors, CLUB_FIELD_MAP);
      setServerErrors(fieldErrors);

      if (error.status === 0) {
        setFormError("We could not reach the server. Check your connection and try again.");
      } else if (error.status === 404) {
        setFormError("This club no longer exists.");
      } else if (Object.keys(fieldErrors).length > 0) {
        setFormError("Please fix the highlighted fields and try again.");
      } else {
        setFormError(error.message || "Something went wrong while saving the club.");
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (name, id) => ({
    id,
    name,
    value: form[name],
    onChange: updateField,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-error` : undefined,
  });

  return (
    <form
      className="event-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={saving}
    >
      <fieldset className="form-fieldset" disabled={saving}>
        <div className="form-section">
          <div className="form-section-heading">
            <h2>Club details</h2>
            <p>Fields marked * are required.</p>
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="club-name">Club name *</label>
            <input
              {...fieldProps("name", "club-name")}
              placeholder="e.g. Strathmore Tech Society"
            />
            <FieldError id="club-name-error" message={errors.name} />
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="club-university">University *</label>
            <select {...fieldProps("university", "club-university")}>
              <option value="">Select a university</option>
              {UNIVERSITIES.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
            <FieldError id="club-university-error" message={errors.university} />
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="club-description">Description *</label>
            <textarea
              {...fieldProps("description", "club-description")}
              rows="4"
              placeholder="What does your club do?"
            />
            <FieldError
              id="club-description-error"
              message={errors.description}
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="club-email">Contact email</label>
              <input
                {...fieldProps("contactEmail", "club-email")}
                type="email"
                placeholder="club@university.ac.ke"
              />
              <FieldError id="club-email-error" message={errors.contactEmail} />
            </div>

            <div className="form-field">
              <label htmlFor="club-logo">Logo URL</label>
              <input
                {...fieldProps("logoUrl", "club-logo")}
                type="url"
                placeholder="https://example.com/logo.png"
              />
              <FieldError id="club-logo-error" message={errors.logoUrl} />
            </div>
          </div>
        </div>
      </fieldset>

      {formError && (
        <div className="form-error" role="alert">
          {formError}
        </div>
      )}

      {success && (
        <div className="form-success" role="status">
          <strong>{success}</strong>
          <Link to="/create">Create an event for this club →</Link>
        </div>
      )}

      <div className="form-actions">
        <Link className="secondary-action link-as-button" to="/create">
          Cancel
        </Link>
        <button
          type="submit"
          className="primary-action form-submit"
          disabled={saving}
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create club"}
        </button>
      </div>
    </form>
  );
}

// One page for both /clubs/new and /clubs/:id/edit.
function ClubForm() {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = Boolean(id);
  const { club, loading, error, refetch } = useClub(id);

  return (
    <section className="create-event-page form-page-narrow">
      <div className="create-event-header">
        <div>
          <p className="eyebrow">{isEdit ? "Edit club" : "New club"}</p>
          <h1>{isEdit ? "Update your club." : "Bring your club to UniVent."}</h1>
          <p className="create-event-intro">
            Clubs host events. Each club belongs to one university, and its
            events are listed under that university.
          </p>
        </div>
      </div>

      <div className="create-event-layout">
        {isEdit && loading && <Loader label="Loading club…" />}
        {isEdit && !loading && error && (
          <ErrorMessage
            error={error}
            onRetry={error.status === 404 ? undefined : refetch}
          />
        )}
        {(!isEdit || club) && (
          <ClubFormFields
            // Re-mount the form when switching between clubs.
            key={id ?? "new"}
            clubId={id}
            initialValues={club ? { ...emptyClub, ...club } : emptyClub}
            successMessage={location.state?.success}
          />
        )}
      </div>
    </section>
  );
}

export default ClubForm;