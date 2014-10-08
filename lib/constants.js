
// Constants file 
// used across the identity server 
//
//exports.DATABASE_URL = 'localhost:27017/koneksa_staging_poc_ids';
exports.DATABASE_URL = process.env.DATABASE_URL
exports.SUCCESS = {http_status: 200, status: 200, message: 'Success'};
exports.BAD_REQUEST = {http_status: 400, status: 400, message: 'Bad request - malformed request'};
exports.NOT_AUTHORIZED = {http_status:401, status: 401, message: 'not authorized' };
exports.FAILURE = {http_status:500, status: 500, message: 'failure - something went wrong in the status'}
exports.E1000 = {http_status:200, status:1000, message: 'incorrect input - one or more fields missing' }
exports.E1001 = {http_status:200, status:1001, message: 'no result found'}
exports.E1002 = {http_status:200, status:1002, message: 'more than one result found - expecting just one'}
exports.E1003 = {http_status:200, status:1003, message: 'one result found - expecting more than one'}
exports.E1004 = {http_status:200, status:1004, message: 'one result found - expecting no result'}
exports.salt=process.env.salt
exports.logFile=process.env.logfile
exports.logLevel=process.env.loglevel
exports.environment=process.env.environment
exports.logdb=true
exports.ACCESS_TOKEN_EXPIRY_ITEM=process.env.ACCESS_TOKEN_EXPIRY_ITEM
exports.ACCESS_TOKEN_EXPIRY_VALUE=process.env.ACCESS_TOKEN_EXPIRY_VALUE
exports.ACCESS_TOKEN_EXPIRY_WINDOW=process.env.ACCESS_TOKEN_EXPIRY_WINDOW
exports.ACCESS_TOKEN_DEFAULT_EXPIRY_DAYS=30
exports.ACCESS_TOKEN_DEFAULT_EXPIRY_HOURS=8
exports.CONSTANT_DAY='day'
exports.CONSTANT_MONTH='month'
exports.CONSTANT_YEAR='year'
exports.CONSTANT_HOUR='hour'
exports.CONSTANT_MIN='min'
exports.CONSTANT_SEC='seconds'
exports.MANDRILL_API_KEY=process.env.MANDRILL_API_KEY
exports.redisurl=process.env.REDISURL
exports.useredis=process.env.USEREDIS
// Alert information 
exports.alert=process.env.ALERT
exports.alertTypes=process.env.ALERT_TYPES
exports.alertEmails=process.env.ALERT_EMAILS
exports.alertPhones=process.env.ALERT_PHONES
exports.twilioRegisteredPhone=process.env.TWILIO_REGISTERED_PHONE
// Twilio account information 
exports.TWILIO_ACCOUNT_SID=process.env.TWILIO_ACCOUNT_SID;
exports.TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN;
exports.TWILIO_CALLBACK_URL=process.env.TWILIO_CALLBACK_URL
//MANDRILL_API_KEY=8s_wfCk25KbodFlDexi-QQ
//exports.salt =  'dc7b56537bd3ab766ef66836a8a8146fd6bd22394812e138e7a48d197ce11aaf4d4c119834b6a5e3ba531d45d3b7de61d8c56d423b663b65d9bb2389be7abd3f75b3d315ece1c060363b1c183649f297d39e027fadd21a3ccb71b7997a0d8e1633390d40117bd7016ae6da2affd1a90660afa01463a7e420d144ea3d49998f229f1eca479964e3e5344596dccf3c422f4a2a52faf8298dccc62f758cf303ab7fd63542331087e7ea20df4b5022fb51ac518ed9574116f56750eaa104df41e37d5bca73919082670e4e04bcb96c0ddf7a78dd052c328710fbe6e9417dac55665b18f53de06054fde3350915adad0b00645b2d804e399356baed0dfff442bf'
