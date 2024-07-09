const bypassFn = function (req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', 'GET, POST, HEAD, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      return res.send('');
    } else {
      console.log("Else")
      console.log('########## REQ ', req.url)
      return null;
    }
  } catch (error) {
    console.log('error', error);
  }
};

const PROXY_CONFIG = {
  '/portal-api': {
    target: 'http://tkit-portal-server/',
    secure: false,
    pathRewrite: {
      '^.*/portal-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  },
  '/bff': {
    target: 'http://localhost:8081',
    secure: false,
    pathRewrite: {
      '^.*/bff': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  },
};

module.exports = PROXY_CONFIG;
