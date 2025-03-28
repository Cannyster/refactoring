import fs from "fs";

const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"));
const invoice = JSON.parse(fs.readFileSync("./invoice.json", "utf-8"));

function statement(invoice) {
  let result = `Statement for ${invoice.customer}\n`;
  //Acessando o primeiro elemento para que ele seja iterável
  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${formatCurrencyBRL(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${formatCurrencyBRL(calcTotalAmount(invoice))}\n`;

  result += `You earned ${totalVolumeCredits(invoice)} credits\n`;
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

function formatCurrencyBRL(aNumber) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
    .format(aNumber / 100)
    .replace(/\u00A0/g, " "); // <- substitui o NBSP por espaço comum;
}

function totalVolumeCredits(invoice) {
  let total = 0;
  for (let perf of invoice.performances) {
    total += volumeCreditsFor(perf);
  }
  return total;
}

function calcTotalAmount(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result;
}

console.log(statement(invoice));

export {
  statement,
  playFor,
  amountFor,
  volumeCreditsFor,
  formatCurrencyBRL,
  totalVolumeCredits,
  calcTotalAmount,
};
