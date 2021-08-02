import { Redirect } from "@reach/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export const PrivateRoute = (props: any) => {
    const user = useSelector((state: RootState) => state.auth.user);
    let { as: Comp, ...otherProps } = props;

    return user ? (
        <Comp {...otherProps} />
    ) : (
        <Redirect to="/login" replace={true} noThrow={true} />
    );
};