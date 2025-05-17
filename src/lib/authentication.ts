export const checkAuthentication = (): boolean => {
    const token = localStorage.getItem('token');
    return token != null;
}

export const getAuthenticationToken = (): string | null => {
    return localStorage.getItem('token');
}

export const saveAuthenticationToken = (token: string): void => {
    localStorage.setItem('token', token);
}

export const removeAuthenticationToken = (): void => {
    localStorage.removeItem('token');
}