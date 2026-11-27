// Turn an ApiError's fieldErrors (backend names) into form field names.
export function mapFieldErrors(fieldErrors = {}, fieldMap = {}) {
  const result = {};
  for (const [field, message] of Object.entries(fieldErrors)) {
    result[fieldMap[field] ?? field] = message;
  }
  return result;
}