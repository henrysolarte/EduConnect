import React from 'react';

// Basic mock components for react-router-dom
export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const MemoryRouter = ({ children }) => <div>{children}</div>;
export const Router = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = ({ element }) => element;
export const Link = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
export const NavLink = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
export const Navigate = () => null;
export const Outlet = () => null;

// Hooks
export const useNavigate = () => jest.fn();
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });
export const useParams = () => ({});
export const useSearchParams = () => [new URLSearchParams(), jest.fn()];
export const useMatch = () => null;
