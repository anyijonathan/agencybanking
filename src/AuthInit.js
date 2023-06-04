import React, { useContext, useEffect, useState, useRef } from 'react'
import { Store } from './store'
import { setAuthData } from './store/actions'
import { getStoredAuthData } from './utils/helpers/auth'
import ThemedSuspense from './components/LoadingIndicator'

const AuthInit = (props) => {
  const didRequest = useRef(false)
  const { dispatch } = useContext(Store)

  const [showSplashScreen, setShowSplashScreen] = useState(true)
  useEffect(() => {
    const data = getStoredAuthData()
    const requestUser = () => {
      try {
        if (!didRequest.current) {
          if (data) {
            dispatch(setAuthData(data))
          }
        }
      } catch (error) {
        if (!didRequest.current) {
          console.log(error)
        }
      } finally {
        setShowSplashScreen(false)
      }
      return () => (didRequest.current = true)
    }
    if (data?.Email) {
      requestUser()
    } else {
      setShowSplashScreen(false)
    }
  }, [])
  return showSplashScreen ? <ThemedSuspense /> : <>{props.children}</>
}

export default AuthInit