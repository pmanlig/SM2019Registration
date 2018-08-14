import './Modal.css';
import React from 'react';

export function Modal(props) {
	return <div className="modal-shadow">{props.children}</div>
}

export function ModalDialog({ className, title, children, onClose }) {
	return <div className="modal-shadow">
		<div className="modal-box">
			<div className="modal-box-title">
				<h1>{title}</h1>
				<button className="button-close" onClick={onClose} />
			</div>
			<div className={"modal-box-content" + (className ? " " + className : "")}>
				{children}
			</div>
		</div>
	</div>;
}