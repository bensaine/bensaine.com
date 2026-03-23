interface Props {
  onEnter: () => void;
}

export function StartScreen({ onEnter }: Props) {
  return (
    <div
      onClick={onEnter}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #1a1008 0%, #0a0806 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          color: 'rgba(255, 220, 160, 0.9)',
          margin: 0,
          letterSpacing: '0.04em',
          fontWeight: 400,
        }}
      >
        Ben Saine
      </h1>
      <p
        style={{
          marginTop: '2rem',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.85rem',
          color: 'rgba(255, 180, 100, 0.4)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Click to enter
      </p>
    </div>
  );
}
