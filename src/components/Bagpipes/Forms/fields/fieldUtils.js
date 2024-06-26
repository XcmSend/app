export const findFieldByKey = (key, formSections) => {
    for (const section of formSections) {
      const field = section.fields.find(field => field.key === key);
      if (field) {
        return field;
      }
    }
    return null;
  };