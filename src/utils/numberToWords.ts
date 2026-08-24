/**
 * Converts numbers to words in ERPNext standard currency format
 */

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertLessThanOneThousand(num: number): string {
  let current;
  if (num % 100 < 20) {
    current = ones[num % 100];
    num = Math.floor(num / 100);
  } else {
    current = ones[num % 10];
    num = Math.floor(num / 10);
    current = tens[num % 10] + (current ? '-' + current : '');
    num = Math.floor(num / 10);
  }
  if (num === 0) return current;
  return ones[num] + ' Hundred' + (current ? ' and ' + current : '');
}

export function numberToKenyanShillings(num: number): string {
  if (num === 0) return 'Zero Kenyan Shillings Only';

  const numStr = num.toFixed(2);
  const parts = numStr.split('.');
  let integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);

  let words = '';

  if (integerPart >= 1000000) {
    const millions = Math.floor(integerPart / 1000000);
    words += convertLessThanOneThousand(millions) + ' Million ';
    integerPart %= 1000000;
  }

  if (integerPart >= 1000) {
    const thousands = Math.floor(integerPart / 1000);
    words += convertLessThanOneThousand(thousands) + ' Thousand ';
    integerPart %= 1000;
  }

  if (integerPart > 0) {
    words += convertLessThanOneThousand(integerPart) + ' ';
  }

  words = words.trim() + ' Kenyan Shillings';

  if (decimalPart > 0) {
    words += ' and ' + convertLessThanOneThousand(decimalPart) + ' Cents';
  }

  return words + ' Only';
}
