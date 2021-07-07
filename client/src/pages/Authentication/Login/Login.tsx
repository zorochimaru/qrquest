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

        dispatch(login({ email: regEmail, password: regPass }));
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
                    <img src="logo.png" alt="" />
                    <TextField inputRef={email} id="email" placeholder="email" variant="outlined" />
                    <TextField inputRef={password} id="pass" placeholder="password" type="password" variant="outlined" />
                    <Grid container
                        justify="space-around" >
                        <Button onClick={handleLogin} variant="contained" color="primary">
                            Login
                        </Button>
                        <Link to={'/register'}>
                            Register
                        </Link>
                    </Grid>

                </Grid>
            </Paper>
        </Grid>


    )
}
export default LoginPage;