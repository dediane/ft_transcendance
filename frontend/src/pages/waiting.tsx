import React, { useEffect, useState, useContext } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import authenticationService from '@/services/authentication-service';
import userService from '@/services/user-service';
import { ContextGame } from '@/game/GameContext';
import ConnectService from '@/services/Connect';

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function Wait() {
  const { socket } = useContext(ContextGame);
  const [userData, setUserData] = useState({ username: '', id: '' });
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    const fetchProfile = async () => {
      const result = await userService.profile();
      setUserData({ ...result });
    };

    if (!authenticationService.getToken()) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [router, socket]);

  useEffect(() => {
    if (!userData) return;

    const join = async () => {
      // console.log('userdata to join ', userData.id, userData.username);
      const payload = { id: userData.id, username: userData.username };
      ConnectService.Connect(socket, payload);
    };

    join();
  }, [userData, socket]);

  return (
    <div>
      <WelcomeText style={{ fontWeight: 'bold', fontSize: '2rem' }}>
        Wait for your mate to come and play
      </WelcomeText>
    </div>
  );
}
