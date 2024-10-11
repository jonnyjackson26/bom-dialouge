import "./LinkButton.css"
import { Link } from 'react-router-dom'


const LinkButton = ({ text, path, onClick }) => {

    return (
        <Link className="button-link" to={path} onClick={onClick}>{text}</Link>
    );
};

export default LinkButton;