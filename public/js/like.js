class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: 'Like'};
		this.likeStatus = this.likeStatus.bind(this);
	}

	fetch() {
		fetch('/interact/' + window.userId)
		  .then(function(response) {
		    return response.text()
		  }).then(function(body) {
		    document.body.innerHTML = body
		  })
	}

	likeStatus() {
		if (this.state.value === 'Like') {
			this.setState({
				value: 'Liked'
		    });
		}
		else {
			this.setState({
				value: 'Like'
		    });
		}
	}

	render() {
		return (
			<button onClick={this.likeStatus} >{this.state.value}</button>
		);
	}
}

ReactDOM.render(
  <Welcome />,
  document.getElementById('like')
);