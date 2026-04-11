import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Converters from './pages/Converters';
import Calculators from './pages/Calculators';
import BMICalculator from './pages/BMICalculator';
import MortgageCalculator from './pages/MortgageCalculator';
import LoanCalculator from './pages/LoanCalculator';
import AutoLoanCalculator from './pages/AutoLoanCalculator';
import InterestCalculator from './pages/InterestCalculator';
import PaymentCalculator from './pages/PaymentCalculator';
import RetirementCalculator from './pages/RetirementCalculator';
import AmortizationCalculator from './pages/AmortizationCalculator';
import InvestmentCalculator from './pages/InvestmentCalculator';
import InflationCalculator from './pages/InflationCalculator';
import FinanceCalculator from './pages/FinanceCalculator';
import IncomeTaxCalculator from './pages/IncomeTaxCalculator';
import CompoundInterestCalculator from './pages/CompoundInterestCalculator';
import SalaryCalculator from './pages/SalaryCalculator';
import InterestRateCalculator from './pages/InterestRateCalculator';
import SalesTaxCalculator from './pages/SalesTaxCalculator';
import GenericCalculator from './pages/GenericCalculator';
import Sitemap from './pages/Sitemap';
import CalorieCalculator from './pages/CalorieCalculator';
import BodyFatCalculator from './pages/BodyFatCalculator';
import BMRCalculator from './pages/BMRCalculator';
import IdealWeightCalculator from './pages/IdealWeightCalculator';
import PaceCalculator from './pages/PaceCalculator';
import PregnancyCalculator from './pages/PregnancyCalculator';
import PregnancyConceptionCalculator from './pages/PregnancyConceptionCalculator';
import DueDateCalculator from './pages/DueDateCalculator';
import ScientificCalculator from './pages/ScientificCalculator';
import FractionCalculator from './pages/FractionCalculator';
import PercentageCalculator from './pages/PercentageCalculator';
import RandomGenerator from './pages/RandomGenerator';
import TriangleCalculator from './pages/TriangleCalculator';
import StdDevCalculator from './pages/StdDevCalculator';
import AgeCalculator from './pages/AgeCalculator';
import DateCalculator from './pages/DateCalculator';
import TimeCalculator from './pages/TimeCalculator';
import GPACalculator from './pages/GPACalculator';
import GradeCalculator from './pages/GradeCalculator';
import ConcreteCalculator from './pages/ConcreteCalculator';
import SubnetCalculator from './pages/SubnetCalculator';
import PasswordGenerator from './pages/PasswordGenerator';
import ConversionCalculator from './pages/ConversionCalculator';
import { ThemeProvider } from './lib/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/converters" element={<Converters />} />
            <Route path="/calculators" element={<Calculators />} />
            
            {/* Financial Calculators */}
            <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
            <Route path="/calculators/loan" element={<LoanCalculator />} />
            <Route path="/calculators/auto-loan" element={<AutoLoanCalculator />} />
            <Route path="/calculators/interest" element={<InterestCalculator />} />
            <Route path="/calculators/payment" element={<PaymentCalculator />} />
            <Route path="/calculators/retirement" element={<RetirementCalculator />} />
            <Route path="/calculators/amortization" element={<AmortizationCalculator />} />
            <Route path="/calculators/investment" element={<InvestmentCalculator />} />
            <Route path="/calculators/inflation" element={<InflationCalculator />} />
            <Route path="/calculators/finance" element={<FinanceCalculator />} />
            <Route path="/calculators/income-tax" element={<IncomeTaxCalculator />} />
            <Route path="/calculators/compound-interest" element={<CompoundInterestCalculator />} />
            <Route path="/calculators/salary" element={<SalaryCalculator />} />
            <Route path="/calculators/interest-rate" element={<InterestRateCalculator />} />
            <Route path="/calculators/sales-tax" element={<SalesTaxCalculator />} />

            {/* Fitness & Health Calculators */}
            <Route path="/calculators/bmi" element={<BMICalculator />} />
            <Route path="/calculators/calorie" element={<CalorieCalculator />} />
            <Route path="/calculators/body-fat" element={<BodyFatCalculator />} />
            <Route path="/calculators/bmr" element={<BMRCalculator />} />
            <Route path="/calculators/ideal-weight" element={<IdealWeightCalculator />} />
            <Route path="/calculators/pace" element={<PaceCalculator />} />
            <Route path="/calculators/pregnancy" element={<PregnancyCalculator />} />
            <Route path="/calculators/conception" element={<PregnancyConceptionCalculator />} />
            <Route path="/calculators/due-date" element={<DueDateCalculator />} />

            {/* Math Calculators */}
            <Route path="/calculators/scientific" element={<ScientificCalculator />} />
            <Route path="/calculators/fraction" element={<FractionCalculator />} />
            <Route path="/calculators/percentage" element={<PercentageCalculator />} />
            <Route path="/calculators/random" element={<RandomGenerator />} />
            <Route path="/calculators/triangle" element={<TriangleCalculator />} />
            <Route path="/calculators/std-dev" element={<StdDevCalculator />} />

            {/* Other Calculators */}
            <Route path="/calculators/age" element={<AgeCalculator />} />
            <Route path="/calculators/date" element={<DateCalculator />} />
            <Route path="/calculators/time" element={<TimeCalculator />} />
            <Route path="/calculators/gpa" element={<GPACalculator />} />
            <Route path="/calculators/grade" element={<GradeCalculator />} />
            <Route path="/calculators/concrete" element={<ConcreteCalculator />} />
            <Route path="/calculators/subnet" element={<SubnetCalculator />} />
            <Route path="/calculators/password" element={<PasswordGenerator />} />
            <Route path="/calculators/conversion" element={<ConversionCalculator />} />

            <Route path="/sitemap" element={<Sitemap />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
