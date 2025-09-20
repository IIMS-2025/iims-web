import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { getInventory, getForecasts } from "../../services/api";
import { setInventory } from "../../store/slices/inventorySlice";
import { setForecasts } from "../../store/slices/forecastsSlice";
import { colors } from "../../styles/colors";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const inventory = useSelector((s: RootState) => s.inventory.items);
  const forecasts = useSelector((s: RootState) => s.forecasts.items);

  useEffect(() => {
    (async () => {
      const [i, f] = await Promise.all([getInventory(), getForecasts()]);
      dispatch(setInventory(i.data));
      dispatch(setForecasts(f.data));
    })();
  }, [dispatch]);

  return (
    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Stock Insights</h3>
        <table className="table">
          <thead>
            <tr><th>Product</th><th>Available</th><th>Reorder</th><th>Critical</th><th>Status</th></tr>
          </thead>
          <tbody>
            {inventory.map((i) => {
              const warn = i.available_qty <= i.reorder_point;
              const crit = i.available_qty <= i.critical_point;
              return (
                <tr key={i.product_id}>
                  <td>{i.product_id}</td>
                  <td>{i.available_qty}</td>
                  <td>{i.reorder_point}</td>
                  <td>{i.critical_point}</td>
              <td>{crit ? <span className="badge" style={{ color: colors.danger }}>Critical</span> : warn ? <span className="badge" style={{ color: colors.warning }}>Reorder</span> : <span className="badge">OK</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Forecast Alerts</h3>
        <ul>
          {forecasts.map((f) => (
            <li key={f.product_id+f.date} className="alert warn" style={{ marginBottom: 8 }}>
              Expected demand for <b>{f.product_id}</b> is <b>{f.forecast_qty}</b> tomorrow.
            </li>
          ))}
        </ul>
        <h4>Manual Entries</h4>
        <div className="footer-note">Record utilities like gas, electricity, labour (placeholder UI).</div>
      </div>
    </div>
  );
}


