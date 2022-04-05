import React, { useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconCamera } from 'assets/icons/customize/config'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const baseStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    marginLeft: 3,
    marginRight: 20,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: '50% ',
    backgroundColor: '#C4C4C4',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: 'rgb(230 136 89)',
    borderWidth: 2,
};

const acceptStyle = {
    borderColor: '#00e676',
    backgroundColor: 'rgb(0 230 118 / 20%)',
};

const rejectStyle = {
    borderColor: '#ff1744',
    backgroundColor: 'rgb(255 23 68 / 20%)',
};

// STYLES PREVIEW
const thumbsContainer = {
    display: 'flex',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    marginLeft: 3,
    marginRight: 20,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: '50% ',
    border: '1px solid #C4C4C4',
    transition: 'border .24s ease-in-out'
};

const thumb = {
    borderRadius: '50%',
    marginBottom: 0,
    marginRight: 0,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const thumbInnerEdit = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
    borderRadius: '50%',
    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.5)',
};

const iconCamera = {
    position: 'absolute',
    top: '28px',
    left: '28px'
};


const img = {
    marginTop: '5px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    objectFit: 'cover'
};

const imgEdit = {
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    objectFit: 'cover'
}

const DropzoneImage = ({files, setFiles, isEdit}) => {

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })))
        }
    });

    const thumbs = files.map(file => (
        <div className='mb-2' style={thumb}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    alt='img'
                />
            </div>
        </div>
    ));

    const thumbsEdit = files.map(file => (
        <div className='mb-2' style={thumb}>
            <div style={thumbInnerEdit}>
                <img
                    src={file.preview}
                    style={imgEdit}
                    alt='img'
                />
                <div style={iconCamera}> <IconCamera /></div>
            </div>
        </div>
    ));

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    useEffect(() => () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));

        return () => {
            setFiles([])
        }
    }, [files, setFiles]);

    const handleDeleteImg = () => {
        setFiles([]);
    }

    return (  
        <div>
            {isEdit ? (
                files.length === 0 ?
                    <div>
                        <div {...getRootProps({ style })} >
                            <input {...getInputProps()} />
                            <div><IconCamera /></div>
                        </div>
                    </div>
                    :
                <div className='d-flex flex-column'>
                    <div {...getRootProps({ style })} >
                        <input {...getInputProps()} />
                        {thumbsEdit}
                    </div>
                </div>
            ) : (
                files.length === 0 ?
                    <div>
                        <div {...getRootProps({ style })} >
                            <input {...getInputProps()} />
                            <div><IconCamera /></div>
                        </div>
                    </div>
                    :
                <div className='d-flex flex-column'>
                    <div style={thumbsContainer}>
                        {thumbs}
                    </div>
                    <IconButton onClick={handleDeleteImg}>
                        <CloseIcon />
                    </IconButton>
                </div>
            )}
        </div>
    );
}

export default DropzoneImage;