import React           from 'react'
import ReactCrop       from 'react-image-crop'
import {Portal}        from 'react-portal'
import Div             from '../Basic/Div'
import Img             from '../Basic/Img'
import MotionDiv       from '../Basic/MotionDiv'
import {dropZoneStyle} from '../themes/elements'

const CropPortal = ({isOpen, uploadBlob, setCrop, crop, setCropPortalOpen, makeClientCrop, previewBlob}) => {
    const cropPortalVariants = {
        initial: {
            top: '100vh',
            opacity: 0
        },
        animate: {
            top: '5vh',
            opacity: 1
        }
    }

    return (
        <Portal>
            <MotionDiv
                variants={cropPortalVariants}
                initial="initial"
                animate={isOpen ? 'animate' : 'initial'}
                theme={dropZoneStyle.portal}
            >
                <Div theme={dropZoneStyle.portalInner}>
                    <Div theme={{height: 50, width: 50, borderRadius: 25, backgroundColor: '#AFE'}} onClick={() => setCropPortalOpen(false)}>close</Div>
                    {uploadBlob && (
                        <ReactCrop
                            src={uploadBlob}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={makeClientCrop}
                        />
                    )}

                    {previewBlob && (
                        <Div theme={dropZoneStyle.cropPreview}>
                            <Img
                                alt="Crop preview"
                                src={previewBlob}
                            />
                        </Div>
                    )}
                </Div>
            </MotionDiv>
        </Portal>
    )
}

export default CropPortal