import axios from 'axios';

const googleClient = axios.create({
    baseURL: 'https://www.googleapis.com/oauth2/v2'
});

export type GoogleUserInfo = {
    email: string;
};
export async function getUser(access_token: string): Promise<GoogleUserInfo> {
    const res = await googleClient.get<GoogleUserInfo>('/userinfo', {
        headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: '*/*'
        },
    });

    return res.data;
}