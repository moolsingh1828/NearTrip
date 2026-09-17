const items = [
  ['all', 'All'], ['hidden', '✨ Hidden Gems'], ['nature', '🌿 Nature'], ['food', '🍜 Food'], ['adventure', '🧗 Adventure'], ['cafe', '☕ Cafés'], ['attractions', '🏛️ Attractions']
];
export default function CategoryChips({ value, onChange }) {
  return <div className="chips">{items.map(([key, label]) => <button key={key} className={value === key ? 'chip active' : 'chip'} onClick={() => onChange(key)}>{label}</button>)}</div>;
}
