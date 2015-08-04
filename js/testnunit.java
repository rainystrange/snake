public class UnitTest1 {
	public void TestCalculatorIncomeTax() {
		TaxCalculator taxCalculator = new TaxCalculator();
		double salary = 0;
		double expectedIncomeTax = 0;

		//case 1.1: Salary <= 5000
		salary = 5000;
		expectedIncomeTax = 0;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));
		//case 1.2
		salary = 4900;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));

		//case 2: 5000 < salary <= 15000
		salary = 10000;
		expectedIncomeTax = 250;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));

		//case 3: 10000 < salary <= 15000
		salary = 15000;
		expectedIncomeTax = 750;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));

		//case 4: 15000 < salary <=20000
		salary = 20000;
		expectedIncomeTax = 1500;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));

		//case 5: 20000 < salary <= 30000
		salary = 30000;
		expectedIncomeTax = 3500;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));

		//case 6: salary > 30000
		salary = 31000;
		expectedIncomeTax = 3530;
		Assert.AreEqual(expectedIncomeTax, taxCalculator.calculatorIncomeTax(salary));
	}
}

public class TaxCalculator {
	public double calculatorIncomeTax(double ) {
		double incomeTax = 0;
		if (salary <= 5000) {
			incomeTax = salary * 0;
		} else if (salary <= 10000) {
			incomeTax = (salary - 5000) * 0.005;
		} else if (salary <= 15000) {
			incomeTax = (salary - 10000) * 0.01 + 25;
		} else if (salary <= 20000) {
			incomeTax = (salary - 15000) * 0.015 + 75;
		}

		return incomeTax;
	}
}

//2 class in the same project