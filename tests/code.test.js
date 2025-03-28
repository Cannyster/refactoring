import statement from "../src/code.js";
import fs from "fs";

const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"));
const invoice = JSON.parse(fs.readFileSync("./invoice.json", "utf-8"));

describe("Função statement", () => {
  test("deve gerar o relatório corretamente", () => {
    const result = statement(invoice, plays);

    const expected = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`;

    expect(result).toBe(expected);
  });
});
