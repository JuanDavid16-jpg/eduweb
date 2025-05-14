export const getServerData = async (endpoint) => {
    const response = await fetch(process.env.NEXT_PUBLIC_APP_DOMAIN + "/api" + endpoint);
    const { data } = await response.json();

    return data;
};
