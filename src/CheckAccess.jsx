import React, {useEffect, useState} from 'react';
import axios from 'axios';

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

                console.error('Ошибка запроса:', error);
            });
    }, []);

    return isSuperUser ? <div>У вас есть доступ.</div> : <div>Доступ запрещён.</div>;
}
