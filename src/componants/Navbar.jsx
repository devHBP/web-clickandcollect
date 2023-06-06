import '../styles/styles.css'
import { AiOutlineUser, AiOutlineExport } from "react-icons/ai";
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/authSlice';
import { useDispatch } from 'react-redux';

function Navbar() {

    const dispatch = useDispatch()

    const handleLogout = () => {
        // console.log('deconnect')
        dispatch(logoutUser())
    }

    return (
      
        <div className='navbar'> 
            <Link to="/login"> <AiOutlineUser className='icone_navbar'/> </Link>
            <Link to="/"> <AiOutlineExport className='icone_navbar' onClick={handleLogout}/> </Link>
        </div>
        
      
    )
  }
  
  export default Navbar
  