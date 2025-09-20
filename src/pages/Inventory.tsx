import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInventory } from "../services/api";
import { setInventory } from "../store/slices/inventorySlice";
import type { RootState } from "../store";

export default function InventoryPage() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.inventory.items);

  useEffect(() => {
    (async () => {
      const res = await getInventory();
      dispatch(setInventory(res.data));
    })();
  }, [dispatch]);

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Inventory Ledger (Current Stock)</h3>
      <table className="table">
        <thead>
          <tr><th>Product</th><th>Available</th><th>Reorder</th><th>Critical</th><th>Updated</th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.product_id}>
              <td>{i.product_id}</td>
              <td>{i.available_qty}</td>
              <td>{i.reorder_point}</td>
              <td>{i.critical_point}</td>
              <td>{new Date(i.last_updated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


