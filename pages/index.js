import { useState, useEffect } from "react";

function formatCurrency(v) {
  if (v === null || isNaN(v)) return "-";
  const num = Number(v);
  const parts = num.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "$" + parts.join(".");
}

export default function Home() {
  const [price, setPrice] = useState(300000);
  const [down, setDown] = useState(60000);
  const [rate, setRate] = useState(3.5);
  const [tenureYears, setTenureYears] = useState(30);
  const [income, setIncome] = useState(5000);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data on mount
  useEffect(() => {
    fetch("https://dummyjson.com/products/1")
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const loanAmount = Math.max(0, Number(price) - Number(down));
  const monthlyRate = Number(rate) / 100 / 12;
  const n = Number(tenureYears) * 12;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = n > 0 ? loanAmount / n : 0;
  } else if (n > 0) {
    const x = Math.pow(1 + monthlyRate, n);
    emi = (loanAmount * monthlyRate * x) / (x - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  // Eligibility: allow EMI upto 50% of monthly income
  const maxAllowedEmi = 0.5 * Number(income);
  const eligible = emi <= maxAllowedEmi;

  // Compute suggested maximum loan given EMI cap (reverse EMI formula)
  let maxLoan = 0;
  if (monthlyRate === 0) {
    maxLoan = maxAllowedEmi * n;
  } else if (n > 0) {
    const x = Math.pow(1 + monthlyRate, n);
    maxLoan = (maxAllowedEmi * (x - 1)) / (monthlyRate * x);
  }

  return (
    <div className="container">
      <main>
        <h1>Mini Mortgage Calculator</h1>
        <div className="grid">
          <label>
            Property Price
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <label>
            Down Payment
            <input
              type="number"
              value={down}
              onChange={(e) => setDown(e.target.value)}
            />
          </label>

          <label>
            Interest Rate (annual %)
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </label>

          <label>
            Loan Tenure (years)
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
            />
          </label>

          <label>
            Monthly Income
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </label>
        </div>

        <section className="results">
          <h2>Results</h2>
          <p>
            <strong>Loan Amount:</strong> {formatCurrency(loanAmount)}
          </p>
          <p>
            <strong>Monthly EMI:</strong>{" "}
            {formatCurrency(Number.isFinite(emi) ? emi : null)}
          </p>
          <p>
            <strong>Total Interest (over life):</strong>{" "}
            {formatCurrency(
              Number.isFinite(totalInterest) ? totalInterest : null
            )}
          </p>
          <p>
            <strong>Eligibility:</strong>{" "}
            {eligible ? "Eligible" : "Not eligible"}
          </p>
          {!eligible && (
            <p className="note">
              With the given income, estimated maximum loan for this tenure &
              rate is <strong>{formatCurrency(maxLoan)}</strong> (EMI ~{" "}
              {formatCurrency(maxAllowedEmi)}).
            </p>
          )}
        </section>

        <footer>
          <small>
            Note: Eligibility uses a simple rule: EMI must be ≤ 50% of monthly
            income.
          </small>
        </footer>

        <section className="api-section">
          <h2>API Integration</h2>
          {loading && <p>Loading product data...</p>}
          {error && <p className="error">Error: {error}</p>}
          {product && (
            <div className="product-card">
              <h3>{product.title}</h3>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
              <p>
                <strong>Rating:</strong> {product.rating} ⭐
              </p>
              {product.thumbnail && (
                <img src={product.thumbnail} alt={product.title} />
              )}
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .container {
          padding: 24px;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto,
            "Helvetica Neue", Arial;
        }
        main {
          max-width: 860px;
          margin: 0 auto;
        }
        h1 {
          margin-bottom: 12px;
        }
        h2 {
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
        }
        input {
          padding: 8px 10px;
          margin-top: 6px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .results {
          background: #f9fafb;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #eee;
        }
        .note {
          color: #b33;
        }
        .api-section {
          background: #f0f8ff;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #add8e6;
          margin-top: 24px;
        }
        .product-card {
          background: #fff;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
        .product-card img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin-top: 8px;
        }
        .product-card h3 {
          margin: 0 0 8px 0;
        }
        .product-card p {
          margin: 4px 0;
        }
        .error {
          color: #d32f2f;
        }
        footer {
          margin-top: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
