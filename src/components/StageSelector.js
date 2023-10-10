import React from "react";

export function StageSelector({ stages, stage, setStage }) {
	if (stages.length === 0) { return null; }
	return <div id="stage-selector">Serie/station:
		<select value={stage.num} onChange={e => setStage(parseInt(e.target.value, 10))}>
			{stages.map(s => <option key={s.num} value={s.num}>{s.num}</option>)}
		</select>
	</div>
}