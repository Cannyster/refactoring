import {
  statement,
  playFor,
  amountFor,
  volumeCreditsFor,
  formatCurrencyBRL,
  totalVolumeCredits,
} from "../src/code.js";
import fs from "fs";

const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"));
const invoice = JSON.parse(fs.readFileSync("./invoice.json", "utf-8"));

describe("Função statement", () => {
  test("deve trazer o valor formatado em Real Brasileiro", () => {
    const result = formatCurrencyBRL(65000 / 100);

    const expected = `R$ 650,00`;
    expect(result).toBe(expected);
  });

  test("deve trazer o volume de credito da primeira peça", () => {
    const performance = invoice.performances[0];
    const result = volumeCreditsFor(performance);

    const expected = 25;
    expect(result).toBe(expected);
  });

  test("deve trazer o Id da primeira peça", () => {
    const performance = invoice.performances[0];
    const result = playFor(performance).name;

    const expected = "Hamlet";

    expect(result).toBe(expected);
  });

  test("deve calcular o valor corretamente da primeira peça", () => {
    const result = amountFor(invoice.performances[0]);

    const expected = 65000;
    expect(result).toBe(expected);
  });

  test("deve gerar o relatório corretamente", () => {
    const result = statement(invoice);

    const expected = `Statement for BigCo
 Hamlet: R$ 650,00 (55 seats)
 As You Like It: R$ 580,00 (35 seats)
 Othello: R$ 500,00 (40 seats)
Amount owed is R$ 1.730,00
You earned 47 credits
`;

    expect(result).toBe(expected);
  });
});
