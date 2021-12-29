import './ReportView.css';
import React from 'react';

export class ReportView extends React.Component {
	static register = { name: "ReportView" };
	static wire = ["fire", "Competition", "Registration", "Results", "Server", "ReportTable", "EventBus", "Events", "Footers"];

	constructor(props) {
		super(props);
		this.state = { eventList: [], event: null, schedule: null, squad: null, participants: null, stage: 0 };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, this.updateCompetition);
		this.subscribe(this.Events.resultsUpdated, () => this.setState({}));
		this.Competition.load(props.match.params.id);
	}

	updateCompetition = () => {
		this.fire(this.Events.changeTitle, "Registrera resultat för " + this.Competition.name);
		this.setEventList(this.Competition.events);
	}

	setEventList(eventList) {
		eventList = eventList.filter(e => e.schedule !== 0);
		this.setState({ eventList: eventList });
		this.setEvent(eventList.length > 0 ? eventList[0] : null);
	}

	setEvent(event) {
		this.setState({ event: event });
		if (event !== null) {
			this.Results.load(this.Competition.id, event.id);
			if (event.schedule !== 0 && event.schedule !== undefined) {
				this.Server.loadSchedule(event.schedule, this.updateSchedule, this.Footers.errorHandler("Kan inte hämta startlista för tävlingen"));
			}
		}
	}

	updateSchedule = schedule => {
		this.setState({ schedule: schedule, squad: schedule.squads[0] });
		this.Server.loadParticipants(schedule.id, this.updateParticipants, this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
	}

	updateParticipants = participants => {
		this.setState({ participants: participants });
	}

	changeEvent(newEvent) {
		if (newEvent === 'none') {
			this.setState({ eventId: 'none', results: [] });
		} else {
			this.Server.loadResults(this.Competition.id, newEvent,
				r => this.setState({ eventId: newEvent, results: r }),
				this.Footers.errorHandler("Kan inte hämta resultat"));
		}
	}

	changeSquad = squadId => {
		this.setState({ squad: this.state.schedule.squads.find(s => s.id === squadId) });
	}

	next = e => {
		let error = this.Results.validateScores(this.state.stage, this.state.squad ? this.state.squad.id : undefined);
		this.setState({});
		console.log("Next clicked", error, this.Results.scores);
	}

	NextButton = props => {
		return <p type="button" id="next-button" className="button" onClick={this.next}>Nästa &gt;</p>;
	}

	render() {
		let { eventList, event, schedule, squad, stage } = this.state;
		let stageDefs = this.Results.stageDefs;
		let stageDef = stageDefs[stage];
		console.log("StageDefs", stageDefs, stage);
		return <div id="results" className="content">
			<div id="selections">
				{eventList.length > 1 &&
					<div id="event-selector">Resultat för deltävling:
						<select value={event ? event.id : "none"} onChange={e => this.changeEvent(e.target.value)}>
							<option value="none">Välj deltävling</option>
							{eventList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
						</select></div>}
				{schedule &&
					<div id="squad-selector">Skjutlag/patrull:
						<select value={squad.id} onChange={e => this.changeSquad(e.target.value)}>
							{schedule.squads.map(s => <option key={s.id} value={s.id}>{s.startTime}</option>)}
						</select>
					</div>}
				{stageDefs.length > 0 && <div id="stage-selector">Serie/station:
					<select value={stage} onChange={e => this.setState({ stage: e.target.value })}>
						{stageDefs.map(s => <option key={s.num} value={stageDefs.indexOf(s)}>{s.num}</option>)}
					</select>
				</div>}
				{stageDef && <div>Figurer: {stageDef.targets}</div>}
				{stageDef && <div>Maxträff: {stageDef.max}</div>}
				{stageDef && stageDef.min > 0 && <div>Min: {stageDef.min}</div>}
				{stageDef && stageDef.values && <div>Poängräkning</div>}
				<div id="spacer" style={{ flexGrow: 1 }} />
				{/*<div id="mode-selector" >Inmatningsläge:
					<select value="computer" onChange={e => this.changeMode(e.target.value)}>
						<option value="computer">Dator</option>
						<option value="mobile">Platta/Mobil</option>
					</select>
				</div>*/}
			</div>
			<this.ReportTable results={this.Results} squad={squad} stage={stage} />
			<this.NextButton />
			{/*<button className={this.Results.isDirty() ? "button" : "button disabled"} onClick={() => this.Results.store()}>Spara</button>*/}
			{/*<button className="button" onClick={() => this.Results.sort()}>Sortera</button>*/}
		</div>;
	}
}