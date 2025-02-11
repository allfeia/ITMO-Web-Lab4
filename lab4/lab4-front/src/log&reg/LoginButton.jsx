import {useNavigate} from 'react-router-dom'
import '../styles/welcome.css';

function LoginButton(){
    const navigate = useNavigate();

    return(
        <button className="login-button" onClick={() => navigate("/login")}>Explore now</button>
    )
}
export default LoginButton;