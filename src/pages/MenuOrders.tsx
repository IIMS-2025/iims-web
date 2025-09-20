export default function MenuOrdersPage() {
  return (
    <div className="grid two">
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Menu Book</h3>
        <table className="table">
          <thead><tr><th>Item</th><th>Category</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Pizza Margherita</td><td>Pizza</td><td>$12</td></tr>
            <tr><td>Pasta Arrabbiata</td><td>Pasta</td><td>$11</td></tr>
          </tbody>
        </table>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Recent Orders (POS)</h3>
        <table className="table">
          <thead><tr><th>Order ID</th><th>Menu Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>o1</td><td>Pizza Margherita</td><td>2</td><td>$24</td></tr>
            <tr><td>o2</td><td>Pasta Arrabbiata</td><td>1</td><td>$11</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


