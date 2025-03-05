import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Real Estate Chat</h2>
      <nav>
        <Link to="/chat">Chat</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
