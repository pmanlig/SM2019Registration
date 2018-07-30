import "./Spinner.css";
import React from 'react';

export function Spinner({ className, value, onChange, size }) {
	return <div className={"spinner " + className}>
		<button className="spinner button-previous" style={{ backgroundColor: "inherit" }} onClick={e => onChange(value - 1)} />
		<input className="spinner" value={value} size={size || 1} readOnly />
		<button className="spinner button-next" style={{ backgroundColor: "inherit" }} onClick={e => onChange(value + 1)} />
	</div>;
}