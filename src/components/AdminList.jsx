import React from 'react'
import PropTypes from 'prop-types'
import ReactMessages from 'react-messages'
import ReactToPrint from 'react-to-print'

import * as API from '../utils/API'
import Loader from './Loader'
import PrintComponent from './PrintComponent'

class AdminList extends React.Component {
	state = {
		loaded: false,
		list: [],
		error: {
			message: 'Hay algún problema al cargar el listado, inténtalo mas tarde.',
			next: false,
			icon: 'warning',
			state: true,
		},
	}

	componentDidMount() {
		this.getData()
	}

	getData = async () => {
		const { error } = this.state
		const { type } = this.props
		const promise = await API.get(type)

		if (promise.success) {
			this.setState({ list: promise.data, loaded: true })
		} else {
			this.setState({ error: Object.assign(error, { next: true }), loaded: true })
		}
	}

	handleRemove = async e => {
		const { id } = e.target.dataset
		const { error } = this.state
		const { type } = this.props
		const c = window.confirm(
			'Estás seguro qué quieres eliminar está escuela? Ten en cuenta que es una acción irreversible.',
		)

		if (c) {
			const promise = await API.remove(`${type}/${id}`)

			if (promise.success) {
				this.setState({ list: promise.data, loaded: true })
			} else {
				this.setState({ error: Object.assign(error, { next: true }), loaded: true })
			}
		}
	}

	handleShow = e => {
		const { id } = e.target.dataset
		const el = document.querySelector(`.app-list-content[data-id="${id}"]`)

		if (!el.classList.contains('show')) {
			el.classList.add('show')
		} else {
			el.classList.remove('show')
		}
	}

	handlePrint = () => {
		const els = document.querySelectorAll('.app-list-content')
		els.forEach(el => el.classList.add('show'))
	}

	render() {
		const { list, loaded, error } = this.state
		const PrintButton = (
			<button type="button" aria-label="Descargar PDF" className="btn btn-invert">
				Descargar PDF
			</button>
		)

		return (
			<React.Fragment>
				{!loaded && <Loader />}
				{loaded && (
					<article>
						<header className="app-admin-title">
							<h1>Listado de escuelas</h1>
							<div>
								<ReactToPrint trigger={() => PrintButton} content={() => this.componentRef} />
							</div>
						</header>
						<ul className="app-list">
							<ReactMessages
								message={error.message}
								next={error.next}
								error={error.state}
								icon={error.icon}
								duration={5000}
							/>
							<PrintComponent
								data={list}
								handleRemove={this.handleRemove}
								handleShow={this.handleShow}
								ref={el => (this.componentRef = el)}
							/>
						</ul>
					</article>
				)}
			</React.Fragment>
		)
	}
}

AdminList.propTypes = {
	type: PropTypes.string.isRequired,
}

export default AdminList