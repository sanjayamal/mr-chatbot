import json

import pytest

from lambdas import cognito_post_confirm


@pytest.fixture()
def cognito_trigger_event():
    return {
        "version": "1.0.0",
        "triggerSource": "PostConfirmation",
        "region": "us-east-1",
        "userPoolId": "us-east-1_pt5g2jdgu",
        "userName": "user@python.com",
        "callerContext": {
            "awsSdkVersion": "string",
            "clientId": "string"
        },
        "request": {
            "userAttributes": {
                "email": "user@python.com",
                "email_verified": True,
                "name": "User Python"
            },
            "clientMetadata": {
                "string": "string"
            }
        },
        "response": {}
    }


def test_lambda_handler(cognito_trigger_event):

    ret = cognito_post_confirm.handler(cognito_trigger_event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert "message" in ret["body"]
    assert data["message"] == "hello world"
