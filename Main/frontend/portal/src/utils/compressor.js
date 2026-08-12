/**
 * LoRa Payload Compressor
 * Enforces SRS Section 3.4 payload constraint (< 256 bytes)
 * Maps long form field names to ultra-short JSON keys:
 * n -> Victim Name
 * a -> Victim Age
 * l -> Location Context
 * c -> Condition / Text Description
 */

export const compressSosPayload = (formData) => {
  const compressed = {
    n: formData.name ? formData.name.trim().substring(0, 30) : 'Anon',
    a: formData.age ? parseInt(formData.age, 10) : 0,
    l: formData.locationContext ? formData.locationContext.trim().substring(0, 50) : 'Unknown',
    c: formData.rawText ? formData.rawText.trim().substring(0, 140) : '',
  };

  const jsonString = JSON.stringify(compressed);
  const byteSize = new Blob([jsonString]).size;

  return {
    compressed,
    jsonString,
    byteSize,
    isValid: byteSize <= 256,
  };
};
