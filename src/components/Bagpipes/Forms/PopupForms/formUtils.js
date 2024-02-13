export const isFieldVisible = (field, formValues, showAdvancedSettings) => {
  if (!field) return false;

  if (field.advanced && !showAdvancedSettings) return false;

  if (field.dependsOn) {
    const conditions = field.dependsOn.split("&&");
    return conditions.every(condition => {
      const [key, value] = condition.trim().split("=");
      return formValues[key] === value;
    });
  }

  return true;
};

