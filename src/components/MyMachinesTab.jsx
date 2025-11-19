import { useUserMachines } from "../hooks/useUserMachines.js";

export default function MyMachinesTab() {
  const { loading, error, memberId, machines } = useUserMachines();

  if (loading) return <p>Завантаження...</p>;
  if (!memberId) return <p>Будь ласка, <a href="/login">увійдіть</a> або <a href="/register">зареєструйтеся</a>.</p>;
  if (machines.length === 0) return <p>У вас ще немає машин.</p>;

  return (
    <section aria-label="User machines" className="user-machines">
      <h2>Мої машини</h2>
      <ul className="machine-list">
        {machines.map((m, i) => (
          <li key={i} className="machine-item">
            <h3>{m.name}</h3>
            {m.serialNumber && (
              <p><strong>Серійний номер:</strong> {m.serialNumber}</p>
            )}
            {m.purchaseDate && (
              <p><strong>Дата покупки:</strong> {m.purchaseDate}</p>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="error-msg">{error}</p>}
    </section>
  );
}
