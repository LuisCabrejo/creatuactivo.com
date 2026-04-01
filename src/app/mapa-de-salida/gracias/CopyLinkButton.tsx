'use client';

export default function CopyLinkButton({ url, style }: { url: string; style?: React.CSSProperties }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(url)}
      style={style}
    >
      Copiar el link
    </button>
  );
}
