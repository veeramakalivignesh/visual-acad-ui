import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header style={{ position: "sticky", top: "0" }}>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <a className="navbar-brand">&nbsp; Visual Acad AI</a>
                <div className="navbar-nav">
                    <Link to="/about">
                        <a className="nav-item nav-link">About</a>
                    </Link>
                    <Link to="/">
                        <a className="nav-item nav-link">Visualizer</a>
                    </Link>
                    <a className="nav-item nav-link" href="https://github.com/veeramakalivignesh/visual-acad-ui">Github</a>
                </div>
            </nav>
        </header>
    );
}