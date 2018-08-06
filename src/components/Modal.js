import './Modal.css';
import React from 'react';

export function Modal(props) {
	return <div className="modal-shadow">{props.children}</div>
}