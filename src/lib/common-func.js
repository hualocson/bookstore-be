const groupByKey = (data, key) =>
  Object.values(
    data.reduce((res, item) => {
      const value = item[key];
      const existing = res[value] || { [key]: value, data: [] };
      return {
        ...res,
        [value]: {
          ...existing,
          data: [...existing.data, item],
        },
      };
    }, {})
  );

export { groupByKey };
