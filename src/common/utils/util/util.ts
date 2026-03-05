/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const cleanFalsyValues = (data: any, replaceValue: any = null): any => {
  const falsyValues = new Set<any>([null, undefined, '', 'null', 'undefined']);
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

export const enumToString = (
  data: Record<string, any>,
  excludeValues?: any[],
): string => {
  const enumToArrayObject = Object.keys(data)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({ key: key, value: data[key] }))
    .filter(({ value }) => !excludeValues?.includes(value));

  return (
    enumToArrayObject
      .map(({ key, value }: { key: string; value: any }) => `${key} = ${value}`)
      .join('  ||  ') || ''
  );
};

export const enumValuesToArray = (
  data: Record<string, any>,
  excludeValues?: any[],
): any[] => {
  const enumToArrayObject = Object.keys(data)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({ key: key, value: data[key] }))
    .filter(({ value }) => !excludeValues?.includes(value));

  return enumToArrayObject.map(({ value }: { value: any }) => value);
};

export const enumValuesToObject = (
  data: Record<string, any>,
  excludeValues?: any[],
): Record<string, any> => {
  return Object.keys(data)
    .filter((key) => isNaN(Number(key))) // Only enum names
    .filter((key) => !excludeValues?.includes(data[key])) // Exclude specific values
    .reduce(
      (acc, key) => {
        acc[key] = data[key];
        return acc;
      },
      {} as Record<string, any>,
    );
};

export const getEnumKeyFromValue = (
  enumReference: Record<string, any>,
  value: any,
): string | undefined => {
  if (value === null || value === undefined) return undefined;
  return Object.keys(enumReference).find((key) => enumReference[key] === value);
};
