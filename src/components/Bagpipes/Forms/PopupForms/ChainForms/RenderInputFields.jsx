const renderInputFields = (typeDefinition) => {
    switch (typeDefinition.definition.type) {
      case 'Composite':
        return (
          <div>
            {typeDefinition.definition.fields.map(field => (
              <input
                key={field.name}
                type="text"
                placeholder={field.name || field.typeName}
              />
            ))}
          </div>
        );
      case 'Primitive':
        return <input type={primitiveInputType(typeDefinition.definition.primitiveType)} placeholder={`Enter ${typeDefinition.path}`}/>;
      case 'Array':
        return (
          <div>
            {Array.from({ length: parseInt(typeDefinition.definition.length, 10) }).map((_, index) => (
              <input key={index} type="text" placeholder={`Item ${index + 1}`}/>
            ))}
          </div>
        );
      case 'Sequence':
        return (
          <div>
            <label>{`Enter elements for ${typeDefinition.path}`}</label>
            <input type="text" placeholder="Sequence elements"/>
          </div>
        );
      case 'Variant':
        return (
          <select>
            {typeDefinition.definition.variants.map(variant => (
              <option key={variant.index} value={variant.name}>{variant.name}</option>
            ))}
          </select>
        );
      case 'Unknown':
      default:
        return <input type="text" placeholder="Enter value" />;
    }
  };
  
  const primitiveInputType = (primitiveType) => {
    switch (primitiveType) {
      case 'U8':
      case 'U32':
      case 'U64':
      case 'U128':
        return 'number';
      default:
        return 'text';
    }
  };
  

  export default renderInputFields;