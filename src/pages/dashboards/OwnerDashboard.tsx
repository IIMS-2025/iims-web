import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { getForecasts, getOrders } from "../../services/api";
import { setForecasts } from "../../store/slices/forecastsSlice";
import { setOrders } from "../../store/slices/ordersSlice";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { colors } from "../../styles/colors";

export default function OwnerDashboard() {
  const dispatch = useDispatch();
  const orders = useSelector((s: RootState) => s.orders.orders);
  const forecasts = useSelector((s: RootState) => s.forecasts.items);

  useEffect(() => {
    (async () => {
      const [o, f] = await Promise.all([getOrders(), getForecasts()]);
      dispatch(setOrders(o.data));
      dispatch(setForecasts(f.data));
    })();
  }, [dispatch]);

  const revenue = orders.reduce((acc, o) => acc + o.lines.reduce((s, l) => s + l.price * l.qty, 0), 0);

  const chartData = forecasts.map((f, idx) => ({ name: `D${idx+1}`, forecast: f.forecast_qty, sales: Math.max(0, f.forecast_qty - 2 + (idx % 3)) }));

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(12,minmax(0,1fr))" }}>
      <div className="card" style={{ gridColumn: "span 4", padding: 16 }}>
        <div className="kpi"><span className="title">Total Revenue (Today)</span><span className="value">${revenue.toFixed(2)}</span><span className="delta up">↑ 5.2% vs yesterday</span></div>
      </div>
      <div className="card" style={{ gridColumn: "span 4", padding: 16 }}>
        <div className="kpi"><span className="title">Profit Margin</span><span className="value">32%</span><span className="delta up">↑ 1.1% this week</span></div>
      </div>
      <div className="card" style={{ gridColumn: "span 4", padding: 16 }}>
        <div className="kpi"><span className="title">Cash Flow</span><span className="value">$12,480</span><span className="delta down">↓ 0.7% this month</span></div>
      </div>

      <div className="card" style={{ gridColumn: "span 8", padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Revenue Trend</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.textMuted} />
              <YAxis stroke={colors.textMuted} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke={colors.success} strokeWidth={2} />
              <Line type="monotone" dataKey="forecast" stroke={colors.primary} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card" style={{ gridColumn: "span 4", padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Top Sellers</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={[{name:"Pizza",qty:64},{name:"Pasta",qty:42},{name:"Salad",qty:31}]}> 
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.textMuted}/>
              <YAxis stroke={colors.textMuted}/>
              <Tooltip />
              <Bar dataKey="qty" fill={colors.secondary} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


