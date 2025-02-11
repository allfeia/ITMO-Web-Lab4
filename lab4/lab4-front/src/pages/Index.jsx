import { useState, useEffect } from "react";
import styled from "styled-components";
import star from '../static/IMG_1199.png'
import LoginButton from "../log&reg/LoginButton";
import Container from "../template/Container"
import Card from "../template/Card"
import Header from "../template/Header";
import Author from "../template/Author";
import MainContent from "../template/MainContent";
import TextSection from "../template/TextSection";
import Title from "../template/Title";
import SideText from "../template/SideText";

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 80%;
  max-width: 500px;
  object-fit: cover;
  border-radius: 10px;
`;

const Clock = styled.div`
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
`;

export default function Index() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <Card>
                <Header>
                    <span>var.1234</span>
                    <Author>
                        <span>Nabokova</span>
                        <span>Alisa</span>
                        <span>Vladislavovna</span>
                        <span>P3220</span>
                    </Author>
                </Header>

                <MainContent>
                    <TextSection>
                        <Title>lab.4</Title>
                        <LoginButton/>
                        <Clock>{time}</Clock>
                    </TextSection>
                    <ImageSection>
                        <Image src={star} />
                    </ImageSection>
                </MainContent>

                <SideText>WLAB REACT & SPRING `25</SideText>
            </Card>
        </Container>
    );
}
