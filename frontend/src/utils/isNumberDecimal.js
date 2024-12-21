export default function isNumberDecimal(num) {
  if (num.toFixed(2) % 1 !== 0) {
    return num.toFixed(2);
  } else {
    return Math.trunc(num) + ".-";
  }
}
