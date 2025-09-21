export default function ChefDashboard() {
  return (
    <div className="grid two">
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Wastage Insights</h3>
        <table className="table">
          <thead><tr><th>Raw Material</th><th>Reason</th><th>Qty</th><th>Cost Loss</th></tr></thead>
          <tbody>
            <tr><td>Tomatoes</td><td>Spoilage</td><td>4 kg</td><td>₹12</td></tr>
            <tr><td>Cheese</td><td>Expired</td><td>1 kg</td><td>₹8</td></tr>
          </tbody>
        </table>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Cookbook & SOPs</h3>
        <ul>
          <li className="alert">Pizza Margherita — Bake at 260°C for 7-8 minutes.</li>
          <li className="alert">Pasta Arrabbiata — Simmer sauce 12 minutes.</li>
        </ul>
        <h4>AI Menu Recommendations</h4>
        <div className="alert">Recommend limited-time spicy pizza using surplus tomatoes.</div>
      </div>
    </div>
  );
}


