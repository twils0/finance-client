const getDataset = (element) => {
  const { attributes } = element;
  const dataset = {};

  for (let i = 0; i < attributes.length; i += 1) {
    if (/^data-.*/.test(attributes[i].name)) {
      let key = attributes[i].name.replace('data-', '');
      const value = element.getAttribute(attributes[i].name);

      if (key.indexOf('-') > -1) {
        key = key.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
      }

      dataset[key] = value;
    }
  }

  return dataset;
};

export default getDataset;
