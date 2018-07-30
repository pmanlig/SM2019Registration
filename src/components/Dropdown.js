import React from 'react';

export class Dropdown extends React.Component {
	render() {
		return <select className={this.props.className} value={this.props.value} onChange={this.props.onChange}>
			{this.props.list.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
		</select>;
	}
}