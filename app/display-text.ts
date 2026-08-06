export function displayHeading(value: string) {
  return value
    .trim()
    .replace(/\.\s+(?=\S)/g, ": ")
    .replace(/\.+$/g, "");
}
