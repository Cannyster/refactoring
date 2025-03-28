import fs from "fs";

const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"));
const invoice = JSON.parse(fs.readFileSync("./invoice.json", "utf-8"));

function statement(invoice) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  //Acessando o primeiro elemento para que ele seja iterável

  const format = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    // exibe a linha para esta requisição
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknow type: ${playFor(aPerformance).type}`);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playId];
}

function volumeCreditsFor(aPerformance) {
  let result = 0;

  result += Math.max(aPerformance.audience - 30, 0);

  if ("comedy" === playFor(aPerformance).type) {
    result += Math.floor(aPerformance.audience / 5);
  }

  return result;
}

console.log(statement(invoice));

export { statement, playFor, amountFor, volumeCreditsFor };
