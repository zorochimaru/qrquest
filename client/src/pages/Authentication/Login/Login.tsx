import { Paper, Button, TextField, Grid } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux"
import { login } from "../../../redux/Auth";
import classes from './Login.module.css';

const LoginPage: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleLogin = () => {
        const regEmail = email.current!.value;
        const regPass = password.current!.value;
        if (regEmail && regPass) {
            dispatch(login({ email: regEmail, password: regPass }));
        }
    }


    return (
        <Grid
            container
            className={classes.wrapper}
            justify="center"
            alignItems="center"
        >
            <Paper className={classes.card} elevation={3} >
                <Grid
                    className={classes.wrapper}
                    spacing={3}
                    container
                    justify="center"
                    alignItems="center"
                >
                    <img src="/logo.png" alt="" />
                    <TextField inputRef={email} id="email" placeholder="email" variant="outlined" />
                    <TextField style={{marginTop: 15}} inputRef={password} id="pass" placeholder="password" type="password" variant="outlined" />
                    <Grid container
                        justify="space-around" alignItems="center" >
                        <Button onClick={handleLogin} variant="contained" color="primary" style={{marginTop: 15}}>
                            Login
                        </Button>
                    </Grid>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 15 }}>
                        <Link to={'/reset'} style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="default">Reset password</Button>
                        </Link>
                        <Link to={'/register'} style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="default">Register</Button>
                        </Link>
                    </div>
                </Grid>
            </Paper>
        </Grid>


    )
}
export default LoginPage;