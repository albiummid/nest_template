export const cleanFalsyValues = (data: any, replaceValue = null): any => {
  const falsyValues = new Set([null, undefined, '', 'null', 'undefined']);
  if (falsyValues.has(data)) return replaceValue;

  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    data.forEach((v, i) => {
      if (falsyValues.has(v)) data[i] = replaceValue;
      else cleanFalsyValues(v, replaceValue);
    });
  } else {
    Object.keys(data).forEach((k) => {
      const v = data[k];
      if (falsyValues.has(v)) data[k] = replaceValue;
      else cleanFalsyValues(v, replaceValue);
    });
  }

  return data;
};

export const enumToString = (data: any, excludeValues?: any[]): string => {
  const enumToArrayObject: any = Object?.keys(data)
    ?.filter((key) => isNaN(Number(key)))
    ?.map((key) => ({ key: key, value: data[key] }))
    ?.filter(({ value }) => !excludeValues?.includes(value));

  return (
    enumToArrayObject
      ?.map(({ key, value }) => key + ' = ' + value)
      .join('  ||  ') ?? null
  );
};

export const enumValuesToArray = (data: any, excludeValues?: any[]): any => {
  const enumToArrayObject: any[] = Object?.keys(data)
    ?.filter((key) => isNaN(Number(key)))
    ?.map((key) => ({ key: key, value: data[key] }))
    ?.filter(({ value }) => !excludeValues?.includes(value));

  return enumToArrayObject?.map(({ value }) => value) ?? [];
};

export const enumValuesToObject = (
  data: any,
  excludeValues?: any[],
): Record<string, number> => {
  return Object.keys(data)
    .filter((key) => isNaN(Number(key))) // Only enum names
    .filter((key) => !excludeValues?.includes(data[key])) // Exclude specific values
    .reduce(
      (acc, key) => {
        acc[key] = data[key];
        return acc;
      },
      {} as Record<string, number>,
    );
};

export const getEnumKeyFromValue = (enumReference: any, value: any): any => {
  if (!value) return null;
  return (Object.keys(enumReference) as Array<keyof typeof enumReference>).find(
    (key) => enumReference[key] === value,
  );
};
