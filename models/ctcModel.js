var mongoose = require('mongoose'),
    db = mongoose.createConnection(process.env.DATABASE_URL),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CtcModel = function() {

    /**
     *
     * @type {mongoose.Schema}
     * logs events to the identity server log
     */

    var Log = new Schema({
        id: Number //id of user or organization or client application
            ,
        idType: Number //type of id
            ,
        sessionId: String // Session id
            ,
        method: String //see enumeration below
            ,
        action: String //see enumeration below
            ,
        value: String //value supplied by input if value type -1 or -2 || null
            ,
        msg: String //error message if value type -2 || null
            ,
        timestamp: Date //UTC time stamp - mongo stores dates as UTC dates by default
    });

    /**
     *
     * @type {mongoose.Schema}
     * object to store valid corp email address domains e.g. koneksahealth.com, kh.com, khcorp.com
     * schema cannot be instantiated outside
     */

    var User = new Schema({
        userId: Number //baseMemberId + count of current user + 1
            ,
        orgId: Number //from org schema - org that user is joining kh.com to work with
            ,
        firstName: String //first name of user
            ,
        lastName: String //last name of user
            ,
        email: String //must be validated to match an email address - can be any non org email address e.g. joh.doe@email
            ,
        phone: String // Valid phone number 
            ,
        username: String //must not be first or last name - need to be a screen name for use in app e.g. top12345
            ,
        password: String //must be sha256 one way encrypted string with IV and seed set in process environment variables
            ,
        dateSignUp: Date //date user sign up on kh app - mongo store in UTC time
            ,
        acceptTerms: Boolean //true if user checked they accept terms on sign up - cannot sign up unless true
            ,
        userType: Number //see enumeration below
            ,
        userState: Number //see enumeration below
            ,
        accountToken: String //sha256 string to send in email validation and password reset email as web link - use for NONCE when sign up & login first load
    });

    /**
     *
     * @type {mongoose.Schema}
     * oAuth access tokens
     */
    var AccessToken = new Schema({
        accessToken: String //access token returned with client authenticated access
            ,
        userId: String //id of user serialized as string
            ,
        expires: Date //make expires = current Date + 30 days for now

    });


    var Profile = new Schema({
        name: String
    }, {
        _id: false
    });

    /**
     *
     * @type {mongoose.Schema}
     * oAuth refresh tokens
     */
    var RefreshToken = new Schema({
        accessToken: String //access token returned with client authenticated access
            ,
        userId: String //id of user serialized as string
            ,
        expires: Date //make expires = current Date + 30 days for now

    });

    var Search = new Schema({
        search_text: String,
        session_token: String,
        ctcs: [Ctc]
    });

    var Ctc = new Schema({
        nct_id: String,
        brief_summary: String,
        overall_status: String,
        study_type: String,
        conditions: [String],
        primary_outcomes: [Outcomes],
        secondary_outcomes: [Outcomes]
    }, {
        _id: false
    });

    var Outcomes = new Schema({
        measure: String,
        description: String,
        timeframe: String,
        safetyIssue: String
    }, {
        _id: false
    });

    this.Logs = db.model('Logs', Log);
    this.Users = db.model('Users', User);
    this.AccessTokens = db.model('AccessTokens', AccessToken);
    this.RefreshTokens = db.model('RefreshTokens', RefreshToken);
    this.Searchs = db.model('Searchs', Search);
    this.db = db;

};
exports.ctcModel = CtcModel;
