function extractValidationErrors(details: any): string {
  if (typeof details === 'string') {
    return details;
  }

  if (Array.isArray(details)) {
    return details.join('، ');
  }

  if (typeof details === 'object') {
    const errors = Object.entries(details)
      .map(([field, errors]) => {
        if (Array.isArray(errors)) {
          return errors.join('، ');
        }
        return errors;
      })
      .filter(Boolean);
    return errors.join('، ');
  }

  return 'البيانات المدخلة غير صحيحة';
}
