import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import './Modal.scss'

const Modal = props => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(props.active);
    }, [props.active]);

    return (
        <div className={`modal ${props.active ? 'active' : ''}`} style={props.style}>
            {props.children}
        </div>
    )
}

Modal.propTypes = {
    active: PropTypes.bool
}

export const ModalContent = props => {
    const contentRef = useRef(null);

    const closeModal = () => {
        contentRef.current.parentNode.classList.remove('active');
        if (props.onClose) props.onClose()
    }
    return (
        <div ref={contentRef} className="modal__body active">
            <div className="modal__body__close" onClick={closeModal}>
                <i className='bx bx-x fs-26'></i>
            </div>
            <div className="modal__content">
                {props.children}
            </div>
        </div>
    )
}

ModalContent.propTypes = {
    onClose: PropTypes.func
}

export default Modal
