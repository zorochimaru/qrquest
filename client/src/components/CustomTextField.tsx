import { FieldAttributes, useField } from 'formik'

import React, { FC } from 'react'

const CustomTextField: FC<FieldAttributes<{}>> = ({ placeholder, ...props }) => {
    const [field, meta] = useField<{}>(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (<></>)
}

export default CustomTextField
