import { Redirect } from "@reach/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";



export const PrivateRoute = (props: any) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const firstLoging = useSelector((state: RootState) => state.auth.firstLoging);
    const logedUser = user;
    let { as: Comp, ...otherProps } = props;
    const title = props.title;
    useEffect(() => {
        document.title = title || '';
    }, [title]);
    return !Comp ? props.children :
        logedUser || firstLoging ? (
            <Comp {...otherProps} />
        ) : (
            <Redirect to="/login" replace={true} noThrow={true} />
        );
};