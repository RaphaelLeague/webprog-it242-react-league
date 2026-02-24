import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('guestbook')
        .insert([{ name: form.name, message: form.message }]);
      if (error) throw error;

      setForm({ name: '', message: '' });
      await fetchEntries();
    } catch (error) {
      console.error('Failed to save entry', error);
      alert('Failed to sign guestbook: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="hero-header">
        <h1 className="gradient-text">Digital Guestbook</h1>
        <p>Leave your mark on the internet.</p>
      </header>

      <main className="main-content">
        <section className="form-section glass-panel">
          <form onSubmit={handleSubmit} className="guest-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="What's your name?"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="off"
              />
            </div>
            <div className="input-group">
              <textarea
                placeholder="Write your message here..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
              />
            </div>
            <button type="submit" className="glow-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Publish Message'}
            </button>
          </form>{entry.name?.charAt(0)?.toUpperCase() || '?'}
        </section>

        <section className="feed-section">
          {entries.length === 0 ? (
            <p className="empty-state">It's quiet here. Be the first to post!</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="message-bubble glass-panel">
                <div className="message-header">
                  <div className="avatar">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="meta-info">
                    <h3 className="author-name">{entry.name}</h3>
                    <time className="timestamp">
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
                <p className="message-content">{entry.message}</p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;