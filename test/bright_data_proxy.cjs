#!/usr/bin/env node
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
require('axios-https-proxy-fix').get('http://lumtest.com/myip.json',
    {
        proxy: {
            host: 'brd.superproxy.io',
            port: '22225',
            auth: {
                username: 'brd-customer-hl_7c04e802-zone-isp',
                password: '32nhzcugq80f'
            }
        }
    }
).then(function (data) {
    console.log('success');
    console.log(data.data);
}, function (err) {
    console.error(err);
});