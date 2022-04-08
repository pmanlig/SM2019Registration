import React from 'react';

function link(a) {
	if (a) {
		if (a.includes("|")) {
			return <a href={a.split("|")[1]}>{a.split("|")[0]}</a>
		} else {
			return <a href={a}>{a}</a>
		}
	}
	return a;
}

function linkify(t, c) {
	let p = 1;
	if (t.includes("[") && t.includes("]")) {
		return t.split("]").map(s => <span key={p++}>{s.split("[")[0]}{link(s.split("[")[1])}</span>).concat([<br key={p++} />]);
	}
	return <span key={c}>{t}<br /></span>;
}

export function Description({ value }) {
	if (value == null || value === "") { return null; }
	let c = 1;
	return <div className="content">{value.split("\n").map(t => linkify(t, c++))}</div>;
}