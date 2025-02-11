import {useContext, useState} from "react";
import Container from "../template/Container";
import Card from "../template/Card";
import MainContent from "../template/MainContent";
import '../styles/login.css';
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function sendLogin(login, password) {
    const f = false;
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({login, password, f}),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Some problems with response');
            }
            return response.json();
        });
}
export default function LoginForm(){
    const {userEnter} = useContext(UserContext);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        sendLogin(login, password)
            .then(data => {
                console.log(data);
                if (data.exist === true) { // Проверяем, успешен ли логин
                    userEnter(data); // Обновляем состояние авторизации
                    navigate('/main');
                } else {
                    document.getElementById("status").style.color = "red"
                    document.getElementById("status").innerText = "Неверный логин или пароль";
                }
            }).catch(error => {
            document.getElementById("status").style.color = "red"
            document.getElementById("status").innerText = "Что-то пошло не так";
            console.log(error)
        });
    };

    return(
        <Container>
            <Card style={{ width: 400, height: 500}}>
                <MainContent>
                    <div className="text-section">
                        <h2>LOGIN</h2>
                        <div id="status"></div>
                        <input
                            type="text"
                            placeholder="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="sign-in-button" onClick={handleSubmit}>Sign in</button>
                        <h5>
                            Don't have an account? {" "}
                            <Link to="/registration" className="signup-link">Sign up</Link>
                        </h5>
                        {/*<h6>*/}
                        {/*    <Link to="/">return</Link>*/}
                        {/*    <Link to="/main">main</Link>*/}
                        {/*</h6>*/}
                    </div>
                </MainContent>
            </Card>
        </Container>
    );

}

