import './Buttons.css';
import './ScheduleProperties.css';
import React from 'react';
import { ModalDialog } from './Modal';

export function ScheduleProperties({ onClose }) {
	/*
	return <Modal>
		<div className="schedule-properties">
			<div className="titlebar">
				<h1 className="title-content">Skjutlag/patruller</h1>
				<button className="button-close" onClick={onClose} />
			</div>
			<div className="schedule-properties-content">
				<p>text</p>
			</div>
		</div>
	</Modal>;
	*/
	return <ModalDialog title="Skjutlag/patruller" onClose={onClose}>
		<p>Lorem Ipsum</p>
	</ModalDialog>;
}