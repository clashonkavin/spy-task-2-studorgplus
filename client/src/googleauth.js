import Navbar from "./navbar";

const GoogleAuth = () => {
  const HandleOauth = (e) => {
    window.location.href = "http://localhost:5000/gclndr/Oauth2";
  };

  return (
    <div>
      <Navbar />
      <div className="Oauth">
        <p>Give access to your Google Calender</p>
        <button id="oauthButton" onClick={HandleOauth}>
          Authorize Calender
        </button>
      </div>
    </div>
  );
};

export default GoogleAuth;
