import { Paper, Button, TextField, Grid } from "@mui/material";
import { Link, RouteComponentProps } from "@reach/router";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux"
import { sendResetPasswordEmail } from "../../../redux/Auth";
import classes from './Reset.module.css';

const ResetPage: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const email = useRef<HTMLInputElement>(null);

    const handleReset = () => {
        const regEmail = email.current!.value;
        dispatch(sendResetPasswordEmail(regEmail));
    }


    return (
        <Grid
            container
            className={classes.wrapper}
            justifyContent="center"
            alignItems="center"
        >
            <Paper className={classes.card} elevation={3} >
                <Grid
                    className={classes.wrapper}
                    spacing={3}
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <img src="/logo.png" alt="" />
                    <TextField inputRef={email} id="email" placeholder="email" variant="outlined" />
                    <Grid container
                        justifyContent="space-around" alignItems="center" >
                        <Button onClick={handleReset} variant="contained" color="primary">
                            Change password
                        </Button>

                    </Grid>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 15 }}>
                            <Link to={'/register'} style={{ textDecoration: 'none' }}>
                                <Button variant="contained">Register</Button>
                            </Link>
                            <Link to={'/login'} style={{ textDecoration: 'none' }}>
                                <Button variant="contained">Login</Button>
                            </Link>
                        </div>

                </Grid>
            </Paper>
        </Grid>
    );
}
export default ResetPage;