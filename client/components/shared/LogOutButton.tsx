import React from 'react'
import { Button } from '../ui/button'
import { LogOutIcon } from 'lucide-react'
import { usePlayer } from '@/providers/usePlayer'

const LogOutButton = () => {

    const {logout} = usePlayer()

    const handleLogOut = () => {
        logout();
    }
  return (
    <div>
          <Button type='button' variant="ghost" size="icon" className="outline-none cursor-pointer" onClick={handleLogOut}>
              <LogOutIcon width={20} height={20} className=" checkDarkTheme-Text" />
          </Button>
    </div>
  )
}

export default LogOutButton