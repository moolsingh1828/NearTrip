import { useState } from 'react';
export default function SearchBox({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const submit = (e) => { e.preventDefault(); if (value.trim()) onSearch(value.trim()); };
  return <form className="search-box" onSubmit={submit}>
    <span>⌕</span><input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Try “peaceful place for friends” or “sunset spots”" />
    <button disabled={loading}>{loading ? 'Thinking…' : 'Find'}</button>
  </form>;
}
