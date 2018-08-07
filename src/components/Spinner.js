import "./Spinner.css";
import React from 'react';

export function Spinner({ className, value, onChange, size }) {
	return <div className="spinner">
		<button className="spinner button-previous" style={{ backgroundColor: "inherit" }} onClick={e => onChange(value - 1)} />
		<input className={"spinner " + className} value={value} size={size || 1} onChange={e => onChange(e.target.value)} />
		<button className="spinner button-next" style={{ backgroundColor: "inherit" }} onClick={e => onChange(value + 1)} />
	</div>;
}