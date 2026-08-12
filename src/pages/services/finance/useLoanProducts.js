import { useEffect, useState } from 'react';

const dummyLoans = [
  {
    id: 1,
    name: 'HDFC Home Loan',
    type: 'home',
    interestRate: '7.5%',
    minAmount: '₹5,00,000',
    maxAmount: '₹5,00,00,000',
    tenure: 'Up to 30 years',
    eligibility: 'Salaried / Self-employed, Age 21-65, Min income ₹25,000/month, CIBIL 650+',
    provider: 'HDFC Bank',
  },
  {
    id: 2,
    name: 'ICICI Home Loan',
    type: 'home',
    interestRate: '7.8%',
    minAmount: '₹5,00,000',
    maxAmount: '₹5,00,00,000',
    tenure: 'Up to 30 years',
    eligibility: 'Salaried / Self-employed, Age 21-65, Min income ₹25,000/month, CIBIL 650+',
    provider: 'ICICI Bank',
  },
  {
    id: 3,
    name: 'SBI Home Loan',
    type: 'home',
    interestRate: '7.2%',
    minAmount: '₹5,00,000',
    maxAmount: '₹10,00,00,000',
    tenure: 'Up to 30 years',
    eligibility: 'Salaried / Self-employed, Age 21-70, Min income ₹25,000/month, CIBIL 650+',
    provider: 'State Bank of India',
  },
  {
    id: 4,
    name: 'Bajaj Finserv Personal Loan',
    type: 'vehicle',
    interestRate: '10.5%',
    minAmount: '₹50,000',
    maxAmount: '₹50,00,000',
    tenure: '1-5 years',
    eligibility: 'Salaried, Age 23-58, Min income ₹20,000/month, CIBIL 700+',
    provider: 'Bajaj Finserv',
  },
  {
    id: 5,
    name: 'HDFC Car Loan',
    type: 'vehicle',
    interestRate: '8.5%',
    minAmount: '₹1,00,000',
    maxAmount: '₹2,00,00,000',
    tenure: '1-7 years',
    eligibility: 'Salaried / Self-employed, Age 21-60, Min income ₹15,000/month, CIBIL 600+',
    provider: 'HDFC Bank',
  },
];

export default function useLoanProducts() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setLoans(dummyLoans);
    setLoading(false);
  }, []);

  return { loans, loading, error };
}