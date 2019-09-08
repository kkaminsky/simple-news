module.exports = {
    devServer: {
        proxy: {
            '/api1': {
                target: 'http://192.168.8.104:5000/',
                pathRewrite: {
                    '/api1' : ''
                }
            },
          '/api2':{
            target: 'http://192.168.8.102:8080/',
            pathRewrite: {
              '/api2' : ''
            }
          }
        }
    }
};
