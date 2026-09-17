import { useState } from 'react';

export default function SearchBox({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const submit = (e) => { e.preventDefault(); if (value.trim()) onSearch(value.trim()); };

  return <form className="search-box" onSubmit={submit}>
    <div className="search-icon">✦</div>
    <label className="search-field">
      <span className="search-label">Ask for a vibe</span>
      <input aria-label="Search nearby places" value={value} onChange={(e) => setValue(e.target.value)} placeholder="peaceful sunset spot, café with friends, quick outing…" />
    </label>
    <button disabled={loading || !value.trim()}>{loading ? 'Thinking…' : 'Search'} <span>↗</span></button>
  </form>;
}
