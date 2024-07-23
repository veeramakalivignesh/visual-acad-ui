export default function Footer() {
  return (
      <footer>
          <nav className="navbar-dark"
              style={{ background: "#1d1d1d", color:"lightgrey" }}>
              <div className='p-1 text-center' >
                <span>&copy; {new Date().getFullYear()} Visual Acad AI &nbsp;&nbsp; mvignesh@iitdalumni.com &nbsp;&nbsp; +1-858-518-9851</span>
              </div>
          </nav>
      </footer>
  );
}