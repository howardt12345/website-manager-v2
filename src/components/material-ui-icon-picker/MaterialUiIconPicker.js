import React from 'react';
import { 
	Button, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	Icon, 
	LinearProgress,
	TextField,
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconsStorage from './IconsStorage';
import { hex2rgba } from '@utils';

class MaterialUiIconPicker extends React.Component {

	iconsStorage;
	styles;

	getStyles() {
		const backgroundBox = {
			backgroundColor: hex2rgba('#888888', 0.1),
			borderRadius: 4,
			height: 120,
			opacity: 0,
			position: 'absolute',
			top: 0,
			transitionProperty: 'opacity',
			transitionDuration: '200ms',
			transitionTimingFunction: 'ease-out',
			width: 112,
			marginLeft: 'calc(112px / 2)',
			transform: 'translateX(-50%)',
			transitionDelay: 'initial'
		};

		const selectedBackgroundBox = Object.assign({}, backgroundBox);
		selectedBackgroundBox.opacity = 1;

		return {
			iconsGrid: {
				display: 'flex',
				flexWrap: 'wrap'
			},
			iconsItem: {
				textAlign: 'center',
				width: '25%',
				flexGrow: 1,
				marginBottom: 10,
				position: 'relative',
				height: 120,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				cursor: 'pointer'
			},
			iconsItemCaption: {
				textTransform: 'uppercase',
				fontSize: 10,
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				position: 'relative',
				zIndex: 2,
				maxWidth: 100
			},
			iconsItemIcon: {
				color: 'rgb(117, 117, 117)',
				fontSize: 48,
				width: 48,
				height: 48,
				marginBottom: 10
			},
			backgroundBox: backgroundBox,
			selectedBackgroundBox: selectedBackgroundBox,
			header: {
				wrapper: {
					display: 'flex',
					flexDirection: 'column',
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0
				},
				input: {
					flex: 1,
					border: 'none',
					padding: 15,
					fontSize: 17,
					margin: '0 40',
					':focus': {
						outline: 'none'
					}
				},
				icons: {},
				title: {
					margin: 0,
					paddingLeft: 24,
					paddingTop: 0,
					paddingRight: 24,
					textTransform: 'uppercase'
				},
				search: {display: 'flex',
					marginTop: 10,
					position: 'relative',
					zIndex: 4,
					alignItems: 'center',
					paddingLeft: 10,
					paddingRight: 10
				},
				searchIcon: {
				},
				closeIcon: {
					cursor: 'pointer',
				}
			},
		};
	}

	constructor(props) {
		super(props);

		this.state = {
			pickerDialogOpen: false,
			_icons: [],
			icons: [],
			icon: null
		};

		this.iconsStorage = new IconsStorage();
	}

	componentWillMount() {
		if (!document.querySelector('[href="https://fonts.googleapis.com/icon?family=Material+Icons"]')) {
			const link = document.createElement('link');
			link.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
			link.setAttribute('rel', 'stylesheet');
			document.querySelector('head').appendChild(link);
		}
	}

	componentDidMount() {
		this.iconsPromise = this.iconsStorage.getIcons();
		this.iconsPromise.then(icons => this.showIcons(icons));
	}
	
	showIcons(icons) {
		this.setState({pickerDialogOpen: this.state.pickerDialogOpen, _icons: icons, icons: icons});
	}

	handleOpen() {
		this.setState({
			pickerDialogOpen: true,
			_icons: this.state._icons,
			icons: this.state.icons,
			selected: this.state.selected,
			didSearch: this.state.didSearch
		});
	};

	handleClose() {
		this.setState({
			pickerDialogOpen: false,
			_icons: this.state._icons,
			icons: this.state._icons,
			selected: this.state.selected,
			didSearch: false
		});
	};

	pickAndClose() {
		this.props.onPick(this.state.selected);
		this.handleClose();
	}

	select(icon) {
		this.setState({
			pickerDialogOpen: this.state.pickerDialogOpen,
			icons: this.state.icons,
			_icons: this.state._icons,
			selected: icon,
			didSearch: this.state.didSearch
		});
	}

	filterList(event) {

		if (event.target.value.toLowerCase().length === 0) {
			this.clearSearch();
		} else {
			let updatedList = this.state._icons;
			updatedList = updatedList.filter(function (item) {
				const searches = item.name.split('_').map(namePiece => namePiece.search(event.target.value.toLowerCase()) !== -1);
				return searches.indexOf(true) > -1;
			});

			this.setState({
				pickerDialogOpen: this.state.pickerDialogOpen,
				_icons: this.state._icons,
				icons: updatedList,
				selected: this.state.selected,
				didSearch: true
			});

		}
	}

	clearSearch() {
		this.refs.searchInput.value = '';

		this.setState({
			pickerDialogOpen: this.state.pickerDialogOpen,
			_icons: this.state._icons,
			icons: this.state._icons,
			selected: this.state.selected,
			didSearch: false
		});
	}

	render() {
		const styles = this.getStyles();

		const actions = [
			<Button
				disableElevation
				color='primary'
				variant="outlined"
				onClick={this.handleClose.bind(this)}
			>{this.props.cancelLabel}</Button>,
			<Button
				color='primary'
				variant="outlined"
				disabled={!this.state.selected}
				onClick={this.pickAndClose.bind(this)}
				endIcon={this.state.selected ?
					<Icon className="material-icons">{this.state.selected.name}</Icon> : null}
			>{this.props.pickLabel}</Button>,
		];

		const icons = this.state.icons.map((icon, index) => {
			return (<div key={index} style={styles.iconsItem} onClick={() => this.select(icon)}>
				<div
					style={this.state.selected && this.state.selected.name === icon.name ? styles.selectedBackgroundBox : styles.backgroundBox}></div>
				<Icon style={styles.iconsItemIcon} className="material-icons">{icon.name}</Icon>
				<div style={styles.iconsItemCaption}>{icon.name.split('_').join(' ')}</div>
			</div>);
		});

		return (
			<MuiThemeProvider theme={this.props.theme}>
				<div>
					<Button variant="outlined" onClick={this.handleOpen.bind(this)} color='primary'>{this.props.label}</Button>

					<Dialog
						scroll='paper'
						open={this.state.pickerDialogOpen}
						onClose={this.handleClose.bind(this)}
					>
						<DialogTitle>
							<div style={styles.header.wrapper}>
								<h3 style={styles.header.title}>{this.props.modalTitle}</h3>
								<div style={styles.header.search}>
									<Icon className="material-icons" style={styles.header.searchIcon}>search</Icon>
									<TextField 
										ref="searchInput" 
										type="text" 
										style={styles.header.input}
										placeholder="Search"
										variant="outlined"
										onChange={this.filterList.bind(this)}
									/>
									{this.state.didSearch ? <Icon style={styles.header.closeIcon} onClick={this.clearSearch.bind(this)}
																		className="material-icons">close</Icon> : null}
								</div>
							</div>
						</DialogTitle>
						<DialogContent>
							{this.state.icons.length > 0 
								? <div style={styles.iconsGrid}>{icons}</div>
								: <LinearProgress mode="indeterminate" />
							}
						</DialogContent>
						<DialogActions>
							{actions}
						</DialogActions>
					</Dialog>
				</div>


			</MuiThemeProvider>
		);
	}
}

MaterialUiIconPicker.propTypes = {
	cancelLabel: PropTypes.string,
	label: PropTypes.string,
	modalTitle: PropTypes.string,
	onPick: PropTypes.func.isRequired,
	pickLabel: PropTypes.string,
	theme: PropTypes.object.isRequired
};

MaterialUiIconPicker.defaultProps = {
	cancelLabel: 'Cancel',
	label: 'Pick icon',
	modalTitle: 'Material icon picker',
	pickLabel: 'Pick'
};

export default MaterialUiIconPicker;
