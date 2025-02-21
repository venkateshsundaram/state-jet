export const saveState = (key: string, value: any, encrypt = false) => {
    if (typeof window !== "undefined") {
        let data = JSON.stringify(value);
        if (encrypt) data = btoa(data);
        localStorage.setItem(key, data);
    }
};

export const restoreState = (key: string) => {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(atob(data)) : undefined;
    }
};
