/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
 api: {
  bodyParser: false,
  externalResolver: true,
 },
};

const target = 'http://localhost:3001';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const proxyResult = httpProxyMiddleware(req, res, {
      // You can use the `http-proxy` option
      target,
      // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
      pathRewrite: [
        {
          patternStr: '^/api/proxy',
          replaceStr: '',
        },
      ],
      secure: false,
    });
  
  // console.log('👻 — proxyResult', proxyResult);

 return proxyResult
};