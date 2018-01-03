const scientificToDecimal = (number) => {
  const regexp = /\d+\.?\d*e[\+\-]*\d+/i;

  if (regexp.test(number)) {
    const parts = String(number).toLowerCase().split('e');
    const coefficient = parts[0].split('.');
    const e = parts.pop();
    let length = Math.abs(e);

    if (e / length === -1) {
      number = '0' + '.' + new Array(length).join('0') + coefficient.join('');
    } else {
      const dec = coefficient[1];

      if (dec) {
        length -= dec.length;
      }

      number = coefficient.join('') + new Array(length + 1).join('0');
    }
  }

  return number;
};

export { scientificToDecimal };