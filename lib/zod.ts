export const parseDateTime = (str: string) => {
  const parts = str.split("/")
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
}

export const refineDateTime = (date: Date) => date instanceof Date && !isNaN(date.getTime());
