const { add, subtract, multiply, divide } = require("./calculator");
describe("Calculator", () => {
  test("adds 1 + 2 to equal 3", () => { expect(add(1, 2)).toBe(3); });
  test("subtracts 5 - 3 to equal 2", () => { expect(subtract(5, 3)).toBe(2); });
  test("multiplies 2 * 4 to equal 8", () => { expect(multiply(2, 4)).toBe(8); });
  test("divides 10 / 2 to equal 5", () => { expect(divide(10, 2)).toBe(5); });
  test("throws error when dividing by zero", () => { expect(() => divide(10, 0)).toThrow("Cannot divide by zero"); });
});
