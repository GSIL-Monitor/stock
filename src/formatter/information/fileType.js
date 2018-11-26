
const fileType = (_fileType) => {
    let file_type, imgClass, text, type
    if (_fileType) {
        type = _fileType.toLowerCase()
    }
    if (!type || Object.is(type, 'null')) {
        file_type = ''
        imgClass = 'pdf-no-ico'
        text = '--'
    } else {
        if (Object.is(type, 'pdf')) {
            file_type = 'pdf'
            imgClass = 'ico-read-pdf'
            text = ''
        } else if (Object.is(type, 'text')) {
            file_type = 'text'
            imgClass = 'textFile-img'
            text = ''
        } else if (['doc', 'docx'].includes(type)) {
            file_type = 'doc'
            imgClass = 'readingDOC-img'
            text = ''
        } else if (['xlsx', 'xls'].includes(type)) {
            file_type = _fileType //'xls'
            imgClass = 'readingXLSX-img'
            text = ''
        } else if (['rar', 'zip'].includes(type)) {
            file_type = _fileType
            imgClass = 'compress-img'
            text = ''
        } else {
            file_type = type
            imgClass = 'elseFile-img'
            text = ''
        }
    }

    return {
        file_type,
        imgClass,
        text,
    }
}

export default fileType
