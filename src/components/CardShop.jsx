export default function CardShop({ cardCatalog, onBuyCard }) {
  return (
    <section style={{ marginTop: 30 }}>
      <h2>Available Cards</h2>
      {cardCatalog.map((c) => (
        <div key={c.id} style={{ marginBottom: 10 }}>
          {c.name} — {c.cost} pts
          <button
            style={{ marginLeft: 10 }}
            onClick={() => onBuyCard(c.cost)}
          >
            Buy
          </button>
        </div>
      ))}
    </section>
  );
}


