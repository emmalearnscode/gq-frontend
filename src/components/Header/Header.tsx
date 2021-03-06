import styles from './Header.module.css'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Logo from '../../assets/logos/gq-logo-white.svg'
import accountWhite from '../../assets/icons/account-white.png'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { logoutUser } from '../../store/user/userSlice.actions'

const Header = () => {
  const user = useAppSelector(state => state.user.user)

  const dispatch = useAppDispatch()
  const history = useHistory()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logoutUser())
    history.replace('/')
  }

  return (
    <header className={styles.header}>
      <Link to={user ? '/play' : '/'} className={styles.logoContainer}>
        <img src={Logo} alt="" className={styles.logo} />
        <p className={styles.logoText}>geoQuizzr</p>
      </Link>
      {!user && (
        <div className={styles.buttonContainer}>
          <Link to="/login" className={styles.linkOutline}>
            Log in
          </Link>
          <Link to="/signup" className={styles.linkFill}>
            Sign Up
          </Link>
        </div>
      )}
      {user && (
        <div className={styles.buttonContainer}>
          {location.pathname === '/play' && (
            <Link to="/profile" className={styles.profileImageLink}>
              <img src={accountWhite} alt="profile icon" className={styles.profileImage} />
            </Link>
          )}
          {location.pathname === '/profile' && (
            <Link to="/play" className={styles.navLink}>
              Play
            </Link>
          )}
          <button className={styles.buttonOutline} type="button" role="link" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
