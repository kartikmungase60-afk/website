"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const scale = keyframes`
  0% { transform: translate(-100%, 50%) scale(1); }
  100% { transform: translate(-100%, 50%) scale(5); }
`;

const packageAnim = keyframes`
  0% { transform: translate(0%, 100%); }
  10%, 50% { transform: translate(0%, 0%); }
  100% { transform: translate(325%, 0%); }
`;

const textAnim = keyframes`
  0% { transform: translate(0%, 0%); }
  10%, 100% { transform: translate(0%, -200%); }
`;

const text2Anim = keyframes`
  0%, 50% { transform: translate(-310%); }
  100% { transform: translate(0%); }
`;

const carAnim = keyframes`
  0%, 10% { transform: translate(-310%, 8%); }
  45%, 50% { transform: translate(-60%, 8%); }
  100% { transform: translate(350%, 8%); }
`;

const closeAnim = keyframes`
  0% { transform: rotate(210deg); }
  100% { transform: rotate(0deg); }
`;

const close2Anim = keyframes`
  0% { transform: rotate(-210deg); }
  100% { transform: rotate(0deg); }
`;

const ButtonWrapper = styled.button<{ $isTriggered: boolean }>`
  position: relative;
  width: 100%;
  height: 48px;
  background: linear-gradient(
    to bottom,
    rgb(0, 4, 218) 10%,
    rgb(24, 115, 252) 50%,
    rgb(0, 162, 255) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  overflow: hidden;
  user-select: none;
  border: 2px solid #0313fc;
  transition: transform 0.5s;
  cursor: pointer;
  margin-top: 1.25rem;

  &:hover {
    transform: scale(1.05);
  }

  .stars {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: white;
    z-index: 3;
    border-radius: 50%;
    transform: translate(-20px, -20px);
    display: ${(props) => (props.$isTriggered ? "none" : "block")};
    box-shadow:
      5px 10px white, 10px -2px white, 20px 0px white, 30px -5px white,
      -10px -5px white, -15px 2px white, -35px 0px white, 5px 10px white,
      10px -2px white, 20px 0px white, 30px -5px white, -10px -5px white,
      -15px 2px white, -35px 0px white, 50px 15px white, 60px -10px white,
      70px 20px white, 90px -15px white, 100px 5px white, 110px -25px white,
      90px 30px white, 80px -40px white, -50px 20px white, -70px -10px white,
      -90px 25px white, -100px -15px white, -110px 10px white, -90px -35px white,
      -80px 40px white, 40px 40px white, 30px -40px white, -30px 30px white,
      -40px -25px white, 60px 60px white, -60px -60px white, 70px -70px white,
      -70px 70px white, 0px 80px white, 0px -90px white, 90px 0px white,
      -100px 0px white, 45px 5px white, 65px 0px white, 75px 10px white,
      -60px 10px white, -40px 10px white, -45px -8px white, -55px -2px white,
      -30px 17px white;
  }

  .background {
    width: 50%;
    height: 160%;
    background-color: white;
    position: absolute;
    border-radius: 50%;
    transform: translate(-100%, 50%);
    box-shadow:
      -30px -40px 0px -7px #ffffffd8,
      40px 14px rgba(255, 255, 255, 0.507);
    animation: ${(props) => (props.$isTriggered ? scale : "none")} 1s forwards;
  }

  .background::before {
    content: "";
    width: 80%;
    height: 80%;
    background-color: white;
    position: absolute;
    border-radius: 50%;
    transform: translate(110%, 20%);
    box-shadow: 50px -5px #ffffffb2;
  }

  .background::after {
    content: "";
    width: 120%;
    height: 120%;
    background-color: white;
    position: absolute;
    border-radius: 50%;
    transform: translate(120%, 10%);
    box-shadow: 50px -20px #ffffffd8;
  }

  .order {
    color: white;
    font-weight: 900;
    font-size: 0.9rem;
    position: absolute;
    animation: ${(props) => (props.$isTriggered ? textAnim : "none")} 3s forwards;
  }

  .done {
    position: absolute;
    color: #0313fc;
    font-weight: 900;
    font-size: 0.9rem;
    transform: translate(-310%);
    animation: ${(props) => (props.$isTriggered ? text2Anim : "none")} 3s forwards;
  }

  .car-container {
    position: absolute;
    height: 100%;
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(-310%, 8%);
    animation: ${(props) => (props.$isTriggered ? carAnim : "none")} 3s ease forwards;
  }

  .car-part1 {
    position: absolute;
    width: 60%;
    height: 20%;
    background-color: #fed54a;
    bottom: 30%;
    left: 10%;
  }

  .car-part1::before {
    position: absolute;
    content: "";
    width: 75%;
    height: 220%;
    background-color: #b1c5ed;
    left: 20%;
    bottom: 100%;
    clip-path: polygon(0% 100%, 10% 0%, 80% 0%, 100% 100%);
  }

  .car-part1::after {
    position: absolute;
    content: "";
    width: 50%;
    height: 100%;
    background-color: #fed54a;
    left: 0%;
    bottom: 100%;
    clip-path: polygon(0% 100%, 0% 0%, 50% 0%, 100% 100%);
  }

  .wheels {
    position: absolute;
    width: 28%;
    height: 35%;
    background-color: black;
    border-radius: 50%;
    left: 5%;
    bottom: 15%;
  }

  .wheels::before {
    content: "";
    position: absolute;
    width: 80%;
    height: 70%;
    background-color: black;
    border-radius: 50%;
    left: 180%;
    bottom: 0%;
  }

  .car-part2 {
    position: absolute;
    width: 7%;
    height: 70%;
    background-color: black;
    left: 68%;
    bottom: 25%;
  }

  .car-part2::before {
    content: "";
    position: absolute;
    width: 155%;
    height: 50%;
    background-color: black;
    left: 0%;
    bottom: 0%;
  }

  .car-part2::after {
    content: "";
    position: absolute;
    width: 555%;
    height: 6%;
    background-color: black;
    left: 0%;
    bottom: 0%;
  }

  .details {
    position: absolute;
    width: 30%;
    height: 3%;
    background-color: #fed54a;
    top: 5%;
    left: 25%;
  }

  .details::before {
    content: "";
    position: absolute;
    width: 50%;
    height: 650%;
    border-radius: 50%;
    background-color: #fed54a;
    top: 1750%;
    left: -45%;
  }

  .details::after {
    content: "";
    position: absolute;
    width: 30%;
    height: 400%;
    border-radius: 50%;
    background-color: #fed54a;
    top: 2060%;
    left: 125%;
  }

  .package-container {
    position: absolute;
    width: 25%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(0%, 100%);
    animation: ${(props) => (props.$isTriggered ? packageAnim : "none")} 3s forwards;
  }

  .package {
    position: absolute;
    width: 45%;
    height: 40%;
    background-color: #ffb571;
  }

  .package::after {
    content: "";
    position: absolute;
    width: 50%;
    height: 5%;
    background-color: #d57d2b;
    right: 0%;
    top: -2%;
    transform: rotate(210deg);
    transform-origin: right;
    animation: ${(props) => (props.$isTriggered ? closeAnim : "none")} 0.5s ease-in-out 0.15s forwards;
  }

  .package::before {
    content: "";
    position: absolute;
    width: 50%;
    height: 5%;
    background-color: #d57d2b;
    left: 0%;
    top: -2%;
    transform: rotate(-210deg);
    transform-origin: left;
    animation: ${(props) => (props.$isTriggered ? close2Anim : "none")} 0.5s ease-in-out 0.15s forwards;
  }

  .package-details {
    position: absolute;
    background-color: #754433;
    width: 10%;
    height: 10%;
    top: 30%;
  }

  .package-details::before {
    content: "";
    position: absolute;
    background-color: #ededed;
    width: 100%;
    height: 100%;
    bottom: -280%;
    left: -150%;
  }

  .package-details::after {
    content: "";
    position: absolute;
    background-color: #8f8f8f;
    width: 40%;
    height: 40%;
    bottom: -230%;
    left: -105%;
  }

  .package-text {
    position: absolute;
    z-index: 2;
    bottom: 32%;
    right: 30%;
    font-size: 0.4rem;
  }
`;

export default function AnimatedOrderButton({ link }: { link: string }) {
  const [isTriggered, setIsTriggered] = useState(false);

  const handleClick = () => {
    if (isTriggered) return;
    setIsTriggered(true);
    // Redirect after animation completes (3 seconds)
    setTimeout(() => {
      window.location.href = link;
    }, 3000);
  };

  return (
    <ButtonWrapper onClick={handleClick} $isTriggered={isTriggered}>
      <div className="stars"></div>
      <div className="background"></div>
      <span className="order">Order Now</span>
      <span className="done">Processing...</span>
      <div className="car-container">
        <div className="car-part1"></div>
        <div className="car-part2"></div>
        <div className="wheels"></div>
        <div className="details"></div>
      </div>
      <div className="package-container">
        <div className="package"></div>
        <div className="package-details"></div>
        <span className="package-text">📦</span>
      </div>
    </ButtonWrapper>
  );
}
