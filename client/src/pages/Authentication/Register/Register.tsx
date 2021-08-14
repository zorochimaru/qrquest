import { Paper, Button, TextField, Grid } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux"
import { register } from "../../../redux/Auth";
import classes from './Register.module.css';

const RegisterPage: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const email = useRef<HTMLInputElement>(null);
    const nickname = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const rePassword = useRef<HTMLInputElement>(null);

    const handleRegister = () => {
        const regEmail = email.current!.value;
        const regPass = password.current!.value;
        const reRegPass = rePassword.current!.value;
        const regNickname = nickname.current!.value;
        dispatch(register({ email: regEmail, password: regPass, confirmPassword: reRegPass, name: regNickname }));
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
                    <TextField inputRef={nickname} id="nickname" placeholder="name" variant="outlined" />
                    <TextField inputRef={password} id="pass" placeholder="password" type="password" variant="outlined" />
                    <TextField inputRef={rePassword} id="rePass" placeholder="repeat password" type="password" variant="outlined" />
                    <Grid container
                        justify="space-around" alignItems="center" >
                        <Button onClick={handleRegister} variant="contained" color="primary">
                            Register
                        </Button>
                        <Link to={'/reset'}>
                            Reset password
                        </Link>
                        <Link to={'/login'}>
                            Login
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>


    )
}
export default RegisterPage;