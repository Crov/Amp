exports.notFound = (req, res) => {
    res.status(404).render('error', {
        code: '404',
        message: 'Page not found'
    });
};

exports.server = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).render('error', {
        code: String(err.status || 500),
        message: err.status === 403 ? 'Access denied' : 'Something went wrong'
    });
};
