import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const ModaleEditProfile = ({ isOpen, handleClose, user, onUpdateUser }) => {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setPhone] = useState("");

  useEffect(() => {

    if (user) {
      setLastname(user.lastname || "");
      setFirstname(user.firstname || "");
      setEmail(user.email || "");
      setPhone(user.telephone || "");
    }
  }, [user]);


  const handleEdit = async (e) => {

    const updateData = {
        lastname,
        firstname,
        email,
        telephone
    }

    onUpdateUser( user.userId, updateData)

    e.preventDefault();
    handleClose();
  };
  const closeModale = async (e) => {
    console.log("close");
    handleClose();
  };

  return (
    <div className="modale_container">
      <div className="modale">
      <div className="title_modale">
            <p>
              Modification de l'utilisateur: {" "}
              <span className="spanUser">{user.firstname} {user.lastname}</span>
            </p>
            <AiFillCloseCircle
          className="button_close"
          onClick={() => closeModale()}
        />
          </div>
        
        <div className="modale_content">
          
          <form onSubmit={handleEdit}>

            {/* Nom */}
            <div className="inputOptions">
              <label htmlFor="code">Nom:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            {/* Prenom */}
            <div className="inputOptions">
              <label htmlFor="firstname">Prénom:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="inputOptions">
              <label htmlFor="phone">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Téléphone */}
            <div className="inputOptions">
              <label htmlFor="phone">Téléphone:</label>
              <input
                type="text"
                id="telephone"
                name="telephone"
                value={telephone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>


            <button type="submit">Valider</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModaleEditProfile;
