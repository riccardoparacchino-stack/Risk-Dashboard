export default function AttackCounter({ attacksLeft, onConquest, onResetTurn }) {
  return (
    <section>
      <h3>Remaining attacks: {attacksLeft}</h3>
      <button onClick={onConquest} disabled={attacksLeft <= 0}>
        Conquer Territory
      </button>
      <button onClick={onResetTurn} style={{ marginLeft: 10 }}>
        Reset Turn
      </button>
    </section>
  );
}


