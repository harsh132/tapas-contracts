import numeral from "numeral";

export const formatNumber = (number: number | string) => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (isNaN(number)) {
    return "-";
  }

  if (number === 0) {
    return "0";
  }

  if (number >= 1) {
    if (number > 99999) {
      return numeral(number).format("0.[0]a");
    }
    if (number > 9999) {
      return numeral(number).format("0.[00]a");
    }
    return numeral(number).format("0.[00]");
  }
  if (number < 0.0001) {
    return "<0.0001";
  }
  if (number < 0.001) {
    return numeral(number).format("0.0[0000]");
  }
  if (number < 1) {
    return numeral(number).format("0.00[00]");
  }

  return numeral(number).format("0.[00]");
};

export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Use padStart to ensure two digits for minutes and seconds
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  const formattedDate = `${day}/${month}/${year}, ${hours}:${formattedMinutes}:${formattedSeconds}`;

  return formattedDate;
}
