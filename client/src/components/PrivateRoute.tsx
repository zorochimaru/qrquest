import { Redirect } from "@reach/router";
import { useEffect } from "react";



export const PrivateRoute = (props: any) => {
    const accessToken = sessionStorage.getItem('accessToken');
    let { as: Comp, ...otherProps } = props;
    const title = props.title;
    useEffect(() => {
        document.title = title || '';
    }, [title]);
    return accessToken ? (
        <Comp {...otherProps} />
    ) : (
        <Redirect to="/login" replace={true} noThrow={true} />
    );
};