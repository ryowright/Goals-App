import React, { useState } from 'react';
import { logout } from '../../actions/auth';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// Drawer
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
}));


const Appbar = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [ showDrawer, setShowDrawer ] = useState(false);

    const handleLogout = () => {
      console.log('attempting logout');
      dispatch(logout());
    }

    const list = () => (
      <div
      className={classes.list}
      role="presentation"
      onClick={() => setShowDrawer(false)}
    >
      <List>
        {['My Profile', 'Settings'].map((text) => (
          <ListItem button key={text}>
            <Link to="/settings">
              <ListItemText primary={text} />
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

    const sideDrawer = () => {
      return (
          <Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)}>
            {list()}
          </Drawer>
      )
    }

    return(
    <div className={classes.root} >
    {sideDrawer()}
    <AppBar position="static">
        <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setShowDrawer(true)}>
            <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
            {props.title}
        </Typography>
        <Button color="inherit" onClick={() => handleLogout()}>Logout</Button>
        </Toolbar>
    </AppBar>
    </div>
    )
}

export default Appbar;