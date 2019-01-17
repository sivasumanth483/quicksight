var AWS = require('aws-sdk');
var express = require('express');
var app = express();




this.getQuickSightUrl = function (idToken, username, callback) {
    //  console.log('Token '+ idToken);
    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "XXXXXXXXXXXXXXXXXX",
        Logins: {
            'cognito-idp.us-east-1.amazonaws.com/XXXXXXXXXX': idToken
        }
    });



    var params = {
        //DurationSeconds: 3600,
        //ExternalId: "123ABC",
        RoleArn: "arn:aws:iam::XXXXXXXXXXX:role/Cognito_quicksightAuth_Role",
        RoleSessionName: username
    };
    var sts = new AWS.STS({
        apiVersion: '2011-06-15'
    });
    sts.assumeRole(params, function (err, data) {
        if (err) console.log("Assumwe erri :::::::::::::::::: ", err, err.stack); // an error occurred
        else {
            var params = {
                AwsAccountId: 'XXXXXXXX',
                Email: 'XXXXXXXXXXXXX',
                IdentityType: 'IAM', //| QUICKSIGHT, /* required */
                Namespace: 'default',
                UserRole: 'READER', //ADMIN | AUTHOR | READER | RESTRICTED_AUTHOR | RESTRICTED_READER, /* required */
                IamArn: 'arn:aws:iam::XXXXXXXXX:role/Cognito_quicksightAuth_Role',
                SessionName: username,
            };
            AWS.config.update({

                accessKeyId: data.Credentials.AccessKeyId,
                secretAccessKey: data.Credentials.SecretAccessKey,
                sessionToken: data.Credentials.SessionToken,
                "region": "us-east-1"
            });
            var quicksight = new AWS.Service({

                apiConfig: require("../quicksightconfig.json"),
                region: "us-east-1"
            });
            quicksight.registerUser(params, function (err, data1) {
                if (err) {
                    console.log(":::::::::::::::::::::::");
                    console.log(JSON.stringify(err));
                    if (err.statusCode == 409) {
                        // console.log("Register User :::::::::::::::: ", data1);
                        quicksight.getDashboardEmbedUrl({
                                AwsAccountId: "XXXXXXXXXX",
                                DashboardId: "XXXXXXX",
                                IdentityType: "IAM",
                                ResetDisabled: true,
                                SessionLifetimeInMinutes: 400,
                                UndoRedoDisabled: false
                            },
                            function (err, data) {
                                if (!err) {
                                    console.log(Date());
                                    callback(data);
                                } else {
                                    console.log(err);
                                    callback();
                                }
                            }
                        );

                    }
                    console.log("err register user ::::::::::::::::::", err, err.stack);
                } // an error occurred
                else {
                    // console.log("Register User :::::::::::::::: ", data1);
                    quicksight.getDashboardEmbedUrl({
                            AwsAccountId: "XXXXXXXXXXXXXX",
                            DashboardId: "XXXXXXXXXXXXX",
                            IdentityType: "IAM",
                            ResetDisabled: true,
                            SessionLifetimeInMinutes: 400,
                            UndoRedoDisabled: false
                        },
                        function (err, data) {
                            if (!err) {
                                console.log(Date());
                                callback(data);
                            } else {
                                console.log(err);
                                callback();
                            }
                        }
                    );
                }
            });
        }
    });
}
}