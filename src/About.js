import Header from "./Header";
import Footer from "./Footer";
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <>
            <Header />
            <div className="p-1 text-left" style={{ marginTop: "50px", marginLeft: "200px", marginRight: "200px" }}>
                <h2>Visual Acad AI</h2>
                <p>
                    Give a Brief intro
                </p>
                <h3>Code Visualizer</h3>
                <p>
                    Write about current version - capabilities and limitations
                </p>
                <h3>Future Work</h3>
                <p>
                    Write about further plans
                </p>
                <h3>Contributors</h3>
                <p>
                    Write about contributor details
                </p>
                <center>
                    <Link to="/">
                        <button className="button"> Visualize </button>
                    </Link>
                </center>
                <br />
            </div>
            <Footer/>
        </>
    );
}