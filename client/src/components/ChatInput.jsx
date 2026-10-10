import { useRef, useState } from 'react';
import api from '../api/axios';
import Input from './Input';
import Button from './Button';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend({ text });
    setText('');
  };

  const uploadMedia = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd);
      onSend({ [data.type]: data.url });
    } catch (error) {
      alert(
        error.response?.data?.details
          || error.response?.data?.message
          || 'Photo or video upload failed'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 bg-white/5 p-3">
      <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={uploadMedia} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={uploadMedia} />
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        disabled={uploading}
        aria-label="Upload a photo or video"
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-60"
      >
        {uploading ? '...' : '📎'}
      </button>
      <button
        type="button"
        onClick={() => cameraRef.current.click()}
        disabled={uploading}
        aria-label="Take a photo"
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-60"
      >
        📷
      </button>
      <Input variant="dark" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
      <Button variant="dark" type="submit">Send</Button>
    </form>
  );
}
