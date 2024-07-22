import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <nav className="navbar" style={{background:'#444444', height:'40px'}}>
                <a style={{fontFamily:'-moz-initial' ,fontSize:'30px', color:'#eeeeee', justifyContent:'center', display:'flex'}}>Visual Acad AI</a>
                <div className="navbar-nav"> 
                </div>
            </nav>
        </header>
    );
}