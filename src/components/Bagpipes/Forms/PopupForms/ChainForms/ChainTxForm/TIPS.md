# Tips

## 'undefined' issue
an object being wrapped in an 'undefined', is when the fieldName is undefined, so the object is created with name undefined. 

## Field Object and Resolved Fields

the fieldObject we pass into RecursiveFieldRenderer is the resolvedFields. resolvedFields is the fully nested object. This is too big to save in the formData (zustand). So we pass it and use the required parts of it to save to the zustand state. 

## Naming fields 


## When variant does not render

There have been multiple time sthat the selected variant already nested in an object does not render its fields. And it is typically related to the selected variant not matching with the formData, which is because it may be nested within the formData incorrectly. 
