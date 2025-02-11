import {useContext, useState} from "react";
import Container from "../template/Container";
import Card from "../template/Card";
import MainContent from "../template/MainContent";
import '../styles/login.css';
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function sendRegistration(login, password) {
    const f = false;
    return fetch('http://localhost:8080/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({login, password, f}),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Some problems with response');
        }
        return response.json();
    });
}

export default function RegisterForm() {
    const {userEnter} = useContext(UserContext);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Получаем функцию навигации

    const handleSubmit = (event) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        sendRegistration(login, password)
            .then(data => {
                if (data.exist === true) { // Проверяем, успешен ли логин
                    userEnter(data); // Обновляем состояние авторизации
                    navigate('/main');
                } else {
                    document.getElementById("status").style.color = "red"
                    document.getElementById("status").innerText = "Аккаунт с таким логином уже существует";
                }
            }).catch(error => {
            document.getElementById("status").style.color = "red"
            document.getElementById("status").innerText = "Возникла неизвестная ошибка";
        });
    };

    return (
        <Container>
            <Card style={{width: 400, height: 500}}>
                <MainContent>
                    <div className="text-section">
                        <h2>REGISTER</h2>
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
                        <button className="sign-in-button" onClick={handleSubmit}>Sign up</button>
                        <h5>
                            You already have an account? {" "}
                            <Link to="/login" className="signup-link">Sign in</Link>
                        </h5>
                    </div>
                </MainContent>
            </Card>
        </Container>
    );
}