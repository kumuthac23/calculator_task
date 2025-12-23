# Mini Mortgage Calculator (Next.js)

A minimal Next.js app that calculates mortgage EMI, total interest, and gives a simple loan eligibility message.

## Features

- Inputs: Property Price, Down Payment, Interest Rate, Loan Tenure (years), Monthly Income
- Outputs: Monthly EMI, Total Interest, Loan Eligibility message

## Run (Windows)

Install dependencies and run dev server:

```powershell
cd "c:\Users\kumut\OneDrive\Desktop\mortage"
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Notes

- Eligibility rule: EMI must be ≤ 50% of monthly income (simple heuristic).
- Currency formatting uses browser locale and defaults to USD for display.
