interface Props {
	label: string
	accentColor?: string
	/** 0–1 fill progress of the sweep ring. Defaults to 0 (empty). */
	progress?: number
}

// Rounded square SVG sweep using a <path> that starts at top-center going clockwise.
// SIZE=36, R=6. Path: M tc,1 → right → arc TR → down → arc BR → left → arc BL → up → arc TL → back to tc
const SIZE = 36
const R = 6
const PERIMETER = 4 * (SIZE - 2 - 2 * R) + 2 * Math.PI * R
// Path starting at top-center (18,1), clockwise, open (no Z so stroke doesn't double back)
const TC = SIZE / 2 // top-center x = 18
const SWEEP_PATH = `M ${TC},1 H ${SIZE - 1 - R} A ${R},${R} 0 0,1 ${SIZE - 1},${1 + R} V ${SIZE - 1 - R} A ${R},${R} 0 0,1 ${SIZE - 1 - R},${SIZE - 1} H ${1 + R} A ${R},${R} 0 0,1 1,${SIZE - 1 - R} V ${1 + R} A ${R},${R} 0 0,1 ${1 + R},1 H ${TC}`

export function HoldPrompt({ label, accentColor = "rgba(255,180,80,0.9)", progress = 0 }: Props) {
	const filled = progress * PERIMETER

	return (
		<div
			style={{
				position: "fixed",
				bottom: "2.5rem",
				left: "50%",
				transform: "translateX(-50%)",
				display: "flex",
				background: "rgba(10,8,6,0.7)",
				color: "rgba(255,220,160,0.85)",
				padding: "0.3rem 0.75rem",
				borderRadius: "1rem",
				border: `1px solid ${accentColor.replace("0.9", "0.2")}`,
				backdropFilter: "blur(8px)",
				alignItems: "center",
				gap: "0.75rem",
				pointerEvents: "none",
				zIndex: 5,
			}}
		>
			{/* Key with sweep square */}
			<div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
				<svg width={SIZE} height={SIZE} style={{ position: "absolute", inset: 0 }}>
					{/* Track */}
					<rect x="1" y="1" width={SIZE - 2} height={SIZE - 2} rx={R} ry={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
					{/* Sweep — path starts at top-center, goes clockwise */}
					{progress > 0 && (
						<path
							d={SWEEP_PATH}
							fill="none"
							stroke={accentColor}
							strokeWidth="2"
							strokeDasharray={`${filled} ${PERIMETER}`}
							strokeLinecap="round"
						/>
					)}
				</svg>
				<div
					style={{
						position: "absolute",
						inset: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontFamily: "system-ui, monospace",
						fontSize: "0.85rem",
						fontWeight: 600,
						color: accentColor,
					}}
				>
					E
				</div>
			</div>

			<span
				style={{
					fontFamily: "system-ui, sans-serif",
					fontSize: "0.8rem",
					color: "rgba(255,220,160,0.85)",
					letterSpacing: "0.05em",
				}}
			>
				{label}
			</span>
		</div>
	)
}
