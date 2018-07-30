import React from 'react';

export function Dropdown({ className, value, onChange, list }) {
	return <select className={className} value={value} onChange={onChange}>
		{list.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
	</select>;
}