import Container from "../template/Container";
import MainContent from "../template/MainContent";
import '../styles/main.css';
import {useContext, useEffect, useState} from 'react';
import Card from "../template/Card";
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";

function InputComponent() {
    const [yValue, setYValue] = useState('');

    const handleInputChange = (e) => {
        const input = e.target.value;
        if (validateYInput(input)) {
            setYValue(input);
        }
    };

    return (
        <input
            type="text"
            id="yInput"
            value={yValue}
            onChange={handleInputChange}
            placeholder="-5 to 5"
        />
    );
}

function validateYInput(input) {
    if (input === "") return true;

    const normalizedInput = input.replace(",", ".");

    const isIntermediate = /^-?$|^-?[0-5]?\.?$|^-?\.\d{0,2}$/.test(normalizedInput);
    if (isIntermediate) return true;

    const formatValid = /^-?[0-5](\.\d{0,2})?$/.test(normalizedInput);
    if (!formatValid) return false;

    const numberValue = Number(normalizedInput);
    return numberValue >= -5 && numberValue <= 5;
}

function Page() {
    const {currentUser, userExit} = useContext(UserContext);
    const login = currentUser?.login;
    const password = currentUser?.password;

    const [currentPage, setCurrentPage] = useState(0);
    const [allPoints, setAllPoints] = useState([]);

    useEffect(() => {
        const isExist = true;

        function loadPoints() {
            console.log("load points");
            fetch(`http://localhost:8080/getPoints?login=${login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login, password, isExist}),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Some problems with response');
                }
                return response.json();
            }).then(json => {
                setAllPoints(json.content);
            }).catch(error => console.error(error));
        }

        loadPoints();
    }, [login, password]);

    useEffect(() => {
        updatePagination();
        showPage(currentPage);
    }, [currentPage, updatePagination]);

    useEffect(() => {
        const table = document.getElementById('resultsTable');
        while (table.rows.length > 1) table.deleteRow(1);

        allPoints.forEach(point => {
            insertToTable(point.x, point.y, point.r, point.hit, point.executionTime, point.serverTime);
        });

        updatePagination();
    }, [allPoints, updatePagination]);

    function insertToTable(x, y, r, hit, executionTime, serverTime) {
        const table = document.getElementById("resultsTable");
        const newRow = table.insertRow();

        const formattedDate = serverTime.split(' ')[0].split('-').reverse().join('-');
        newRow.setAttribute('data-time', `${formattedDate} ${serverTime.split(' ')[1]}`);

        const cells = [
            x, y, r,
            hit ? "Include" : "Not include",
            executionTime,
            serverTime
        ];

        cells.forEach((text, index) => {
            const cell = newRow.insertCell(index);
            cell.innerText = text;
        });
    }


    function createPagination() {
        const table = document.getElementById('resultsTable');
        const items = Array.from(table.rows).slice(1);
        const parent = table.parentNode;
        const pagination = parent.querySelector('.pagination');
        if (pagination) pagination.remove();

        const itemsPerPage = 5;
        const pageCount = Math.ceil(items.length / itemsPerPage);

        if (pageCount <= 1) return;

        const container = document.createElement('div');
        container.className = 'pagination';
        table.parentNode.insertBefore(container, table.nextSibling);

        for (let i = 0; i < pageCount; i++) {
            const btn = document.createElement('button');
            btn.textContent = i + 1;
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.onclick = () => setCurrentPage(i);
            container.appendChild(btn);
        }
    }

    function showPage(page) {
        const table = document.getElementById('resultsTable');
        const rows = Array.from(table.rows).slice(1);

        // Sort by date
        rows.sort((a, b) =>
            new Date(b.getAttribute('data-time')) - new Date(a.getAttribute('data-time'))
        );
        // Paginate
        const start = page * 5;
        const end = start + 5;
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
    }

    function updatePagination(){
        createPagination();
        showPage(currentPage);
    }

    function buttonClick() {
        const xValue = document.getElementById("x-value").value;
        const rValue = document.getElementById("r-value").value;
        const yValue = document.getElementById("yInput");
        const yInput = yValue.value.trim();

        if (yInput) {
            removeError(yValue);
        } else {
            createError(yValue, "Please enter the coordinate Y");
            return;
        }

        if (xValue && yValue.value && rValue) {
            checkPoint(xValue, yValue.value, rValue);
        }
    }


    function checkPoint(x, y, r){
        fetch('http://localhost:8080/checkpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({x, y, r, login}),

        }).then(response => {
            if (!response.ok){
                throw new Error("Some problems with response");
            }
            return response.json();

        }).then(json => {
            console.log(json);
            setAllPoints(prevPoints => [{
                x: json.x,
                y: json.y,
                r: json.r,
                hit: json.hit,
                executionTime: json.executionTime,
                serverTime: json.serverTime
            }, ...prevPoints]);
            setCurrentPage(0);
            drawPoint(json.x, json.y, json.r, json.hit)
        });

    }


    function drawPoint(x, y, r, answer){
        const svg = document.getElementById("axis-svg");
        if (!svg){
            console.error("svg not found");
            return;
        }
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", parseFloat(x) / 3 * 100 + 150);
        circle.setAttribute("cy", parseFloat(y) / 3 * 100 * -1 + 150);
        circle.setAttribute("r", 3);
        circle.setAttribute("fill", answer ? "green" : "red");


        svg.appendChild(circle);

    }

    useEffect(() => {
        const svgElement = document.getElementById('axis-svg');
        if (!svgElement) {
            console.error("SVG элемент не найден");
            return; // Early exit if SVG is not found
        }

        const clickHandler = (event) => {
            const rect = svgElement.getBoundingClientRect();
            const xGraph = event.clientX - rect.left;
            const yGraph = event.clientY - rect.top;
            const x = ((xGraph - 150) / 100 * 3).toFixed(2);
            const y = ((yGraph - 150) / 100 * -1 * 3).toFixed(2);

            const r = document.getElementById('r-value').value;

            checkPoint(x, y, r);
        };

        svgElement.addEventListener('click', clickHandler);


        return () => {
            svgElement.removeEventListener('click', clickHandler);
        };
    }, [login, checkPoint]);

    function clearPoints() {
        const svgElement = document.getElementById('axis-svg');


        // Преобразуем HTMLCollection в массив и удаляем каждый элемент
        const circles = svgElement.getElementsByTagName('circle');
        const circleArray = Array.from(circles);

        circleArray.forEach(circle => {
            svgElement.removeChild(circle);
        });
    }

    useEffect(() => {
        const r = document.getElementById("r-value");

        const handleChange = (event) => {
            const newR = parseFloat(event.target.value);
            if (!isNaN(newR)) {
                reDrawAxis(newR);
            }
        };

        r.addEventListener("change", handleChange);

        return () => {
            r.removeEventListener("change", handleChange);
        };
    }, []);

    function reDrawAxis(newR) {
        const svg = document.getElementById('axis-svg');

        const rect = svg.querySelector("rect.figure")
        const polygon = svg.querySelector("polygon.figure")
        const path = svg.querySelector("path.figure")

        rect.setAttribute("x", 150)
        rect.setAttribute("y", 150 - newR * 16.6)
        rect.setAttribute("width", newR * 33.2)
        rect.setAttribute("height", newR * 16.6)

        path.setAttribute(
            "d",
            `
        M ${150 - newR * 33.2} 150
        A ${newR * 33.2} ${newR * 33.2}
        0 0 0
        150 ${150 + newR * 33.2}
        L 150 150 Z
        `
        );

        polygon.setAttribute(
            "points",
            `
        150, 150
        ${150 + newR * 33.2}, 150
        150, ${150 + newR * 33.2}
        `
        );

    }

    function removeError(element) {
        const errorElement = element.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    function createError(element, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = message;
        element.parentNode.appendChild(errorElement);
    }


    return (
        <div>
            <div className="main-container">
                <button id="exit" onClick={userExit}>Home</button>
                <Card style={{height: "300px", marginTop: "5%"}}>
                    <section className="block plot-section">
                        <div className="left-block" id="axis">

                            <svg height="300" width="300" xmlns="http://www.w3.org/2000/svg" id="axis-svg">
                                //ось x
                                <line x1="0" x2="300" y1="150" y2="150" stroke="black"></line>
                                {/*ось y -->*/}
                                <line x1="150" x2="150" y1="0" y2="300" stroke="black"></line>

                                <polygon fill="black" points="150,0 144,15 156,15" stroke="black"></polygon>
                                <polygon fill="black" points="300,150 285,156 285,144" stroke="black"></polygon>

                                {/*+x: R/2 -->*/}
                                <line stroke="black" x1="166.8" x2="166.8" y1="155" y2="145"></line>

                                <line stroke="black" x1="183.4" x2="183.4" y1="155" y2="145"></line>

                                <line stroke="black" x1="200" x2="200" y1="155" y2="145"></line>
                                {/*2 -->*/}
                                <line stroke="black" x1="216.6" x2="216.6" y1="155" y2="145"></line>
                                {/*2.5 -->*/}
                                {/*<line stroke="black" x1="232.6" x2="232.6" y1="155" y2="145"></line>*/}
                                {/*R -->*/}
                                {/*<line stroke="black" x1="250" x2="250" y1="155" y2="145"></line>*/}

                                {/*-x: -R -->*/}

                                {/*<line stroke="black" x1="50" x2="50" y1="155" y2="145"></line>*/}

                                {/*<line stroke="black" x1="66.6" x2="66.6" y1="155" y2="145"></line>*/}

                                <line stroke="black" x1="83.2" x2="83.2" y1="155" y2="145"></line>

                                {/*-R/2 -->*/}
                                <line stroke="black" x1="100" x2="100" y1="155" y2="145"></line>

                                <line stroke="black" x1="116.6" x2="116.6" y1="155" y2="145"></line>

                                <line stroke="black" x1="132.6" x2="132.6" y1="155" y2="145"></line>

                                {/*+y: R/2 -->*/}
                                <line stroke="black" x1="145" x2="155" y1="132.6" y2="132.6"></line>

                                <line stroke="black" x1="145" x2="155" y1="116.6" y2="116.6"></line>

                                <line stroke="black" x1="145" x2="155" y1="100" y2="100"></line>

                                <line stroke="black" x1="145" x2="155" y1="83.2" y2="83.2"></line>

                                {/*<line stroke="black" x1="145" x2="155" y1="66.6" y2="66.6"></line>*/}

                                {/*R -->*/}
                                {/*<line stroke="black" x1="145" x2="155" y1="50" y2="50"></line>*/}

                                {/*-y: -R/2 -->*/}
                                <line stroke="black" x1="145" x2="155" y1="166.8" y2="166.8"></line>

                                <line stroke="black" x1="145" x2="155" y1="183.4" y2="183.4"></line>

                                <line stroke="black" x1="145" x2="155" y1="200" y2="200"></line>

                                <line stroke="black" x1="145" x2="155" y1="216.6" y2="216.6"></line>

                                {/*<line stroke="black" x1="145" x2="155" y1="232.6" y2="232.6"></line>*/}
                                {/*R -->*/}
                                {/*<line stroke="black" x1="145" x2="155" y1="250" y2="250"></line>*/}

                                <text fill="black" x="160" y="10">Y</text>
                                <text fill="black" x="290" y="140">X</text>

                                {/*прямоугольник справа вверху -->*/}
                                <rect className="figure" x="150" y="117" width="66.5" height="33" fill="black"
                                      fillOpacity="0.2" stroke="black">
                                </rect>
                                {/*треугольник справа снизу -->*/}
                                <polygon className="figure" fill="black" fillOpacity="0.2"
                                         points="150,150 217,150 150, 217"
                                         stroke="black">
                                </polygon>
                                {/*полукруг слева снизу -->*/}
                                <path className="figure" d="M 83 150 A 70, 70, 0, 0, 0, 150 217 L 150 150 Z"
                                      fillOpacity="0.2" fill="black"
                                      stroke="black"></path>
                            </svg>
                            <div className='coordinates' id='coordinates'></div>
                        </div>
                    </section>
                </Card>
                <div className="right-block">
                    <div className="form-group">
                        <h4 className="select">Choose X:</h4>
                        <select name="x" id="x-value">
                            <option value="2">2</option>
                            <option value="1.5">1.5</option>
                            <option value="1">1</option>
                            <option value="0.5">0.5</option>
                            <option value="0">0</option>
                            <option value="-0.5">-0.5</option>
                            <option value="-1">-1</option>
                            <option value="-1.5">-1.5</option>
                            <option value="-2">-2</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <h4 className="input">Choose Y:</h4>
                        <InputComponent/>
                    </div>

                    <div className="form-group">
                        <h4 className="select">Choose R:</h4>
                        <select name="r" id="r-value">
                            <option value="2">2</option>
                            <option value="1.5">1.5</option>
                            <option value="1">1</option>
                            <option value="0.5">0.5</option>
                        </select>
                    </div>

                    <div className="button-container">
                        <button id="checkButton" onClick={buttonClick}>Check</button>
                    </div>
                    <br/>

                    <div className="button-container">
                        <button id="clear" onClick={clearPoints}>Clear</button>
                    </div>

                    <div className="table">
                        <table id="resultsTable" border="1">
                            <tbody>
                            <tr>
                                <th><h2 className="headerOfTable">X</h2></th>
                                <th><h2 className="headerOfTable">Y</h2></th>
                                <th><h2 className="headerOfTable">R</h2></th>
                                <th><h2 className="headerOfTable">Response</h2></th>
                                <th><h2 className="headerOfTable">Execution time (nsec)</h2></th>
                                <th><h2 className="headerOfTable">Current time</h2></th>
                            </tr>
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default function Main() {
    const {currentUser} = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <Container>
            <MainContent>
                {(currentUser != null && currentUser.login) ? (
                    <Page/>
                ) : (
                    navigate("/")
                )}
            </MainContent>
        </Container>
    );
}