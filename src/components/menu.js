import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function MenuComp({ saveCurrPalette, user, login, logout, palettes, edit }) {

    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {

    }, [user])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        login(true);
        handleClose();
    }

    const handleLogout = () => {
        logout(true);
        handleClose();
        palettes(false);
    }

    const handlePalettes = () => {
        palettes(true);
        handleClose();
    }

    const savePalette = () => {
        saveCurrPalette(true);
        handleClose();
    }

    const editPalette = () => {
        edit(true);
        handleClose();
    }

    return (
        <div>
            <Button 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="34" height="34" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
            </Button>
            <Menu   
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        backgroundColor: '#343434',
                        color: '#f3f3f3'
                    }
                }}
            >
                {user === undefined
                    ?   (<MenuItem onClick={handleLogin}>Login</MenuItem>)
                    :   (<div>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            <MenuItem onClick={savePalette} onTouchEnd={savePalette}>Save Palette</MenuItem>
                            <MenuItem onClick={handlePalettes}>Saved Palettes</MenuItem>
                        </div>)
                }
                
            </Menu>
        </div>
    )
}

export default MenuComp