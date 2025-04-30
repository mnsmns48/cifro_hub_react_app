import {useEffect, useState} from 'react';
import axios from 'axios';
import Authorization from "./Authorization.jsx";
import ServiceApp from "../ServiceApp.jsx";

export default function CheckAccess() {
    const [isSuperUser, setIsSuperUser] = useState(false);
    useEffect(() => {
        axios.get('/auth', {withCredentials: true})
            .then(response => {
                const user = response.data;
                if (user.is_active && user.is_verified && user.is_superuser) {
                    setIsSuperUser(true);
                }
            })
            .catch(error => {
                console.error('Ошибка запроса проверки пользователя:', error);
            });
    }, []);
    return isSuperUser ? <ServiceApp/> : <Authorization/>;
}
