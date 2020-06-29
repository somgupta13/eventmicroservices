package main

import (
	"context"
	"encoding/json"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type Requestid struct {
	Id string `json:"id"`
}

var (
	db_session *dynamodb.DynamoDB

	table_name = "event_name"

	res events.APIGatewayProxyResponse

	err error
)

func init() {

	region := os.Getenv("REGION")

	sess, _ := session.NewSession(&aws.Config{

		Region: aws.String(region),
	})

	db_session = dynamodb.New(sess)

}
func remove(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	if request.HTTPMethod == "DELETE" {
		inputid := Requestid{}
		err = json.Unmarshal([]byte(request.Body), &inputid)
		input := &dynamodb.DeleteItemInput{

			Key: map[string]*dynamodb.AttributeValue{

				"id": {
					S: aws.String(inputid.Id),
				},
			},
			TableName: aws.String(table_name),
		}

		_, err = db_session.DeleteItem(input)

		res = events.APIGatewayProxyResponse{
			Body:       string("element deleted Successfully"),
			StatusCode: 200,
			Headers:    make(map[string]string),
		}

		res.Headers["Access-Control-Allow-Origin"] = "*"
		res.Headers["Access-Control-Allow-Methods"] = "DELETE"
	}
	return res, err
}
func main() {
	lambda.Start(remove)
}
