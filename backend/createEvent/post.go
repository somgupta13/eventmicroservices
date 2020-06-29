package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	uuid "github.com/satori/go.uuid"
	"os"
)
type Duration struct {
	StartTime string `json:"start_time"`
	EndTime string `json:"end_time"`
}
type Request struct {
	Id          string   `json:"id"`
	UserCogId   string   `json:"cogid"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Status      string   `json:"status"`
	Duration    Duration `json:"duration"`

}



var (
	db_session *dynamodb.DynamoDB

	table_name = "event_name"

	res events.APIGatewayProxyResponse

	err error
)
func init(){

	region := os.Getenv("REGION")


	sess,_ := session.NewSession(&aws.Config{

		Region:      aws.String(region),
	})


	db_session = dynamodb.New(sess)

}
func post(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse,error){

	if request.HTTPMethod == "POST"{
		event := Request{
			Id : uuid.NewV4().String(),
		}

		_ = json.Unmarshal([]byte(request.Body),&event)

		mapped_query, _ := dynamodbattribute.MarshalMap(event)

		input := &dynamodb.PutItemInput{
			Item:      mapped_query,
			TableName: aws.String(table_name),
		}

		_, err = db_session.PutItem(input)



		json_object, _ := json.Marshal(event)

		res = events.APIGatewayProxyResponse{
			Body: string(json_object),
			StatusCode: 200,
			Headers: make(map[string]string),
		}

		res.Headers["Access-Control-Allow-Origin"] = "*"
		res.Headers["Access-Control-Allow-Methods"] = "POST"
	}
	return res ,err
}
func main() {
	lambda.Start(post)
}
