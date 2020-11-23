import {Formik}           from 'formik'
import React              from 'react'
import {useDispatch}      from 'react-redux'
import {genericFormStyle} from '../../themes/signup'
import Div                from '../Basic/Div'
import H3                 from '../Basic/H3'
import SubmitButton       from '../Basic/SubmitButton'
import FieldSwitch        from './FieldSwitch'

const GenericFormik = ({initialValues, fields, options, validationSchema, dispatchAction, formHeading, buttonText, enableReinitialize, theme}) => {
    const dispatch = useDispatch()
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => dispatch({type: dispatchAction, payload: values})}
            enableReinitialize={enableReinitialize}
        >
            {formik => (
                <Div
                    as="form"
                    theme={{...genericFormStyle, ...theme}}
                    onSubmit={formik.handleSubmit}
                >
                    <H3 theme={{...genericFormStyle.heading, ...theme.heading}}>{formHeading}</H3>
                    {fields.map((f, i) =>
                        <FieldSwitch
                            key={i}
                            formik={formik}
                            field={f}
                            options={options}
                        />
                    )}
                    <SubmitButton theme={{...genericFormStyle.button, ...theme.button}}>
                        {buttonText}
                    </SubmitButton>
                </Div>
            )}
        </Formik>
    )
}

export default GenericFormik