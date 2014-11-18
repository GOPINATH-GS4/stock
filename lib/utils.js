var _ = require('underscore');
var crypto = require('crypto');
var constants = require('./constants.js');
var u = require('util');


var utils = function(log) {

    this.storeSessionKey = function(session, tokenKey, tokenValue, expire) {
        if (constants.redisurl === null || typeof constants.redisurl === 'undefined') {
            var client = session.createClient();
        } else {
            var client = session.createClient(constants.redisurl);
        }

        client.set(tokenKey, tokenValue);
        client.expire(tokenKey, expire);
        client.quit();

    }

    this.isNumber = function(value) {
        var numbers = /^[0-9]+$/;
        return numbers.test(value);
    }

    this.getSessionKey = function(session, tokenKey, callback) {
        if (constants.redisurl === null || typeof constants.redisurl === 'undefined') {
            var client = session.createClient();
        } else {
            var client = session.createClient(constants.redisurl);
        }
        var key = client.get(tokenKey, function(err, reply) {
            callback(reply);
        });
        client.quit();
    }

    this.headerHasClientToken = function(header, callback) {

        if (_.has(header, 'clienttoken'))
            callback(header.clienttoken);
        else
            callback(null);
    }
    this.headerHasUserToken = function(header, callback) {

        if (_.has(header, 'usertoken'))
            callback(header.usertoken);
        else
            callback(null);
    }

    this.dataContainsKey = function(collection, tokenName, callback) {

        if (_.has(collection, tokenName)) {
            var token = _.pick(collection.tokenName);
            callback(collection[tokenName]);
        } else
            callback(null);

    }
    this.updateObject = function(collection, keyName, keyValue, valueName, newValue, mode) {
        _.each(collection, function(value, key, it) {
            _.each(value, function(value, key, it) {
                if (key === keyName && value === keyValue) {
                    if (mode == 'a')
                        it[valueName] = it[valueName] + newValue;
                    else
                        it[valueName] = newValue;

                    return collection;
                }
            });
        });
        return collection;
    }

    // ----------------------- Validation functions -----------------
    this.isValidName = function(val) {
        var re = /\w{3,}/;
        return re.test(val);
    };
    this.isValidUserName = function(val) {
        var re = /\w{5,}/;
        return re.test(val);
    }
    this.isValidPassword = function(val) {
        var re = /\w{6,}/;
        return re.test(val);
    }
    this.isValidPhone = function(val) {
        var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        return re.test(val);
    }
    this.isValidEmail = function(val) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(val);
    }
    this.isValidUrl = function(val) {
            if (typeof val != 'undefined') {
                var re = new RegExp(
                    "^" +
                    "(?:(?:http(s)?)://)?" +
                    "(?:\\S+(?::\\S*)?@)?" +
                    "(?:" +
                    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                    "|" +
                    "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
                    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                    ")" +
                    "(?::\\d{2,5})?" +
                    "(?:/[^\\s]*)?" +
                    "$", "i"
                );
                return re.test(val);
            } else {
                return false;
            }
        }
        // -----------------------------------------------------------------
    this.getClientIp = function(req) {

        var ipAddress;
        var forwardedIpsStr = req.header('x-forwarded-for');

        if (forwardedIpsStr) {
            var forwardedIps = forwardedIpsStr.split(',');
            ipAddress = forwardedIps[0];
        }
        if (!ipAddress) {
            ipAddress = req.connection.remoteAddress;
        }
        return ipAddress;
    }

    this.digestPassword = function(password, callback) {

        var digest;
        var digest = crypto.createHash('sha256');
        digest.update(constants.salt + password);
        var digestHex = digest.digest('base64');
        callback(digestHex);
    };

    this.encodeDecodeBase64 = function(data, base, callback) {
        var buffer;
        if (base)
            buffer = new Buffer(data).toString('base64');
        else
            buffer = new Buffer(data, 'base64').toString('ascii').toString();
        callback(buffer);
    }

    // Send email 
    this.sendMail = function(mailData, callback) {

    };
    this.writeResponse = function(req, res, response) {

        console.log('-----------------------------  Response ---------------------------------');
        console.log(u.inspect(response));
        console.log('--------------------------  Response END ---------------------------------');

        var returnResponse = JSON.parse(JSON.stringify(response));
        var status = 200;

        res.writeHead(status, {
            'Content-Length': Buffer.byteLength(JSON.stringify(returnResponse),'utf8'),
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(returnResponse));
        var fs = require('fs');

        fs.writeFileSync('/tmp/11', JSON.stringify(returnResponse));
        res.end();
    }
    this.logMessage = function(id, data) {

        var level = (_.pick(data, 'level')['level'] === null) ? 0 : _.pick(data, 'level')['level'];
        var type = (_.pick(data, 'type')['type'] === null) ? 0 : _.pick(data, 'type')['type'];

        var logData = {
            id: data.id,
            idType: data.idType,
            method: data.method,
            action: data.action,
            value: data.value,
            msg: data.msg,
            timestamp: new Date()
        };
        if (level > constants.logLevel)
            log.info(JSON.stringify(logData));

        if (type === 'error')
            log.error(JSON.stringify(logData));

        if (constants.logdb === true) {
            id.insertLog(data, function(err) {});
        }

    }
    this.makeLogData = function(level, type, sessionId, id, idType, method, action, value, msg) {

        return {
            level: level,
            type: type,
            sessionId: sessionId,
            id: id,
            idType: idType,
            method: method,
            action: action,
            value: value,
            msg: msg,
            timestamp: new Date()
        };
    }
    this.util = u;
    this._ = _;
}
exports.utils = utils;
